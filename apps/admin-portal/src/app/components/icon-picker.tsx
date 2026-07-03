import { useRef } from 'react';
import { cn } from '@dev-team-cv/shared-utils';

interface IconPickerProps {
  label?: string;
  hint?: string;
  existingUrl: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  onClearExisting?: () => void;
  fallbackLabel?: string;
}

/** Compact icon-sized image picker for contact link icons. */
export function IconPicker({
  label = 'Icon',
  hint,
  existingUrl,
  file,
  onFileChange,
  onClearExisting,
  fallbackLabel = '?',
}: IconPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;
  const hasImage = Boolean(previewUrl);

  const clear = () => {
    onFileChange(null);
    onClearExisting?.();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[var(--text-muted)]">{label}</label>
      )}
      <div className="relative h-12 w-12 shrink-0 group">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={hasImage ? 'Change icon' : 'Upload icon'}
          title={hint ?? (hasImage ? 'Change icon' : 'Upload icon')}
          className={cn(
            'relative flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed overflow-hidden',
            'border-[var(--border)] hover:border-[var(--text-muted)] transition-colors cursor-pointer',
            hasImage ? 'bg-[var(--surface-overlay)]' : 'bg-[var(--surface)]'
          )}
        >
          {hasImage ? (
            <>
              <img src={previewUrl} alt="" className="h-7 w-7 object-contain" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden="true">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </span>
            </>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]" aria-hidden="true">
              <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9" />
              <circle cx="9" cy="9" r="2" /><path d="m3 16 5-5 4 4" /><path d="M16 19h6M19 16v6" />
            </svg>
          )}
        </button>

        {hasImage && (
          <button
            type="button"
            onClick={clear}
            aria-label="Remove icon"
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-300 transition-colors shadow-sm"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
            </svg>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
