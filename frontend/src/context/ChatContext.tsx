'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';
import {
  Friend, FriendRequest, PendingRequest,
  User, Message, ChatContextType,
} from '@/types';

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();

  const [friends, setFriends]               = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [pendingRequests, setPending]       = useState<PendingRequest[]>([]);
  const [allUsers, setAllUsers]             = useState<User[]>([]);
  const [messages, setMessages]             = useState<Message[]>([]);
  const [activeFriend, setActiveFriend]     = useState<Friend | null>(null);
  const [chatLoading, setChatLoading]       = useState(false);
  const [msgLoading, setMsgLoading]         = useState(false);
  const [error, setError]                   = useState('');

  const clearError = () => setError('');

  const refreshAll = useCallback(async () => {
    if (!token) return;
    try {
      const [f, fr, p, u] = await Promise.allSettled([
        api.get<Friend[]>('/friends', token),
        api.get<FriendRequest[]>('/friends/requests', token),
        api.get<PendingRequest[]>('/friends/pending', token),
        api.get<User[]>('/users', token),
      ]);
      if (f.status  === 'fulfilled') setFriends(f.value);
      if (fr.status === 'fulfilled') setFriendRequests(fr.value);
      if (p.status  === 'fulfilled') setPending(p.value);
      if (u.status  === 'fulfilled') setAllUsers(u.value);
    } catch {}
  }, [token]);

  useEffect(() => {
    if (token) refreshAll();
  }, [token, refreshAll]);

  useEffect(() => {
    if (!token) return;
    const id = setInterval(refreshAll, 15000);
    return () => clearInterval(id);
  }, [token, refreshAll]);

  // Poll messages for active chat
  useEffect(() => {
    if (!token || !activeFriend) return;
    const id = setInterval(() => loadMessages(activeFriend.friend_id), 6000);
    return () => clearInterval(id);
  }, [token, activeFriend]);

  const loadMessages = async (friendId: string) => {
    if (!token) return;
    try {
      const msgs = await api.get<Message[]>(`/messages/${friendId}`, token);
      setMessages(msgs);
    } catch {}
  };

  const sendMessage = async (content: string) => {
    if (!token || !activeFriend || !content.trim()) return;
    setMsgLoading(true);
    try {
      const msg = await api.post<Message>('/messages', { receiverId: activeFriend.friend_id, content }, token);
      setMessages((p) => [...p, msg]);
      clearError();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setMsgLoading(false);
    }
  };

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
      sendMessage, sendRequest, respondRequest, loadMessages,
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
