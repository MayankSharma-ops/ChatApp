import clsx from 'clsx';

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg', xl: 'w-16 h-16 text-2xl' };

export default function Avatar({ name, color = '#f18303', size = 'md', className }: AvatarProps) {
  return (
    <div
      className={clsx('avatar select-none', sizes[size], className)}
      style={{ backgroundColor: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
