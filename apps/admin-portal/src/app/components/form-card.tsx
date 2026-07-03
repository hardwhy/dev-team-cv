import type { ReactNode } from 'react';
import { Button } from '@dev-team-cv/ui';
import { cn } from '@dev-team-cv/shared-utils';

function DirtyDot({ isDirty }: { isDirty: boolean }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {isDirty && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
      )}
      <span
        title={isDirty ? 'Unsaved changes' : 'Up to date'}
        className={cn(
          'relative inline-flex h-2.5 w-2.5 rounded-full transition-colors duration-200',
          isDirty ? 'bg-amber-400' : 'bg-emerald-500'
        )}
      />
    </span>
  );
}

interface FormCardProps {
  title: string;
  description?: string;
  /** Optional element rendered on the right side of the header (e.g. an add button). */
  action?: ReactNode;
  children: ReactNode;
  isDirty: boolean;
  saving: boolean;
  savedOk: boolean;
  onSave: () => void;
}

/**
 * Flat-but-modern settings card: subtle gradient header with an accent bar,
 * a divided body, and a sticky-feeling save bar footer.
 */
export function FormCard({
  title,
  description,
  action,
  children,
  isDirty,
  saving,
  savedOk,
  onSave,
}: FormCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-overlay)]/60 to-transparent px-6 py-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 h-8 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500"
          />
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-5">{children}</div>

      {/* Save bar */}
      <div className="flex items-center gap-3 border-t border-[var(--border)] bg-[var(--surface)]/40 px-6 py-4">
        <DirtyDot isDirty={isDirty} />
        <span className="text-xs text-[var(--text-muted)]">
          {isDirty ? 'Unsaved changes' : 'Up to date'}
        </span>
        {savedOk && (
          <span className="inline-flex items-center gap-1 text-sm text-emerald-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Saved
          </span>
        )}
        <Button loading={saving} disabled={!isDirty} onClick={onSave} className="ml-auto">
          Save
        </Button>
      </div>
    </section>
  );
}
