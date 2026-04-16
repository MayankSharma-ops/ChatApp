'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('chatdapp_token');
    if (!stored) { setLoading(false); return; }
    api.get<User>('/auth/me', stored)
      .then((u) => {
        setToken(stored);
        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem('chatdapp_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    localStorage.setItem('chatdapp_token', data.token);
    setToken(data.token);
    setUser(data.user);
    router.push('/');
  };

  const requestRegisterOtp = async (name: string, email: string, password: string) => {
    return api.post<{ message: string; expiresInMinutes: number }>('/auth/register/request-otp', {
      name,
      email,
      password,
    });
  };

  const register = async (email: string, otp: string) => {
    const data = await api.post<{ token: string; user: User }>('/auth/register', { email, otp });
    localStorage.setItem('chatdapp_token', data.token);
    setToken(data.token);
    setUser(data.user);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('chatdapp_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, requestRegisterOtp, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
