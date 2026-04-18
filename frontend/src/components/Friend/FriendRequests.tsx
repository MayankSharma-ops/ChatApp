'use client';

import { useChat } from '@/context/ChatContext';
import Avatar from '@/components/UI/Avatar';
import { Check, X } from 'lucide-react';

export default function FriendRequests() {
  const { friendRequests, respondRequest, chatLoading } = useChat();

  if (!friendRequests.length) return null;

  return (
    <div className="card mb-4">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">
        Contact Requests ({friendRequests.length})
      </h3>
      <div className="flex flex-col gap-2">
        {friendRequests.map((req) => (
          <div key={req.id}
            className="flex items-center gap-3 bg-white/3 rounded-xl p-3 border border-white/5">
            <Avatar name={req.requester_name} color={req.requester_avatar_color} url={req.requester_avatar_url} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{req.requester_name}</p>
              <p className="text-xs text-white/40 truncate">{req.requester_email}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                disabled={chatLoading}
                onClick={() => respondRequest(req.requester_id, true)}
                className="w-8 h-8 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Check size={14} />
              </button>
              <button
                disabled={chatLoading}
                onClick={() => respondRequest(req.requester_id, false)}
                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-400 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
