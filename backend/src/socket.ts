import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import { JwtPayload } from './types/index.js';

// Extend Socket to carry our auth data
interface AuthSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

let io: Server;

// ── Active-call map: userId → { peerId, callId } ───────────────────
// Tracks which user is currently in a call so we can detect "busy"
const activeCalls = new Map<string, { peerId: string; callId: string }>();

// ── Timeout map: callId → NodeJS.Timeout ────────────────────────────
// Auto-cancel unanswered calls after 30 seconds
const callTimeouts = new Map<string, NodeJS.Timeout>();

function generateCallId(a: string, b: string): string {
  return `${Date.now()}-${a}-${b}`;
}

function clearCallTimeout(callId: string) {
  const t = callTimeouts.get(callId);
  if (t) { clearTimeout(t); callTimeouts.delete(callId); }
}

function cleanupCall(callId: string, userA: string, userB: string) {
  clearCallTimeout(callId);
  // Only remove if the stored call matches this callId (avoids stale cleanup)
  if (activeCalls.get(userA)?.callId === callId) activeCalls.delete(userA);
  if (activeCalls.get(userB)?.callId === callId) activeCalls.delete(userB);
}

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  // ── JWT Authentication Middleware ──────────────────────────────────
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      socket.userId = payload.userId;
      socket.userEmail = payload.email;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  // ── Connection Handler ────────────────────────────────────────────
  io.on('connection', (rawSocket: Socket) => {
    const socket = rawSocket as AuthSocket;
    const userId = socket.userId!;

    console.log(`🔌 Socket connected: ${userId}`);

    // Join personal room so we can push notifications to this user
    socket.join(`user:${userId}`);

    // ── join_chat ─────────────────────────────────────────────────
    socket.on('join_chat', (friendId: string) => {
      const roomId = buildRoomId(userId, friendId);
      socket.join(roomId);
      console.log(`📥 ${userId} joined room ${roomId}`);
    });

    // ── leave_chat ────────────────────────────────────────────────
    socket.on('leave_chat', (friendId: string) => {
      const roomId = buildRoomId(userId, friendId);
      socket.leave(roomId);
      console.log(`📤 ${userId} left room ${roomId}`);
    });

    // ── send_message ──────────────────────────────────────────────
    socket.on('send_message', async (data: { receiverId: string; content: string }, ack?: (res: any) => void) => {
      const { receiverId, content } = data;

      if (!receiverId || !content?.trim()) {
        return ack?.({ error: 'receiverId and content required' });
      }
      if (userId === receiverId) {
        return ack?.({ error: 'Cannot message yourself' });
      }

      try {
        const [u1, u2] = userId < receiverId ? [userId, receiverId] : [receiverId, userId];
        const fs = await pool.query(
          'SELECT id FROM friendships WHERE user1_id=$1 AND user2_id=$2',
          [u1, u2]
        );
        if (!fs.rows.length) {
          return ack?.({ error: 'Not friends' });
        }

        const result = await pool.query(
          `INSERT INTO messages (sender_id, receiver_id, content)
           VALUES ($1,$2,$3)
           RETURNING id, sender_id, receiver_id, content, sent_at, is_read`,
          [userId, receiverId, content.trim()]
        );

        const senderInfo = await pool.query(
          'SELECT name, avatar_color FROM users WHERE id=$1',
          [userId]
        );

        const message = {
          ...result.rows[0],
          sender_name: senderInfo.rows[0]?.name,
          sender_avatar_color: senderInfo.rows[0]?.avatar_color,
        };

        const roomId = buildRoomId(userId, receiverId);
        io.to(roomId).emit('new_message', message);

        io.to(`user:${receiverId}`).emit('notification', {
          type: 'new_message',
          senderId: userId,
          senderName: message.sender_name,
          preview: content.trim().slice(0, 50),
        });

        ack?.({ ok: true, message });
      } catch (err: any) {
        console.error('send_message error:', err.message);
        ack?.({ error: 'Server error' });
      }
    });

    // ── mark_read ─────────────────────────────────────────────────
    socket.on('mark_read', async (friendId: string) => {
      try {
        await pool.query(
          `UPDATE messages SET is_read=TRUE
           WHERE receiver_id=$1 AND sender_id=$2 AND is_read=FALSE`,
          [userId, friendId]
        );
        io.to(`user:${friendId}`).emit('messages_read', { readBy: userId });
      } catch (err: any) {
        console.error('mark_read error:', err.message);
      }
    });

    // ══════════════════════════════════════════════════════════════
    //  WebRTC CALL SIGNALING
    // ══════════════════════════════════════════════════════════════

    // ── call_user ─────────────────────────────────────────────────
    // Caller initiates. Sends SDP offer + call type to receiver.
    socket.on('call_user', async (data: {
      receiverId: string;
      offer: { type: string; sdp?: string };
      callType: 'audio' | 'video';
    }) => {
      const { receiverId, offer, callType } = data;

      // Security: prevent calling yourself
      if (userId === receiverId) return;

      // Check if the CALLER is already in a call
      if (activeCalls.has(userId)) {
        return socket.emit('call_error', { message: 'You are already in a call' });
      }

      // Check if the RECEIVER is busy
      if (activeCalls.has(receiverId)) {
        return socket.emit('user_busy', { userId: receiverId });
      }

      // Fetch caller info for the incoming-call UI
      try {
        const callerInfo = await pool.query(
          'SELECT name, avatar_color FROM users WHERE id=$1',
          [userId]
        );

        const callId = generateCallId(userId, receiverId);

        // Mark both as in-call
        activeCalls.set(userId, { peerId: receiverId, callId });
        activeCalls.set(receiverId, { peerId: userId, callId });

        // Send the incoming call to the receiver
        io.to(`user:${receiverId}`).emit('incoming_call', {
          callId,
          callerId: userId,
          callerName: callerInfo.rows[0]?.name ?? 'Unknown',
          callerAvatarColor: callerInfo.rows[0]?.avatar_color ?? '#6366f1',
          offer,
          callType,
        });

        // Confirm to caller that ringing has started
        socket.emit('call_ringing', { callId, receiverId });

        // ── 30-second timeout ─────────────────────────────────────
        const timeout = setTimeout(() => {
          cleanupCall(callId, userId, receiverId);
          socket.emit('call_timeout', { callId });
          io.to(`user:${receiverId}`).emit('call_timeout', { callId });
          console.log(`⏱️  Call ${callId} timed out`);
        }, 30000);

        callTimeouts.set(callId, timeout);

        console.log(`📞 ${userId} calling ${receiverId} (${callType})`);
      } catch (err: any) {
        console.error('call_user error:', err.message);
      }
    });

    // ── answer_call ───────────────────────────────────────────────
    // Receiver accepts and sends SDP answer back to caller.
    socket.on('answer_call', (data: {
      callId: string;
      callerId: string;
      answer: { type: string; sdp?: string };
    }) => {
      const { callId, callerId, answer } = data;

      // Security: only the actual receiver can answer
      const callerEntry = activeCalls.get(callerId);
      if (!callerEntry || callerEntry.callId !== callId) return;

      clearCallTimeout(callId);

      io.to(`user:${callerId}`).emit('call_accepted', {
        callId,
        answer,
        answererId: userId,
      });

      console.log(`✅ ${userId} answered call ${callId}`);
    });

    // ── reject_call ───────────────────────────────────────────────
    socket.on('reject_call', (data: { callId: string; callerId: string }) => {
      const { callId, callerId } = data;

      cleanupCall(callId, userId, callerId);

      io.to(`user:${callerId}`).emit('call_rejected', {
        callId,
        rejectedBy: userId,
      });

      console.log(`❌ ${userId} rejected call ${callId}`);
    });

    // ── webrtc_ice_candidate ──────────────────────────────────────
    // Relay ICE candidates between peers.
    socket.on('webrtc_ice_candidate', (data: {
      targetUserId: string;
      candidate: Record<string, unknown>;
    }) => {
      const { targetUserId, candidate } = data;

      io.to(`user:${targetUserId}`).emit('webrtc_ice_candidate', {
        candidate,
        fromUserId: userId,
      });
    });

    // ── end_call ──────────────────────────────────────────────────
    socket.on('end_call', (data: { callId: string; peerId: string }) => {
      const { callId, peerId } = data;

      cleanupCall(callId, userId, peerId);

      io.to(`user:${peerId}`).emit('call_ended', {
        callId,
        endedBy: userId,
      });

      console.log(`📴 ${userId} ended call ${callId}`);
    });

    // ── disconnect ────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      // If user was in a call, notify the peer
      const callEntry = activeCalls.get(userId);
      if (callEntry) {
        cleanupCall(callEntry.callId, userId, callEntry.peerId);
        io.to(`user:${callEntry.peerId}`).emit('call_ended', {
          callId: callEntry.callId,
          endedBy: userId,
          reason: 'disconnected',
        });
      }
      console.log(`🔌 Socket disconnected: ${userId} (${reason})`);
    });
  });

  return io;
}

// Build a deterministic room ID for a pair of users
function buildRoomId(a: string, b: string): string {
  return a < b ? `chat:${a}:${b}` : `chat:${b}:${a}`;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}
