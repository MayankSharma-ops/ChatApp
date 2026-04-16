'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { useCall } from '@/context/CallContext';
import Avatar from '@/components/UI/Avatar';
import Spinner from '@/components/UI/Spinner';
import { Send, Smile, Video, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import clsx from 'clsx';

const EMOJIS = ['😀','😂','😍','😎','🔥','👍','🙏','🎉','❤️','😢','🤔','👏','🎊','💯','✨'];

function formatTime(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return format(d, 'HH:mm');
  if (isYesterday(d)) return `Yesterday ${format(d, 'HH:mm')}`;
  return format(d, 'dd MMM, HH:mm');
}

export default function ChatWindow() {
  const { user } = useAuth();
  const { activeFriend, setActiveFriend, messages, sendMessage, msgLoading } = useChat();
  const { callUser, callState } = useCall();

  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const emojiRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmoji(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = async () => {
    if (!text.trim() || msgLoading) return;
    await sendMessage(text.trim());
    setText('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleCall = (type: 'audio' | 'video') => {
    if (!activeFriend || callState !== 'idle') return;
    callUser(
      activeFriend.friend_id,
      activeFriend.friend_name,
      activeFriend.friend_avatar_color,
      type,
    );
  };

  if (!activeFriend) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/20 p-8">
        <MessageSquare size={56} className="opacity-20" />
        <div className="text-center">
          <p className="font-semibold text-lg text-white/40">Select a friend</p>
          <p className="text-sm mt-1">Choose someone from your friend list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-surface-card/50">
        <div className="flex items-center gap-3">
          {/* Back button — mobile only */}
          <button
            onClick={() => setActiveFriend(null)}
            className="sm:hidden p-1.5 -ml-1 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Back to friend list"
          >
            <ArrowLeft size={20} />
          </button>
          <Avatar name={activeFriend.friend_name} color={activeFriend.friend_avatar_color} size="md" />
          <div>
            <p className="font-semibold text-sm">{activeFriend.friend_name}</p>
            <p className="text-xs text-white/30">{activeFriend.friend_email}</p>
          </div>
        </div>

        {/* Call buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleCall('audio')}
            disabled={callState !== 'idle'}
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-green-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-green-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Voice call"
          >
            <Phone size={15} /> <span className="hidden sm:inline">Voice</span>
          </button>
          <button
            onClick={() => handleCall('video')}
            disabled={callState !== 'idle'}
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-brand transition-colors px-3 py-1.5 rounded-lg hover:bg-brand/10 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Video call"
          >
            <Video size={15} /> <span className="hidden sm:inline">Video</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-white/20 text-sm">
            No messages yet. Say hello! 👋
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={clsx('flex flex-col gap-0.5', isMe ? 'items-end' : 'items-start')}>
              <div className={clsx(
                'max-w-[75%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words',
                isMe
                  ? 'bg-brand text-white rounded-br-sm'
                  : 'bg-surface-card text-white/90 rounded-bl-sm border border-white/5'
              )}>
                {msg.content}
              </div>
              <span className="text-[10px] text-white/25 px-1">{formatTime(msg.sent_at)}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center gap-2 bg-surface-input rounded-xl px-3 py-2 border border-white/8 focus-within:border-brand/40 transition-colors">
          {/* Emoji */}
          <div className="relative" ref={emojiRef}>
            <button
              onClick={() => setShowEmoji((p) => !p)}
              className="text-white/30 hover:text-brand transition-colors p-1"
            >
              <Smile size={20} />
            </button>
            {showEmoji && (
              <div className="absolute bottom-full left-0 mb-2 bg-surface-card border border-white/10 rounded-xl p-2 grid grid-cols-5 gap-1 shadow-2xl animate-fade-in z-20">
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => { setText((p) => p + e); setShowEmoji(false); }}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-white/10 rounded-lg transition-colors">
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/25"
            placeholder={`Message ${activeFriend.friend_name}…`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
          />

          <button
            onClick={handleSend}
            disabled={!text.trim() || msgLoading}
            className="p-1.5 bg-brand hover:bg-brand-dark rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {msgLoading ? <Spinner size={16} /> : <Send size={16} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}