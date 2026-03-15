'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar/NavBar';
import FriendList from '@/components/Friend/FriendList';
import ChatWindow from '@/components/Chat/ChatWindow';
import Toast from '@/components/UI/Toast';
import Spinner from '@/components/UI/Spinner';
import { useChat } from '@/context/ChatContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { error, clearError, activeFriend } = useChat();
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
        <div className="flex-1 flex gap-4 min-h-0" style={{ height: 'calc(100vh - 8rem)' }}>
          {/* Sidebar — full width on mobile when no friend selected; fixed width column on desktop */}
          <aside className={`w-full sm:w-72 shrink-0 bg-surface-card rounded-2xl border border-white/5 flex flex-col overflow-hidden ${activeFriend ? 'hidden sm:flex' : 'flex'}`}>
            <div className="px-4 py-3 border-b border-white/5">
              <h2 className="font-semibold text-sm text-white/60 uppercase tracking-wide">Friends</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FriendList />
            </div>
          </aside>

          {/* Chat — hidden on mobile until a friend is selected */}
          <div className={`flex-1 bg-surface-card rounded-2xl border border-white/5 flex flex-col overflow-hidden min-w-0 ${activeFriend ? 'flex' : 'hidden sm:flex'}`}>
            <ChatWindow />
          </div>
        </div>
      </main>
      {error && <Toast message={error} onClose={clearError} />}
    </div>
  );
}