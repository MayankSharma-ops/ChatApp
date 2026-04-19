'use client';

import { useChat } from '@/context/ChatContext';
import Avatar from '@/components/UI/Avatar';
import clsx from 'clsx';
import { Friend } from '@/types';

export default function FriendList() {
  const { friends, activeFriend, isUserOnline, setActiveFriend } = useChat();

  const handleSelect = (friend: Friend) => {
    setActiveFriend(friend);
  };

  if (!friends.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-white/30">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="opacity-30">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
          />
        </svg>
        <p className="text-sm">
          No friends yet.
          <br />
          Add some from Find Friends!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 p-2">
      {friends.map((friend) => {
        const isActive = activeFriend?.friend_id === friend.friend_id;
        const isOnline = isUserOnline(friend.friend_id);

        return (
          <button
            key={friend.friend_id}
            onClick={() => handleSelect(friend)}
            className={clsx(
              'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors',
              isActive ? 'border border-brand/20 bg-brand/15' : 'hover:bg-white/5'
            )}
          >
            <Avatar
              name={friend.friend_name}
              color={friend.friend_avatar_color}
              url={friend.friend_avatar_url}
              size="md"
              status={isOnline ? 'online' : 'offline'}
            />

            <div className="min-w-0 flex-1">
              <p className={clsx('truncate text-sm font-semibold', isActive ? 'text-brand' : 'text-white')}>
                {friend.friend_name}
              </p>
              <p className="truncate text-xs text-white/30">{friend.friend_email}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
