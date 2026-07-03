import { useEffect, useState } from 'react';
import { CONTACT_LINKS_KEY, parseContactLinks, settingsApi, storageApi } from '@dev-team-cv/supabase';
import { DEFAULT_CONTACT_LINKS, type ContactLink } from '@dev-team-cv/shared-types';
import { generateStoragePath, slugify } from '@dev-team-cv/shared-utils';
import { Button, Input } from '@dev-team-cv/ui';
import { FormCard } from '../components/form-card';
import { IconPicker } from '../components/icon-picker';

const EMPTY_LINK: ContactLink = { slug: '', label: '', url: '', iconUrl: '' };

export function ContactInfoPage() {
  const [links, setLinks] = useState<ContactLink[]>(DEFAULT_CONTACT_LINKS);
  const [savedLinks, setSavedLinks] = useState<ContactLink[]>(DEFAULT_CONTACT_LINKS);
  const [iconFiles, setIconFiles] = useState<(File | null)[]>([]);
  const [slugLocked, setSlugLocked] = useState<boolean[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const hasPendingIcons = iconFiles.some(Boolean);
  const isDirty = JSON.stringify(links) !== JSON.stringify(savedLinks) || hasPendingIcons;

  useEffect(() => {
    settingsApi.getAll().then((settings) => {
      const parsed = parseContactLinks(settings[CONTACT_LINKS_KEY]);
      setLinks(parsed);
      setSavedLinks(parsed);
      setIconFiles(parsed.map(() => null));
      setSlugLocked(parsed.map(() => true));
    });
  }, []);

  const updateLink = (index: number, field: keyof ContactLink, value: string) =>
    setLinks((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const updateLabel = (index: number, label: string) =>
    setLinks((prev) =>
      prev.map((item, i) =>
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
    setIconFiles((prev) => {
      const next = [...prev];
      while (next.length < links.length) next.push(null);
      next[index] = file;
      return next;
    });

  const addLink = () => {
    setLinks((prev) => [...prev, { ...EMPTY_LINK }]);
    setIconFiles((prev) => [...prev, null]);
    setSlugLocked((prev) => [...prev, false]);
  };

  const removeLink = (index: number) => {
    if (links.length <= 1) return;
    setLinks((prev) => prev.filter((_, i) => i !== index));
    setIconFiles((prev) => prev.filter((_, i) => i !== index));
    setSlugLocked((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedOk(false);
    setSaveError(null);
    try {
      const nextLinks = await Promise.all(
        links.map(async (link, index) => {
          const file = iconFiles[index];
          if (!file) return link;

          const slug = link.slug.trim() || `link-${index}`;
          const path = generateStoragePath(`icons/${slug}`, file.name);
          const iconUrl = await storageApi.upload('contact-icons', path, file);
          return { ...link, iconUrl };
        })
      );

      await settingsApi.set(CONTACT_LINKS_KEY, JSON.stringify(nextLinks));
      setLinks(nextLinks);
      setSavedLinks(nextLinks);
      setIconFiles(nextLinks.map(() => null));
      setSlugLocked(nextLinks.map(() => true));
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } catch (error) {
      console.error(error);
      setSaveError('Failed to save. Check your icon uploads and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Social Links</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Icon links shown in the site footer.
        </p>
      </div>

      <FormCard
        title="Social Links"
        description="Add icon links for the site footer (GitHub, email, etc.)."
        action={<Button variant="secondary" size="sm" onClick={addLink}>+ Add Link</Button>}
        isDirty={isDirty}
        saving={saving}
        savedOk={savedOk}
        onSave={handleSave}
      >
        {saveError && <p role="alert" className="text-sm text-red-500">{saveError}</p>}

        {links.map((link, index) => (
          <div
            key={index}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-4 transition-colors hover:border-[var(--text-muted)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-[var(--text-muted)]">Link {index + 1}</span>
              <button
                type="button"
                onClick={() => removeLink(index)}
                disabled={links.length <= 1}
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
                  placeholder="https://github.com/your-team or mailto:hello@example.com"
                  hint="Full URL or email address."
                />
              </div>
            </div>
          </div>
        ))}
      </FormCard>
    </div>
  );
}
