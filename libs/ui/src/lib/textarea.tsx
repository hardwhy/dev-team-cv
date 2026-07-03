import { forwardRef } from 'react';
import { cn } from '@dev-team-cv/shared-utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          className={cn(
            'w-full rounded-lg border bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)]',
            'placeholder:text-[var(--text-muted)] resize-none transition-all duration-150',
            'focus:outline-none focus:ring-4',
            error
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-[var(--border)] hover:border-[var(--text-muted)] focus:border-blue-500 focus:ring-blue-500/15',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
