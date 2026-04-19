import clsx from 'clsx';
import { PresenceStatus } from '@/types';

interface AvatarProps {
  name: string;
  color?: string;
  url?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: PresenceStatus | null;
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl',
};

const statusStyles: Record<PresenceStatus, string> = {
  online: 'bg-emerald-400 shadow-[0_0_0_2px_rgba(15,23,42,0.9)]',
  offline: 'bg-rose-500 shadow-[0_0_0_2px_rgba(15,23,42,0.9)]',
  typing: 'bg-sky-400 animate-pulse shadow-[0_0_0_2px_rgba(15,23,42,0.9)]',
};

export default function Avatar({
  name,
  color = '#f18303',
  url,
  size = 'md',
  status,
  className,
}: AvatarProps) {
  return (
    <div className="relative inline-flex shrink-0">
      {url ? (
        <img
          src={url}
          alt={name}
          crossOrigin="anonymous"
          className={clsx('select-none rounded-full object-cover', sizes[size], className)}
        />
      ) : (
        <div
          className={clsx('avatar select-none', sizes[size], className)}
          style={{ backgroundColor: color }}
        >
          {name ? name.charAt(0).toUpperCase() : '?'}
        </div>
      )}

      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border border-slate-950/60',
            statusStyles[status]
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
