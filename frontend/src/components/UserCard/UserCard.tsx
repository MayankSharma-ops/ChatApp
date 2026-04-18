'use client';

import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/UI/Avatar';
import { UserPlus, Clock, UserCheck } from 'lucide-react';
import { User } from '@/types';

interface Props {
  user: User;
  isFriend: boolean;
  isPending: boolean;
}

export default function UserCard({ user, isFriend, isPending }: Props) {
  const { sendRequest, chatLoading } = useChat();
  const { user: currentUser } = useAuth();
  const isSelf = currentUser?.id === user.id;

  return (
    <div className="card flex flex-col items-center gap-3 text-center hover:border-brand/20 transition-colors relative">
      <Avatar name={user.name} color={user.avatar_color} url={user.avatar_url} size="xl" className="mt-2" />
      <div className="w-full min-w-0">
        <h3 className="font-semibold truncate">{user.name}</h3>
        <p className="text-xs text-white/40 truncate mt-0.5">{user.email}</p>
      </div>

      {isSelf ? (
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium py-2 px-4 bg-amber-500/10 rounded-full border border-amber-500/20">
          You cannot add yourself
        </div>
      ) : isFriend ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium py-2 px-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <UserCheck size={12} /> You are already friends
        </div>
      ) : isPending ? (
        <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium py-2 px-4 bg-white/5 rounded-full border border-white/10">
          <Clock size={12} /> Request Sent
        </div>
      ) : (
        <button
          disabled={chatLoading}
          onClick={() => sendRequest(user.id)}
          className="flex items-center gap-1.5 text-xs font-semibold py-2 px-4 bg-brand/15 hover:bg-brand/25 text-brand rounded-full border border-brand/25 transition-colors disabled:opacity-50"
        >
          <UserPlus size={12} /> Add Friend
        </button>
      )}
    </div>
  );
}
