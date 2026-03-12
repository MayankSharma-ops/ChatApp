'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar/NavBar';
import FriendList from '@/components/Friend/FriendList';
import FriendRequests from '@/components/Friend/FriendRequests';
import ChatWindow from '@/components/Chat/ChatWindow';
import Toast from '@/components/UI/Toast';
import Spinner from '@/components/UI/Spinner';
import { useChat } from '@/context/ChatContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { error, clearError } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 gap-4">
        <FriendRequests />
        <div className="flex-1 flex gap-4 min-h-0" style={{ height: 'calc(100vh - 11rem)' }}>
          {/* Sidebar */}
          <aside className="w-72 shrink-0 bg-surface-card rounded-2xl border border-white/5 flex flex-col overflow-hidden hidden sm:flex">
            <div className="px-4 py-3 border-b border-white/5">
              <h2 className="font-semibold text-sm text-white/60 uppercase tracking-wide">Friends</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FriendList />
            </div>
          </aside>

          {/* Chat */}
          <div className="flex-1 bg-surface-card rounded-2xl border border-white/5 flex flex-col overflow-hidden min-w-0">
            <ChatWindow />
          </div>
        </div>
      </main>
      {error && <Toast message={error} onClose={clearError} />}
    </div>
  );
}
