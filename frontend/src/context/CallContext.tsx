'use client';

import {
  createContext, useContext, useState, useEffect,
  useRef, useCallback, ReactNode,
} from 'react';
import { useSocket } from '@/lib/useSocket';
import { useAuth } from './AuthContext';
import {
  CallState, CallContextType, IncomingCallData,
} from '@/types';

const CallContext = createContext<CallContextType | null>(null);

// ── ICE Servers (STUN + TURN) ───────────────────────────────────────
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
];

// ── Media constraints ───────────────────────────────────────────────
const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 640, max: 1280 },
  height: { ideal: 480, max: 720 },
  frameRate: { ideal: 24, max: 30 },
};

export function CallProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const { socket } = useSocket(token);

  // ── State ─────────────────────────────────────────────────────────
  const [callState, setCallState]       = useState<CallState>('idle');
  const [callType, setCallType]         = useState<'audio' | 'video' | null>(null);
  const [callId, setCallId]             = useState<string | null>(null);
  const [peerId, setPeerId]             = useState<string | null>(null);
  const [peerName, setPeerName]         = useState<string | null>(null);
  const [peerAvatarColor, setPeerColor] = useState<string | null>(null);
  const [isMuted, setIsMuted]           = useState(false);
  const [isVideoOff, setIsVideoOff]     = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callError, setCallError]       = useState<string | null>(null);
  const [incomingCall, setIncomingCall]  = useState<IncomingCallData | null>(null);
  const [localStream, setLocalStream]   = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // ── Refs ───────────────────────────────────────────────────────────
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const durationTimer  = useRef<NodeJS.Timeout | null>(null);
  const ringtoneRef    = useRef<HTMLAudioElement | null>(null);

  // Keep a ref to callId so event handlers always see the latest
  const callIdRef   = useRef(callId);
  const peerIdRef   = useRef(peerId);
  callIdRef.current = callId;
  peerIdRef.current = peerId;

  // ── Helpers ───────────────────────────────────────────────────────

  const stopAllTracks = useCallback((stream: MediaStream | null) => {
    stream?.getTracks().forEach((t) => t.stop());
  }, []);

  const stopRingtone = useCallback(() => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  }, []);

  const resetState = useCallback(() => {
    setCallState('idle');
    setCallType(null);
    setCallId(null);
    setPeerId(null);
    setPeerName(null);
    setPeerColor(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setCallDuration(0);
    setCallError(null);
    setIncomingCall(null);
    setLocalStream(null);
    setRemoteStream(null);

    if (durationTimer.current) clearInterval(durationTimer.current);
    durationTimer.current = null;
    stopRingtone();
  }, [stopRingtone]);

  const cleanup = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.onicecandidate = null;
      peerConnection.current.ontrack = null;
      peerConnection.current.oniceconnectionstatechange = null;
      peerConnection.current.close();
      peerConnection.current = null;
    }
    stopAllTracks(localStream);
    resetState();
  }, [localStream, resetState, stopAllTracks]);

  const startDurationTimer = useCallback(() => {
    setCallDuration(0);
    durationTimer.current = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);
  }, []);

  // ── Get user media with fallback ──────────────────────────────────
  const acquireMedia = useCallback(async (type: 'audio' | 'video'): Promise<MediaStream> => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: AUDIO_CONSTRAINTS,
        video: type === 'video' ? VIDEO_CONSTRAINTS : false,
      };
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err: any) {
      // If video failed, try audio-only fallback
      if (type === 'video' && err.name !== 'NotAllowedError') {
        console.warn('Video failed, falling back to audio-only');
        setCallType('audio');
        return await navigator.mediaDevices.getUserMedia({ audio: AUDIO_CONSTRAINTS });
      }
      // Permission denied or no device
      if (err.name === 'NotAllowedError') {
        throw new Error('Microphone/camera permission denied. Please allow access in your browser settings.');
      }
      if (err.name === 'NotFoundError') {
        throw new Error('No microphone or camera found on this device.');
      }
      throw new Error('Could not access media devices.');
    }
  }, []);

  // ── Create RTCPeerConnection ──────────────────────────────────────
  const createPeer = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    // Send ICE candidates to the remote peer via signaling
    pc.onicecandidate = (event) => {
      if (event.candidate && socket && peerIdRef.current) {
        socket.emit('webrtc_ice_candidate', {
          targetUserId: peerIdRef.current,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    // Receive remote tracks
    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) setRemoteStream(stream);
    };

    // Handle ICE connection state changes (reconnection / failure)
    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;
      console.log('ICE state:', state);
      if (state === 'disconnected') {
        // Attempt ICE restart
        console.warn('ICE disconnected, attempting restart...');
        pc.restartIce();
      }
      if (state === 'failed') {
        setCallError('Connection failed. Please try again.');
        // Give user a moment to see the error, then cleanup
        setTimeout(() => {
          if (socket && callIdRef.current && peerIdRef.current) {
            socket.emit('end_call', { callId: callIdRef.current, peerId: peerIdRef.current });
          }
          cleanup();
        }, 2000);
      }
    };

    peerConnection.current = pc;
    return pc;
  }, [socket, cleanup]);

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC ACTIONS
  // ══════════════════════════════════════════════════════════════════

  // ── Call a user ───────────────────────────────────────────────────
  const callUser = useCallback(async (
    friendId: string,
    friendName: string,
    friendAvatarColor: string,
    type: 'audio' | 'video',
  ) => {
    if (!socket || callState !== 'idle') return;

    setCallError(null);
    setCallType(type);
    setPeerId(friendId);
    setPeerName(friendName);
    setPeerColor(friendAvatarColor);
    setCallState('calling');

    try {
      const stream = await acquireMedia(type);
      setLocalStream(stream);

      const pc = createPeer();

      // Add local tracks to the connection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('call_user', {
        receiverId: friendId,
        offer: pc.localDescription,
        callType: type,
      });
    } catch (err: any) {
      setCallError(err.message);
      setCallState('idle');
      cleanup();
    }
  }, [socket, callState, acquireMedia, createPeer, cleanup]);

  // ── Answer incoming call ──────────────────────────────────────────
  const answerCall = useCallback(async () => {
    if (!socket || !incomingCall) return;

    stopRingtone();
    setCallError(null);
    setCallState('connected');
    setCallType(incomingCall.callType);
    setCallId(incomingCall.callId);
    setPeerId(incomingCall.callerId);
    setPeerName(incomingCall.callerName);
    setPeerColor(incomingCall.callerAvatarColor);

    try {
      const stream = await acquireMedia(incomingCall.callType);
      setLocalStream(stream);

      const pc = createPeer();

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Set the remote offer
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));

      // Create and send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer_call', {
        callId: incomingCall.callId,
        callerId: incomingCall.callerId,
        answer: pc.localDescription,
      });

      setIncomingCall(null);
      startDurationTimer();
    } catch (err: any) {
      setCallError(err.message);
      cleanup();
    }
  }, [socket, incomingCall, acquireMedia, createPeer, cleanup, stopRingtone, startDurationTimer]);

  // ── Reject incoming call ──────────────────────────────────────────
  const rejectCall = useCallback(() => {
    if (!socket || !incomingCall) return;

    socket.emit('reject_call', {
      callId: incomingCall.callId,
      callerId: incomingCall.callerId,
    });

    stopRingtone();
    setIncomingCall(null);
    resetState();
  }, [socket, incomingCall, resetState, stopRingtone]);

  // ── End active call ───────────────────────────────────────────────
  const endCall = useCallback(() => {
    if (socket && callIdRef.current && peerIdRef.current) {
      socket.emit('end_call', {
        callId: callIdRef.current,
        peerId: peerIdRef.current,
      });
    }
    cleanup();
  }, [socket, cleanup]);

  // ── Toggle mute ───────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
      setIsMuted((m) => !m);
    }
  }, [localStream]);

  // ── Toggle video ──────────────────────────────────────────────────
  const toggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
      setIsVideoOff((v) => !v);
    }
  }, [localStream]);

  // ══════════════════════════════════════════════════════════════════
  //  SOCKET EVENT LISTENERS
  // ══════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!socket) return;

    // ── Incoming call ─────────────────────────────────────────────
    const handleIncomingCall = (data: IncomingCallData) => {
      // Play ringtone
      try {
        ringtoneRef.current = new Audio('/ringtone.mp3');
        ringtoneRef.current.loop = true;
        ringtoneRef.current.volume = 0.6;
        ringtoneRef.current.play().catch(() => { /* autoplay blocked */ });
      } catch { /* no audio file — silent ring */ }

      setIncomingCall(data);
      setCallState('ringing');
    };

    // ── Call ringing (caller side) ────────────────────────────────
    const handleCallRinging = (data: { callId: string; receiverId: string }) => {
      setCallId(data.callId);
    };

    // ── Call accepted ─────────────────────────────────────────────
    const handleCallAccepted = async (data: {
      callId: string;
      answer: RTCSessionDescriptionInit;
      answererId: string;
    }) => {
      const pc = peerConnection.current;
      if (!pc) return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        setCallState('connected');
        setCallId(data.callId);
        startDurationTimer();
      } catch (err: any) {
        console.error('Error setting remote description:', err);
        setCallError('Failed to establish connection.');
        cleanup();
      }
    };

    // ── Call rejected ─────────────────────────────────────────────
    const handleCallRejected = () => {
      setCallError('Call was declined.');
      setTimeout(() => cleanup(), 2000);
    };

    // ── User busy ─────────────────────────────────────────────────
    const handleUserBusy = () => {
      setCallError('User is busy on another call.');
      setTimeout(() => cleanup(), 2000);
    };

    // ── Call timeout ──────────────────────────────────────────────
    const handleCallTimeout = () => {
      stopRingtone();
      setCallError('No answer.');
      setTimeout(() => cleanup(), 2000);
    };

    // ── Call ended (by peer) ──────────────────────────────────────
    const handleCallEnded = () => {
      cleanup();
    };

    // ── Call error ────────────────────────────────────────────────
    const handleCallError = (data: { message: string }) => {
      setCallError(data.message);
      setTimeout(() => cleanup(), 2000);
    };

    // ── ICE candidate from peer ───────────────────────────────────
    const handleIceCandidate = async (data: {
      candidate: RTCIceCandidateInit;
      fromUserId: string;
    }) => {
      const pc = peerConnection.current;
      if (!pc) return;

      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    };

    socket.on('incoming_call', handleIncomingCall);
    socket.on('call_ringing', handleCallRinging);
    socket.on('call_accepted', handleCallAccepted);
    socket.on('call_rejected', handleCallRejected);
    socket.on('user_busy', handleUserBusy);
    socket.on('call_timeout', handleCallTimeout);
    socket.on('call_ended', handleCallEnded);
    socket.on('call_error', handleCallError);
    socket.on('webrtc_ice_candidate', handleIceCandidate);

    return () => {
      socket.off('incoming_call', handleIncomingCall);
      socket.off('call_ringing', handleCallRinging);
      socket.off('call_accepted', handleCallAccepted);
      socket.off('call_rejected', handleCallRejected);
      socket.off('user_busy', handleUserBusy);
      socket.off('call_timeout', handleCallTimeout);
      socket.off('call_ended', handleCallEnded);
      socket.off('call_error', handleCallError);
      socket.off('webrtc_ice_candidate', handleIceCandidate);
    };
  }, [socket, cleanup, startDurationTimer, stopRingtone]);

  // ── Cleanup on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CallContext.Provider value={{
      callState, callType, callId, peerId, peerName, peerAvatarColor,
      isMuted, isVideoOff, callDuration, callError,
      incomingCall, localStream, remoteStream,
      callUser, answerCall, rejectCall, endCall, toggleMute, toggleVideo,
    }}>
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be inside CallProvider');
  return ctx;
}
