import { useEffect, useRef } from 'react';
import { cn } from '@dev-team-cv/shared-utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  /** When true, backdrop click and the header × button are disabled */
  locked?: boolean;
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

export function Modal({ open, onClose, title, size = 'md', children, locked = false }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !locked) onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, locked]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      // fixed inset-0 covers EVERYTHING including the admin header
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Liquid-glass backdrop — saturate + blur + dark tint */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-200',
          'bg-black/30 backdrop-blur-md backdrop-saturate-150',
          locked ? 'cursor-not-allowed' : 'cursor-default'
        )}
        onClick={() => !locked && onClose()}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={cn(
          'relative w-full rounded-2xl border border-[var(--border)]',
          'bg-[var(--surface)] shadow-2xl max-h-[90vh] overflow-y-auto',
          'animate-fade-in',
          sizeMap[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 sticky top-0 bg-[var(--surface)] z-10">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
            <button
              onClick={() => !locked && onClose()}
              disabled={locked}
              aria-label="Close"
              className="rounded-md p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
