import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import { JwtPayload } from './types/index.js';

interface AuthSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

let io: Server;

const activeCalls = new Map<string, { peerId: string; callId: string }>();
const callTimeouts = new Map<string, NodeJS.Timeout>();
const onlineUsers = new Set<string>();
const userSocketCounts = new Map<string, number>();

function generateCallId(a: string, b: string): string {
  return `${Date.now()}-${a}-${b}`;
}

function clearCallTimeout(callId: string) {
  const timeout = callTimeouts.get(callId);
  if (!timeout) return;

  clearTimeout(timeout);
  callTimeouts.delete(callId);
}

function cleanupCall(callId: string, userA: string, userB: string) {
  clearCallTimeout(callId);

  if (activeCalls.get(userA)?.callId === callId) activeCalls.delete(userA);
  if (activeCalls.get(userB)?.callId === callId) activeCalls.delete(userB);
}

function markUserConnected(userId: string) {
  const nextCount = (userSocketCounts.get(userId) ?? 0) + 1;
  userSocketCounts.set(userId, nextCount);

  if (nextCount === 1) {
    onlineUsers.add(userId);
    return true;
  }

  return false;
}

function markUserDisconnected(userId: string) {
  const currentCount = userSocketCounts.get(userId);
  if (!currentCount) return false;

  if (currentCount === 1) {
    userSocketCounts.delete(userId);
    return onlineUsers.delete(userId);
  }

  userSocketCounts.set(userId, currentCount - 1);
  return false;
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

  io.on('connection', (rawSocket: Socket) => {
    const socket = rawSocket as AuthSocket;
    const userId = socket.userId!;
    const becameOnline = markUserConnected(userId);

    console.log(`Socket connected: ${userId}`);

    socket.join(`user:${userId}`);
    socket.emit('online_users', Array.from(onlineUsers));

    if (becameOnline) {
      socket.broadcast.emit('user_online', { userId });
    }

    socket.on('presence_sync', () => {
      socket.emit('online_users', Array.from(onlineUsers));
    });

    socket.on('join_chat', (friendId: string) => {
      const roomId = buildRoomId(userId, friendId);
      socket.join(roomId);
      console.log(`${userId} joined room ${roomId}`);
    });

    socket.on('leave_chat', (friendId: string) => {
      const roomId = buildRoomId(userId, friendId);
      socket.leave(roomId);
      console.log(`${userId} left room ${roomId}`);
    });

    socket.on(
      'send_message',
      async (
        data: { receiverId: string; content: string },
        ack?: (res: { ok?: boolean; error?: string; message?: unknown }) => void
      ) => {
        const { receiverId, content } = data;

        if (!receiverId || !content?.trim()) {
          return ack?.({ error: 'receiverId and content required' });
        }

        if (userId === receiverId) {
          return ack?.({ error: 'Cannot message yourself' });
        }

        try {
          const [u1, u2] = userId < receiverId ? [userId, receiverId] : [receiverId, userId];
          const friendship = await pool.query(
            'SELECT id FROM friendships WHERE user1_id=$1 AND user2_id=$2',
            [u1, u2]
          );

          if (!friendship.rows.length) {
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
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error('send_message error:', message);
          ack?.({ error: 'Server error' });
        }
      }
    );

    socket.on('mark_read', async (friendId: string) => {
      try {
        await pool.query(
          `UPDATE messages SET is_read=TRUE
           WHERE receiver_id=$1 AND sender_id=$2 AND is_read=FALSE`,
          [userId, friendId]
        );

        io.to(`user:${friendId}`).emit('messages_read', { readBy: userId });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('mark_read error:', message);
      }
    });

    socket.on('typing_start', (data: { toUserId: string }) => {
      const toUserId = data?.toUserId;
      if (!toUserId || toUserId === userId) return;

      io.to(`user:${toUserId}`).emit('typing_start', { fromUserId: userId });
    });

    socket.on('typing_stop', (data: { toUserId: string }) => {
      const toUserId = data?.toUserId;
      if (!toUserId || toUserId === userId) return;

      io.to(`user:${toUserId}`).emit('typing_stop', { fromUserId: userId });
    });

    socket.on(
      'call_user',
      async (data: {
        receiverId: string;
        offer: { type: string; sdp?: string };
        callType: 'audio' | 'video';
      }) => {
        const { receiverId, offer, callType } = data;

        if (userId === receiverId) return;

        if (activeCalls.has(userId)) {
          return socket.emit('call_error', { message: 'You are already in a call' });
        }

        if (activeCalls.has(receiverId)) {
          return socket.emit('user_busy', { userId: receiverId });
        }

        try {
          const callerInfo = await pool.query(
            'SELECT name, avatar_color FROM users WHERE id=$1',
            [userId]
          );

          const callId = generateCallId(userId, receiverId);

          activeCalls.set(userId, { peerId: receiverId, callId });
          activeCalls.set(receiverId, { peerId: userId, callId });

          io.to(`user:${receiverId}`).emit('incoming_call', {
            callId,
            callerId: userId,
            callerName: callerInfo.rows[0]?.name ?? 'Unknown',
            callerAvatarColor: callerInfo.rows[0]?.avatar_color ?? '#6366f1',
            offer,
            callType,
          });

          socket.emit('call_ringing', { callId, receiverId });

          const timeout = setTimeout(() => {
            cleanupCall(callId, userId, receiverId);
            socket.emit('call_timeout', { callId });
            io.to(`user:${receiverId}`).emit('call_timeout', { callId });
            console.log(`Call ${callId} timed out`);
          }, 30000);

          callTimeouts.set(callId, timeout);
          console.log(`${userId} calling ${receiverId} (${callType})`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error('call_user error:', message);
        }
      }
    );

    socket.on(
      'answer_call',
      (data: {
        callId: string;
        callerId: string;
        answer: { type: string; sdp?: string };
      }) => {
        const { callId, callerId, answer } = data;
        const callerEntry = activeCalls.get(callerId);
        if (!callerEntry || callerEntry.callId !== callId) return;

        clearCallTimeout(callId);

        io.to(`user:${callerId}`).emit('call_accepted', {
          callId,
          answer,
          answererId: userId,
        });

        console.log(`${userId} answered call ${callId}`);
      }
    );

    socket.on('reject_call', (data: { callId: string; callerId: string }) => {
      const { callId, callerId } = data;

      cleanupCall(callId, userId, callerId);

      io.to(`user:${callerId}`).emit('call_rejected', {
        callId,
        rejectedBy: userId,
      });

      console.log(`${userId} rejected call ${callId}`);
    });

    socket.on(
      'webrtc_ice_candidate',
      (data: {
        targetUserId: string;
        candidate: Record<string, unknown>;
      }) => {
        const { targetUserId, candidate } = data;

        io.to(`user:${targetUserId}`).emit('webrtc_ice_candidate', {
          candidate,
          fromUserId: userId,
        });
      }
    );

    socket.on('end_call', (data: { callId: string; peerId: string }) => {
      const { callId, peerId } = data;

      cleanupCall(callId, userId, peerId);

      io.to(`user:${peerId}`).emit('call_ended', {
        callId,
        endedBy: userId,
      });

      console.log(`${userId} ended call ${callId}`);
    });

    socket.on('disconnect', (reason) => {
      const callEntry = activeCalls.get(userId);
      if (callEntry) {
        cleanupCall(callEntry.callId, userId, callEntry.peerId);
        io.to(`user:${callEntry.peerId}`).emit('call_ended', {
          callId: callEntry.callId,
          endedBy: userId,
          reason: 'disconnected',
        });
      }

      const becameOffline = markUserDisconnected(userId);
      if (becameOffline) {
        socket.broadcast.emit('user_offline', { userId });
      }

      console.log(`Socket disconnected: ${userId} (${reason})`);
    });
  });

  return io;
}

function buildRoomId(a: string, b: string): string {
  return a < b ? `chat:${a}:${b}` : `chat:${b}:${a}`;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}
