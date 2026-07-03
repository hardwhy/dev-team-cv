import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@dev-team-cv/ui';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onCancel, loading]);

  if (!open) return null;

  const accent =
    variant === 'danger'
      ? 'from-rose-500/25 to-red-500/10 text-rose-500'
      : 'from-blue-500/25 to-indigo-500/10 text-blue-500';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="glass-overlay absolute inset-0"
        onClick={() => !loading && onCancel()}
        aria-hidden="true"
      />

      <div className="glass-modal animate-glass-pop relative z-10 w-full max-w-sm rounded-2xl p-6">
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b ${accent}`}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 id="confirm-dialog-title" className="text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">{description}</p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
