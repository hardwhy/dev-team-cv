import { forwardRef } from 'react';
import { cn } from '@dev-team-cv/shared-utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-lg border bg-[var(--surface)] px-3.5 text-sm text-[var(--text-primary)]',
            'placeholder:text-[var(--text-muted)] transition-all duration-150',
            'focus:outline-none focus:ring-4',
            error
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-[var(--border)] hover:border-[var(--text-muted)] focus:border-blue-500 focus:ring-blue-500/15',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-red-500">{error}</p>}
        {!error && hint && <p id={`${inputId}-hint`} className="text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
