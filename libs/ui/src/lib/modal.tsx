import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@dev-team-cv/shared-utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
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

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] overflow-y-auto"
    >
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-200',
          'bg-black/40 backdrop-blur-md backdrop-saturate-150',
          locked ? 'cursor-not-allowed' : 'cursor-default'
        )}
        onClick={() => !locked && onClose()}
        aria-hidden="true"
      />

      <div className="relative flex min-h-full items-center justify-center p-4 pt-20 pb-10">
        <div
          ref={dialogRef}
          className={cn(
            'relative w-full rounded-2xl border border-[var(--border)]',
            'bg-[var(--surface)] shadow-2xl max-h-[calc(100vh-7rem)] overflow-y-auto',
            'animate-fade-in',
            sizeMap[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5 sticky top-0 bg-[var(--surface)]/95 backdrop-blur-sm z-10">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
              <button
                onClick={() => !locked && onClose()}
                disabled={locked}
                aria-label="Close"
                className="rounded-lg p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 2l12 12M14 2L2 14" />
                </svg>
              </button>
            </div>
          )}
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
