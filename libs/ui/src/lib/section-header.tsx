import { cn } from '@dev-team-cv/shared-utils';

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <div className={cn('mb-12', centered && 'text-center', className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">
        {label}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-3 text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl',
            centered && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** In-card / in-panel subsection label — matches section eyebrow style at smaller scale */
export function SubsectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2', className)}>
      {children}
    </p>
  );
}
