import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import { CallProvider } from '@/context/CallContext';
import CallOverlay from '@/components/Call/CallOverlay';

export const metadata: Metadata = {
  title: 'ChatDApp — Real-Time Chat',
  description: 'A modern off-chain chat application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-white antialiased">
        <AuthProvider>
          <ChatProvider>
            <CallProvider>
              {children}
              <CallOverlay />
            </CallProvider>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

