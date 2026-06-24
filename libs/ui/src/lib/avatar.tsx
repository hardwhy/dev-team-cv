import { cn } from '@dev-team-cv/shared-utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-20 w-20 text-2xl' };

export function Avatar({ src, name, color = '#2563EB', bgColor = '#EFF6FF', size = 'md', className }: AvatarProps) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      className={cn('relative inline-flex items-center justify-center rounded-full font-semibold select-none overflow-hidden shrink-0', sizeMap[size], className)}
      style={{ backgroundColor: bgColor, color }}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
