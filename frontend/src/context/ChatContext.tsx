'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';
import { useSocket } from '@/lib/useSocket';
import {
  Friend, FriendRequest, PendingRequest,
  User, Message, ChatContextType,
} from '@/types';

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const { socket, isConnected } = useSocket(token);

  const [friends, setFriends]               = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [pendingRequests, setPending]       = useState<PendingRequest[]>([]);
  const [allUsers, setAllUsers]             = useState<User[]>([]);
  const [messages, setMessages]             = useState<Message[]>([]);
  const [activeFriend, setActiveFriend]     = useState<Friend | null>(null);
  const [chatLoading, setChatLoading]       = useState(false);
  const [msgLoading, setMsgLoading]         = useState(false);
  const [error, setError]                   = useState('');

  // Track the previous active friend so we can leave the old room
  const prevFriendRef = useRef<Friend | null>(null);

  const clearError = () => setError('');

  // ── Refresh friends / requests (still REST) ──────────────────────
  const refreshAll = useCallback(async () => {
    if (!token) return;
    try {
      const [f, fr, p] = await Promise.allSettled([
        api.get<Friend[]>('/friends', token),
        api.get<FriendRequest[]>('/friends/requests', token),
        api.get<PendingRequest[]>('/friends/pending', token),
      ]);
      if (f.status  === 'fulfilled') setFriends(f.value);
      if (fr.status === 'fulfilled') setFriendRequests(fr.value);
      if (p.status  === 'fulfilled') setPending(p.value);
    } catch {}
  }, [token]);

  const searchUsers = useCallback(async (query: string) => {
    if (!token) return;
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setAllUsers([]);
      return;
    }

    try {
      const users = await api.get<User[]>(`/users?q=${encodeURIComponent(trimmedQuery)}`, token);
      setAllUsers(users);
      clearError();
    } catch (e: any) {
      setError(e.message);
    }
  }, [token]);

  // Initial load of friends data
  useEffect(() => {
    if (token) refreshAll();
  }, [token, refreshAll]);

  // Periodic refresh for friends list (not messages — that's socket now)
  useEffect(() => {
    if (!token) return;
    const id = setInterval(refreshAll, 15000);
    return () => clearInterval(id);
  }, [token, refreshAll]);

  // ── Load old messages via REST when opening a chat ───────────────
  const loadMessages = async (friendId: string) => {
    if (!token) return;
    try {
      const msgs = await api.get<Message[]>(`/messages/${friendId}`, token);
      setMessages(msgs);
    } catch {}
  };

  // ── Socket: join / leave chat rooms ──────────────────────────────
  useEffect(() => {
    if (!socket || !isConnected) return;

    const prev = prevFriendRef.current;

    // Leave previous chat room
    if (prev) {
      socket.emit('leave_chat', prev.friend_id);
    }

    // Join new chat room & load history
    if (activeFriend) {
      socket.emit('join_chat', activeFriend.friend_id);
      loadMessages(activeFriend.friend_id);

      // Mark messages as read
      socket.emit('mark_read', activeFriend.friend_id);
    } else {
      setMessages([]);
    }

    prevFriendRef.current = activeFriend;
  }, [activeFriend, socket, isConnected]);

  // ── Socket: listen for real-time events ──────────────────────────
  useEffect(() => {
    if (!socket) return;

    // New message arrives in the active chat
    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => {
        // Avoid duplicates (in case of reconnection replays)
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      // If the message is from someone else in the active chat, mark as read
      if (activeFriend && msg.sender_id === activeFriend.friend_id) {
        socket.emit('mark_read', activeFriend.friend_id);
      }
    };

    // Notification for messages outside the active chat
    const handleNotification = (data: { type: string; senderId: string; senderName: string; preview: string }) => {
      // You can extend this with toast notifications, badge updates, etc.
      console.log(`📬 Notification from ${data.senderName}: ${data.preview}`);
      // Refresh friends to update any unread indicators
      refreshAll();
    };

    // Someone read our messages
    const handleMessagesRead = (data: { readBy: string }) => {
      if (activeFriend && data.readBy === activeFriend.friend_id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender_id === user?.id && !m.is_read
              ? { ...m, is_read: true }
              : m
          )
        );
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('notification', handleNotification);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('notification', handleNotification);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, activeFriend, user?.id, refreshAll]);

  // ── Send message via Socket.IO ───────────────────────────────────
  const sendMessage = async (content: string) => {
    if (!socket || !activeFriend || !content.trim()) return;
    setMsgLoading(true);
    try {
      await new Promise<void>((resolve, reject) => {
        socket.emit(
          'send_message',
          { receiverId: activeFriend.friend_id, content: content.trim() },
          (response: any) => {
            if (response?.error) {
              reject(new Error(response.error));
            } else {
              resolve();
            }
          }
        );

        // Timeout fallback in case ack never arrives
        setTimeout(() => reject(new Error('Message send timed out')), 10000);
      });
      clearError();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setMsgLoading(false);
    }
  };

  // ── Friend requests (still REST) ─────────────────────────────────
  const sendRequest = async (receiverId: string) => {
    if (!token) return;
    setChatLoading(true);
    try {
      await api.post('/friends/request', { receiverId }, token);
      await refreshAll();
      clearError();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setChatLoading(false);
    }
  };

  const respondRequest = async (requesterId: string, accept: boolean) => {
    if (!token) return;
    setChatLoading(true);
    try {
      await api.post('/friends/respond', { requesterId, accept }, token);
      await refreshAll();
      clearError();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      friends, friendRequests, pendingRequests, allUsers,
      messages, activeFriend, setActiveFriend,
      sendMessage, searchUsers, sendRequest, respondRequest, loadMessages,
      refreshAll, chatLoading, msgLoading, error, clearError,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be inside ChatProvider');
  return ctx;
}
