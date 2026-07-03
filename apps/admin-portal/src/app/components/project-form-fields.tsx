import { useRef, useState } from 'react';
import { Button } from '@dev-team-cv/ui';

export function TechChipInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addFromInput = () => {
    const items = input.split(',').map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    onChange([...new Set([...value, ...items])]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addFromInput();
    }
    if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const remove = (tech: string) => onChange(value.filter((t) => t !== tech));

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">Technologies</label>
      <div className="min-h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-colors">
        {value.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-overlay)] border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"
          >
            {tech}
            <button
              type="button"
              onClick={() => remove(tech)}
              aria-label={`Remove ${tech}`}
              className="rounded-full hover:text-red-500 transition-colors ml-0.5"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
              </svg>
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addFromInput}
          placeholder={value.length === 0 ? 'Type and press Enter or comma…' : ''}
          className="flex-1 min-w-24 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
        />
      </div>
      <p className="text-xs text-[var(--text-muted)]">Press Enter or comma to add. Click a chip to remove.</p>
    </div>
  );
}

export function ThumbnailPicker({
  existingUrl,
  file,
  onFileChange,
}: {
  existingUrl: string | null;
  file: File | null;
  onFileChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">Thumbnail</label>
      <div className="flex items-center gap-4">
        <div
          className="group relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface-raised)] cursor-pointer hover:border-[var(--text-muted)] transition-colors"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Click to choose thumbnail"
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Thumbnail preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-[11px] font-medium text-white">Change</span>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 text-[var(--text-muted)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span className="text-[11px]">Upload</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            {previewUrl ? 'Change image' : 'Choose image'}
          </Button>
          {(file || existingUrl) && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onFileChange(null)}>
              Remove
            </Button>
          )}
          <p className="text-xs text-[var(--text-muted)]">JPG, PNG, WEBP or GIF.</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export function DirtyDot({ isDirty }: { isDirty: boolean }) {
  return (
    <span
      title={isDirty ? 'Unsaved changes' : 'Up to date'}
      className={`inline-block h-2 w-2 rounded-full transition-colors duration-200 ${isDirty ? 'bg-yellow-400' : 'bg-green-500'}`}
    />
  );
}
