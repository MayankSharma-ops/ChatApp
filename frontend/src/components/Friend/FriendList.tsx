'use client';

import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/UI/Avatar';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { Friend } from '@/types';

export default function FriendList() {
  const { friends, activeFriend, setActiveFriend, loadMessages } = useChat();

  const handleSelect = (f: Friend) => {
    setActiveFriend(f);
    loadMessages(f.friend_id);
  };

  if (!friends.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-white/30 p-6 text-center">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="opacity-30">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
        </svg>
        <p className="text-sm">No friends yet.<br />Add some from Find Friends!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 p-2">
      {friends.map((f) => {
        const active = activeFriend?.friend_id === f.friend_id;
        return (
          <button
            key={f.friend_id}
            onClick={() => handleSelect(f)}
            className={clsx(
              'flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl transition-colors',
              active ? 'bg-brand/15 border border-brand/20' : 'hover:bg-white/5'
            )}
          >
            <Avatar name={f.friend_name} color={f.friend_avatar_color} size="md" />
            <div className="flex-1 min-w-0">
              <p className={clsx('font-semibold text-sm truncate', active ? 'text-brand' : 'text-white')}>
                {f.friend_name}
              </p>
              <p className="text-xs text-white/30 truncate">{f.friend_email}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
