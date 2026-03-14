'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import NavBar from '@/components/NavBar/NavBar';
import UserCard from '@/components/UserCard/UserCard';
import Toast from '@/components/UI/Toast';
import Spinner from '@/components/UI/Spinner';
import { Search } from 'lucide-react';

export default function AllUserPage() {
  const { user, loading } = useAuth();
  const { allUsers, friends, pendingRequests, searchUsers, error, clearError } = useChat();
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const id = setTimeout(() => {
      searchUsers(query);
    }, 250);

    return () => clearTimeout(id);
  }, [query, searchUsers, user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>;
  if (!user) return null;

  const friendIds  = new Set(friends.map((f) => f.friend_id));
  const pendingIds = new Set(pendingRequests.map((p) => p.receiver_id));
  const hasQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Find Friends</h1>
          <p className="text-white/40 text-sm">Search by username or email to find users.</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            className="input-base pl-9"
            type="text"
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {!hasQuery ? (
          <div className="text-white/30 text-center py-12">Start typing to search users.</div>
        ) : allUsers.length === 0 ? (
          <div className="text-white/30 text-center py-12">No users found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allUsers.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                isFriend={friendIds.has(u.id)}
                isPending={pendingIds.has(u.id)}
              />
            ))}
          </div>
        )}
      </main>
      {error && <Toast message={error} onClose={clearError} />}
    </div>
  );
}
