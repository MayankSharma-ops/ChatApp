'use client';

import { useEffect, useRef } from 'react';
import { useCall } from '@/context/CallContext';
import {
  Phone, PhoneOff, Video, VideoOff,
  Mic, MicOff, X, PhoneIncoming,
} from 'lucide-react';

function formatDuration(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export default function CallOverlay() {
  const {
    callState, callType, callError, callDuration,
    peerName, peerAvatarColor,
    isMuted, isVideoOff,
    incomingCall, localStream, remoteStream,
    answerCall, rejectCall, endCall, toggleMute, toggleVideo,
  } = useCall();

  const localVideoRef  = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Bind local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Bind remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // ═════════════════════════════════════════════════════════════════
  //  INCOMING CALL NOTIFICATION
  // ═════════════════════════════════════════════════════════════════
  if (callState === 'ringing' && incomingCall) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-surface-card border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
          {/* Pulsing avatar */}
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: incomingCall.callerAvatarColor }}
            />
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg"
              style={{ backgroundColor: incomingCall.callerAvatarColor }}
            >
              {incomingCall.callerName.charAt(0).toUpperCase()}
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">{incomingCall.callerName}</h2>
          <p className="text-sm text-white/50 mb-1">
            Incoming {incomingCall.callType === 'video' ? 'Video' : 'Voice'} Call
          </p>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1 mb-8">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={rejectCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg shadow-red-500/30"
              aria-label="Decline call"
            >
              <PhoneOff size={26} />
            </button>

            <button
              onClick={answerCall}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg shadow-green-500/30"
              aria-label="Accept call"
            >
              {incomingCall.callType === 'video'
                ? <Video size={26} />
                : <Phone size={26} />
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  //  OUTGOING CALL (CALLING / WAITING)
  // ═════════════════════════════════════════════════════════════════
  if (callState === 'calling') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="text-center">
          {/* Avatar with ring animation */}
          <div className="relative mx-auto mb-6 w-28 h-28">
            <div
              className="absolute inset-0 rounded-full border-4 animate-ping opacity-30"
              style={{ borderColor: peerAvatarColor ?? '#6366f1' }}
            />
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl"
              style={{ backgroundColor: peerAvatarColor ?? '#6366f1' }}
            >
              {peerName?.charAt(0).toUpperCase() ?? '?'}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{peerName ?? 'Calling...'}</h2>
          <p className="text-sm text-white/50 mb-2">
            {callType === 'video' ? 'Video' : 'Voice'} call
          </p>

          {callError ? (
            <p className="text-red-400 text-sm mb-6">{callError}</p>
          ) : (
            <p className="text-white/40 text-sm mb-8 animate-pulse">Ringing…</p>
          )}

          <button
            onClick={endCall}
            className="w-16 h-16 mx-auto rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg shadow-red-500/30"
            aria-label="Cancel call"
          >
            <PhoneOff size={26} />
          </button>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  //  ACTIVE CALL (CONNECTED)
  // ═════════════════════════════════════════════════════════════════
  if (callState === 'connected') {
    const isVideo = callType === 'video';

    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
        {/* Remote stream (full screen) */}
        {isVideo ? (
          <div className="flex-1 relative bg-gray-900">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Local stream (PiP) */}
            <div className="absolute top-4 right-4 w-36 h-28 sm:w-44 sm:h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gray-800">
              {!isVideoOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  <VideoOff size={24} />
                </div>
              )}
            </div>

            {/* Call info */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">{peerName}</span>
              <span className="text-white/50 text-sm font-mono">{formatDuration(callDuration)}</span>
            </div>

            {callError && (
              <div className="absolute top-16 left-4 bg-red-500/20 text-red-300 px-4 py-2 rounded-xl text-sm">
                {callError}
              </div>
            )}
          </div>
        ) : (
          /* Audio-only call UI */
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
            {/* Hidden audio element for remote stream */}
            <audio ref={remoteVideoRef as any} autoPlay />

            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold text-white mb-6 shadow-2xl"
              style={{ backgroundColor: peerAvatarColor ?? '#6366f1' }}
            >
              {peerName?.charAt(0).toUpperCase() ?? '?'}
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">{peerName}</h2>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-mono">{formatDuration(callDuration)}</span>
            </div>

            {callError && (
              <p className="text-red-400 text-sm mt-4">{callError}</p>
            )}
          </div>
        )}

        {/* Controls bar */}
        <div className="bg-gray-900/95 backdrop-blur-md border-t border-white/5 px-6 py-5">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Mute */}
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                isMuted
                  ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {/* Toggle video (only in video calls) */}
            {isVideo && (
              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  isVideoOff
                    ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/40'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              >
                {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
              </button>
            )}

            {/* End call */}
            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg shadow-red-500/30"
              aria-label="End call"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  //  ENDED STATE (brief flash)
  // ═════════════════════════════════════════════════════════════════
  if (callState === 'ended') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-center">
          <PhoneOff size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-white/60 text-lg">Call ended</p>
          {callError && <p className="text-red-400 text-sm mt-2">{callError}</p>}
        </div>
      </div>
    );
  }

  // Idle — render nothing
  return null;
}
