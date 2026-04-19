'use client';

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { useCall } from '@/context/CallContext';
import Avatar from '@/components/UI/Avatar';
import Spinner from '@/components/UI/Spinner';
import { ArrowLeft, MessageSquare, Phone, Send, Smile, Video } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import clsx from 'clsx';

const EMOJIS = ['😀', '😂', '😍', '😎', '🔥', '👍', '🙏', '🎉', '❤️', '😢', '🤔', '👏', '🎊', '💯', '✨'];

function formatTime(iso: string) {
  const date = new Date(iso);
  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return `Yesterday ${format(date, 'HH:mm')}`;
  return format(date, 'dd MMM, HH:mm');
}

export default function ChatWindow() {
  const { user } = useAuth();
  const {
    activeFriend,
    getPresenceStatus,
    isUserOnline,
    messages,
    sendMessage,
    setActiveFriend,
    startTyping,
    stopTyping,
    msgLoading,
  } = useChat();
  const { callUser, callState } = useCall();

  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setText('');
    setShowEmoji(false);
  }, [activeFriend?.friend_id]);

  const handleSend = async () => {
    if (!text.trim() || msgLoading) return;

    await sendMessage(text.trim());
    setText('');
    stopTyping();
  };

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setText(nextValue);

    if (nextValue.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleCall = (type: 'audio' | 'video') => {
    if (!activeFriend || callState !== 'idle') return;

    void callUser(
      activeFriend.friend_id,
      activeFriend.friend_name,
      activeFriend.friend_avatar_color,
      activeFriend.friend_avatar_url,
      type
    );
  };

  if (!activeFriend) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-white/20">
        <MessageSquare size={56} className="opacity-20" />
        <div className="text-center">
          <p className="text-lg font-semibold text-white/40">Select a friend</p>
          <p className="mt-1 text-sm">Choose someone from your friend list to start chatting</p>
        </div>
      </div>
    );
  }

  const isFriendOnline = isUserOnline(activeFriend.friend_id);
  const presenceStatus = getPresenceStatus(activeFriend.friend_id);
  const headerStatusText =
    presenceStatus === 'typing'
      ? `${activeFriend.friend_name} is typing...`
      : isFriendOnline
        ? 'Online'
        : 'Offline';

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex items-center justify-between border-b border-white/5 bg-surface-card/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopTyping();
              setText('');
              setActiveFriend(null);
            }}
            className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/5 hover:text-white sm:hidden"
            aria-label="Back to friend list"
          >
            <ArrowLeft size={20} />
          </button>

          <Avatar
            name={activeFriend.friend_name}
            color={activeFriend.friend_avatar_color}
            url={activeFriend.friend_avatar_url}
            size="md"
            status={isFriendOnline ? 'online' : 'offline'}
          />

          <div>
            <p className="text-sm font-semibold">{activeFriend.friend_name}</p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={clsx(
                  'h-2.5 w-2.5 rounded-full',
                  isFriendOnline ? 'bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.55)]' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.45)]'
                )}
                aria-hidden="true"
              />
              <p
                className={clsx(
                  'text-xs font-medium',
                  presenceStatus === 'typing'
                    ? 'text-sky-300'
                    : isFriendOnline
                      ? 'text-emerald-300'
                      : 'text-rose-300'
                )}
              >
                {headerStatusText}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleCall('audio')}
            disabled={callState !== 'idle'}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white/50 transition-colors hover:bg-green-500/10 hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Voice call"
          >
            <Phone size={15} />
            <span className="hidden sm:inline">Voice</span>
          </button>

          <button
            onClick={() => handleCall('video')}
            disabled={callState !== 'idle'}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white/50 transition-colors hover:bg-brand/10 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Video call"
          >
            <Video size={15} />
            <span className="hidden sm:inline">Video</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-sm text-white/20">
            No messages yet. Say hello! 👋
          </div>
        )}

        {messages.map((message) => {
          const isMine = message.sender_id === user?.id;

          return (
            <div
              key={message.id}
              className={clsx('flex flex-col gap-0.5', isMine ? 'items-end' : 'items-start')}
            >
              <div
                className={clsx(
                  'max-w-[75%] break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[60%]',
                  isMine
                    ? 'rounded-br-sm bg-brand text-white'
                    : 'rounded-bl-sm border border-white/5 bg-surface-card text-white/90'
                )}
              >
                {message.content}
              </div>
              <span className="px-1 text-[10px] text-white/25">{formatTime(message.sent_at)}</span>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/5 px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-surface-input px-3 py-2 transition-colors focus-within:border-brand/40">
          <div className="relative" ref={emojiRef}>
            <button
              onClick={() => setShowEmoji((prev) => !prev)}
              className="p-1 text-white/30 transition-colors hover:text-brand"
            >
              <Smile size={20} />
            </button>

            {showEmoji && (
              <div className="absolute bottom-full left-0 z-20 mb-2 grid grid-cols-5 gap-1 rounded-xl border border-white/10 bg-surface-card p-2 shadow-2xl animate-fade-in">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      const nextValue = `${text}${emoji}`;
                      setText(nextValue);
                      setShowEmoji(false);
                      if (nextValue.trim()) startTyping();
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-white/10"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/25"
            placeholder={`Message ${activeFriend.friend_name}...`}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKey}
          />

          <button
            onClick={() => void handleSend()}
            disabled={!text.trim() || msgLoading}
            className="rounded-lg bg-brand p-1.5 transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {msgLoading ? <Spinner size={16} /> : <Send size={16} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
