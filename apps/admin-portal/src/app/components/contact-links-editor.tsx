import { useEffect, useRef, useState } from 'react';
import { slugify } from '@dev-team-cv/shared-utils';
import type { ContactLink } from '@dev-team-cv/shared-types';
import { Button, Input } from '@dev-team-cv/ui';
import { ConfirmDialog } from './confirm-dialog';
import { IconPicker } from './icon-picker';

const EMPTY_LINK: ContactLink = { slug: '', label: '', url: '', iconUrl: '' };

type LinkMeta = { id: string; fromSaved: boolean };

function createLinkMeta(links: ContactLink[], savedLinks: ContactLink[]): LinkMeta[] {
  return links.map((_, index) => ({
    id: crypto.randomUUID(),
    fromSaved: index < savedLinks.length,
  }));
}

function linkHasValues(link: ContactLink, iconFile: File | null | undefined): boolean {
  return Boolean(
    link.label.trim() ||
    link.slug.trim() ||
    link.url.trim() ||
    link.iconUrl.trim() ||
    iconFile
  );
}

export interface ContactLinksEditorProps {
  links: ContactLink[];
  onLinksChange: (links: ContactLink[]) => void;
  iconFiles: (File | null)[];
  onIconFilesChange: (files: (File | null)[]) => void;
  savedLinks?: ContactLink[];
  minLinks?: number;
  addLabel?: string;
}

export function ContactLinksEditor({
  links,
  onLinksChange,
  iconFiles,
  onIconFilesChange,
  savedLinks = [],
  minLinks = 0,
  addLabel = '+ Add Link',
}: ContactLinksEditorProps) {
  const linkMetaRef = useRef<LinkMeta[]>(createLinkMeta(links, savedLinks));
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [slugLocked, setSlugLocked] = useState<boolean[]>(() =>
    links.map((link) => Boolean(link.slug.trim()))
  );
  const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null);
  const [scrollToKey, setScrollToKey] = useState<string | null>(null);

  useEffect(() => {
    while (linkMetaRef.current.length < links.length) {
      linkMetaRef.current.push({ id: crypto.randomUUID(), fromSaved: false });
    }
    if (linkMetaRef.current.length > links.length) {
      linkMetaRef.current = linkMetaRef.current.slice(0, links.length);
    }
  }, [links.length]);

  useEffect(() => {
    if (!scrollToKey) return;

    const frame = requestAnimationFrame(() => {
      const el = cardRefs.current.get(scrollToKey);
      if (!el) return;

      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      requestAnimationFrame(() => {
        const field = el.querySelector<HTMLElement>(
          'input:not([type="file"]):not(.sr-only), textarea, select'
        );
        field?.focus({ preventScroll: true });
        setScrollToKey(null);
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [scrollToKey, links.length]);

  const updateLink = (index: number, field: keyof ContactLink, value: string) =>
    onLinksChange(links.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const updateLabel = (index: number, label: string) =>
    onLinksChange(
      links.map((item, i) =>
        i === index
          ? { ...item, label, slug: slugLocked[index] === true ? item.slug : slugify(label) }
          : item
      )
    );

  const updateSlug = (index: number, slug: string) => {
    setSlugLocked((prev) => {
      const next = [...prev];
      while (next.length < links.length) next.push(false);
      next[index] = true;
      return next;
    });
    updateLink(index, 'slug', slug);
  };

  const setIconFile = (index: number, file: File | null) =>
    onIconFilesChange(
      (() => {
        const next = [...iconFiles];
        while (next.length < links.length) next.push(null);
        next[index] = file;
        return next;
      })()
    );

  const addLink = () => {
    const id = crypto.randomUUID();
    linkMetaRef.current.push({ id, fromSaved: false });
    onLinksChange([...links, { ...EMPTY_LINK }]);
    onIconFilesChange([...iconFiles, null]);
    setSlugLocked((prev) => [...prev, false]);
    setScrollToKey(id);
  };

  const removeLink = (index: number) => {
    if (links.length <= minLinks) return;
    onLinksChange(links.filter((_, i) => i !== index));
    onIconFilesChange(iconFiles.filter((_, i) => i !== index));
    setSlugLocked((prev) => prev.filter((_, i) => i !== index));
    linkMetaRef.current = linkMetaRef.current.filter((_, i) => i !== index);
    setPendingRemoveIndex(null);
  };

  const attemptRemove = (index: number) => {
    if (links.length <= minLinks) return;

    const link = links[index];
    const hasValues = linkHasValues(link, iconFiles[index]);
    const fromSaved = linkMetaRef.current[index]?.fromSaved ?? false;

    if (hasValues && fromSaved) {
      setPendingRemoveIndex(index);
      return;
    }

    removeLink(index);
  };

  const pendingLink = pendingRemoveIndex !== null ? links[pendingRemoveIndex] : null;
  const pendingLabel = pendingLink?.label.trim() || pendingLink?.slug.trim() || 'this link';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">Social Links</p>
          <p className="text-xs text-[var(--text-muted)]">Add links shown on the member profile (GitHub, email, etc.).</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={addLink}>
          {addLabel}
        </Button>
      </div>

      {links.length === 0 && (
        <p className="text-sm text-[var(--text-muted)] rounded-xl border border-dashed border-[var(--border)] px-4 py-6 text-center">
          No links yet. Click &ldquo;{addLabel.replace(/^\+ /, '')}&rdquo; to add one.
        </p>
      )}

      {links.map((link, index) => {
        const cardKey = linkMetaRef.current[index]?.id ?? String(index);

        return (
        <div
          key={cardKey}
          ref={(el) => {
            if (el) cardRefs.current.set(cardKey, el);
            else cardRefs.current.delete(cardKey);
          }}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-4 transition-colors hover:border-[var(--text-muted)]"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[var(--text-muted)]">Link {index + 1}</span>
            <button
              type="button"
              onClick={() => attemptRemove(index)}
              disabled={links.length <= minLinks}
              aria-label={`Remove link ${index + 1}`}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>

          <div className="flex gap-4 items-start">
            <IconPicker
              existingUrl={link.iconUrl}
              file={iconFiles[index] ?? null}
              onFileChange={(file) => setIconFile(index, file)}
              onClearExisting={() => updateLink(index, 'iconUrl', '')}
              fallbackLabel={link.label || link.slug}
              hint="Square icons work best (PNG or SVG)."
            />

            <div className="flex-1 space-y-4 min-w-0">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Label"
                  value={link.label}
                  onChange={(e) => updateLabel(index, e.target.value)}
                  placeholder="GitHub"
                  hint="Text shown on the public site."
                />
                <Input
                  label="Slug"
                  value={link.slug}
                  onChange={(e) => updateSlug(index, e.target.value)}
                  placeholder="github"
                  hint={slugLocked[index] === true ? 'Custom slug.' : 'Auto-filled from label.'}
                />
              </div>
              <Input
                label="Link URL"
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                placeholder="https://github.com/username or mailto:hello@example.com"
                hint="Full URL or email address."
              />
            </div>
          </div>
        </div>
        );
      })}

      <ConfirmDialog
        open={pendingRemoveIndex !== null}
        title="Remove saved link?"
        description={`“${pendingLabel}” will be removed. Save your changes to apply this on the public site.`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => pendingRemoveIndex !== null && removeLink(pendingRemoveIndex)}
        onCancel={() => setPendingRemoveIndex(null)}
      />
    </div>
  );
}
