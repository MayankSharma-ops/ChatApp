import clsx from 'clsx';

interface AvatarProps {
  name: string;
  color?: string;
  url?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg', xl: 'w-16 h-16 text-2xl' };

export default function Avatar({ name, color = '#f18303', url, size = 'md', className }: AvatarProps) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        crossOrigin="anonymous"
        className={clsx('select-none object-cover rounded-full', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx('avatar select-none', sizes[size], className)}
      style={{ backgroundColor: color }}
    >
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
  );
}
