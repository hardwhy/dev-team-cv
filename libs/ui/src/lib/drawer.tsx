import { useEffect, useRef } from 'react';
import { cn } from '@dev-team-cv/shared-utils';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'right' | 'left';
}

export function Drawer({ open, onClose, title, children, side = 'right' }: DrawerProps) {
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    // Focus close button when drawer opens
    const t = setTimeout(() => firstFocusRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cn('fixed inset-0 z-50', !open && 'pointer-events-none')}
    >
      {/* Backdrop — fade only, no blur */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity',
          open ? 'opacity-100 duration-300' : 'opacity-0 duration-200'
        )}
        style={{ transitionTimingFunction: 'ease' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — slides in with a smooth ease-out curve */}
      <div
        className={cn(
          'absolute top-0 bottom-0 w-full max-w-lg bg-[var(--surface)] shadow-2xl',
          'border-[var(--border)] flex flex-col',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
        )}
        style={{
          transform: open
            ? 'translateX(0)'
            : side === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
          transition: open
            ? 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)'
            : 'transform 220ms cubic-bezier(0.4, 0, 1, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 shrink-0">
          {title && (
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          )}
          <button
            ref={firstFocusRef}
            onClick={onClose}
            aria-label="Close drawer"
            className="ml-auto rounded-md p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
