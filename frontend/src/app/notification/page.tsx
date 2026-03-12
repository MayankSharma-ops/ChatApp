'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import NavBar from '@/components/NavBar/NavBar';
import FriendRequests from '@/components/Friend/FriendRequests';
import Spinner from '@/components/UI/Spinner';
import { Bell } from 'lucide-react';

export default function NotificationPage() {
  const { user, loading } = useAuth();
  const { friendRequests } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-brand" size={24} />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {friendRequests.length > 0 && (
            <span className="bg-brand text-white text-xs font-bold rounded-full px-2 py-0.5">
              {friendRequests.length}
            </span>
          )}
        </div>

        {friendRequests.length === 0 ? (
          <div className="card text-center py-12 text-white/30">
            <Bell size={40} className="mx-auto mb-3 opacity-20" />
            <p>No notifications yet.</p>
            <p className="text-sm mt-1">Friend requests will appear here.</p>
          </div>
        ) : (
          <FriendRequests />
        )}
      </main>
    </div>
  );
}
