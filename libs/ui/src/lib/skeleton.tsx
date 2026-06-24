import { cn } from '@dev-team-cv/shared-utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: boolean;
}

export function Skeleton({ className, rounded, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-[var(--surface-overlay)]',
        rounded ? 'rounded-full' : 'rounded-md',
        className
      )}
      {...props}
    />
  );
}
