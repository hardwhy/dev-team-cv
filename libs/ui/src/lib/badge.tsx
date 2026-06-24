import { cn } from '@dev-team-cv/shared-utils';

interface BadgeProps {
  label: string;
  color?: string;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function Badge({ label, color, className, interactive, onClick }: BadgeProps) {
  const style = color
    ? ({ '--badge-color': color } as React.CSSProperties)
    : undefined;

  return (
    <span
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick?.() : undefined}
      style={style}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]',
        'transition-colors duration-150',
        color && 'border-[color-mix(in_srgb,var(--badge-color)_30%,transparent)] bg-[color-mix(in_srgb,var(--badge-color)_10%,transparent)] text-[var(--badge-color)]',
        interactive && 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      {label}
    </span>
  );
}
