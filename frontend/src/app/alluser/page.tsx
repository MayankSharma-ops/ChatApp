'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import NavBar from '@/components/NavBar/NavBar';
import UserCard from '@/components/UserCard/UserCard';
import Toast from '@/components/UI/Toast';
import Spinner from '@/components/UI/Spinner';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function AllUserPage() {
  const { user, loading } = useAuth();
  const { allUsers, friends, pendingRequests, error, clearError } = useChat();
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>;
  if (!user) return null;

  const filtered = allUsers.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  const friendIds  = new Set(friends.map((f) => f.friend_id));
  const pendingIds = new Set(pendingRequests.map((p) => p.receiver_id));

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Find Friends</h1>
          <p className="text-white/40 text-sm">{allUsers.length} users registered</p>
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

        {filtered.length === 0 ? (
          <div className="text-white/30 text-center py-12">No users found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((u, i) => (
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
