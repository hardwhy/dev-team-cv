import { cn } from '@dev-team-cv/shared-utils';

interface BrandLogoProps {
  primary: string;
  secondary: string;
  className?: string;
}

/** Two-tone wordmark: primary text in the foreground color, secondary muted. */
export function BrandLogo({ primary, secondary, className }: BrandLogoProps) {
  return (
    <span className={cn('tracking-tight', className)}>
      {primary}
      <span className="text-[var(--text-muted)]">{secondary}</span>
    </span>
  );
}
