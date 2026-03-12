'use client';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  type?: 'error' | 'success';
}

export default function Toast({ message, onClose, type = 'error' }: ToastProps) {
  const colors = type === 'error'
    ? 'bg-red-600/90 border-red-500/50'
    : 'bg-emerald-600/90 border-emerald-500/50';

  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
      ${colors} border text-white px-5 py-3 rounded-xl shadow-2xl
      animate-slide-up max-w-sm w-[90vw]`}>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="hover:opacity-75 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
}
