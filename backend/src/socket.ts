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
    // Client calls this when opening a conversation
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

      // Validate
      if (!receiverId || !content?.trim()) {
        return ack?.({ error: 'receiverId and content required' });
      }
      if (userId === receiverId) {
        return ack?.({ error: 'Cannot message yourself' });
      }

      try {
        // Verify friendship
        const [u1, u2] = userId < receiverId ? [userId, receiverId] : [receiverId, userId];
        const fs = await pool.query(
          'SELECT id FROM friendships WHERE user1_id=$1 AND user2_id=$2',
          [u1, u2]
        );
        if (!fs.rows.length) {
          return ack?.({ error: 'Not friends' });
        }

        // Save to DB
        const result = await pool.query(
          `INSERT INTO messages (sender_id, receiver_id, content)
           VALUES ($1,$2,$3)
           RETURNING id, sender_id, receiver_id, content, sent_at, is_read`,
          [userId, receiverId, content.trim()]
        );

        // Get sender info for display
        const senderInfo = await pool.query(
          'SELECT name, avatar_color FROM users WHERE id=$1',
          [userId]
        );

        const message = {
          ...result.rows[0],
          sender_name: senderInfo.rows[0]?.name,
          sender_avatar_color: senderInfo.rows[0]?.avatar_color,
        };

        // Emit to the conversation room (both users if they have it open)
        const roomId = buildRoomId(userId, receiverId);
        io.to(roomId).emit('new_message', message);

        // Also push a notification to the receiver's personal room
        // (in case they don't have this chat open)
        io.to(`user:${receiverId}`).emit('notification', {
          type: 'new_message',
          senderId: userId,
          senderName: message.sender_name,
          preview: content.trim().slice(0, 50),
        });

        // Acknowledge success to the sender
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

        // Notify the friend that their messages were read
        io.to(`user:${friendId}`).emit('messages_read', {
          readBy: userId,
        });
      } catch (err: any) {
        console.error('mark_read error:', err.message);
      }
    });

    // ── disconnect ────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
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
