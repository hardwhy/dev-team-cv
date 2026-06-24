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
            'w-full rounded-md border bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)]',
            'placeholder:text-[var(--text-muted)] resize-none transition-colors duration-150',
            error
              ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30'
              : 'border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500',
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
