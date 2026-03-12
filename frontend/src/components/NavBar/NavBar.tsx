'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Users, Bell, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import Avatar from '@/components/UI/Avatar';
import clsx from 'clsx';

const NAV = [
  { label: 'Chat',          href: '/',            icon: MessageSquare },
  { label: 'Find Friends',  href: '/alluser',      icon: Users },
  { label: 'Notifications', href: '/notification', icon: Bell },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { friendRequests } = useChat();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unread = friendRequests.length;

  return (
    <header className="sticky top-0 z-40 bg-surface-card/80 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <MessageSquare className="text-brand" size={22} />
          <span className="hidden sm:block">ChatDApp</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative',
                  active ? 'bg-brand/15 text-brand' : 'text-white/60 hover:text-white hover:bg-white/5')}>
                <Icon size={16} />
                {label}
                {label === 'Notifications' && unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: profile */}
        <div className="flex items-center gap-2">
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Avatar name={user.name} color={user.avatar_color} size="sm" />
                <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                <ChevronDown size={14} className="text-white/40" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-card border border-white/10 rounded-xl shadow-2xl py-1 animate-fade-in">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-white/40 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen((p) => !p)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-surface-card px-4 pb-4 animate-slide-up">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={clsx('flex items-center gap-3 px-4 py-3 rounded-lg mt-1 text-sm font-medium relative',
                pathname === href ? 'bg-brand/15 text-brand' : 'text-white/70 hover:bg-white/5')}>
              <Icon size={18} />
              {label}
              {label === 'Notifications' && unread > 0 && (
                <span className="ml-auto bg-brand text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{unread}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
