import { useEffect, useState } from 'react';
import { CONTACT_LINKS_KEY, parseContactLinks, settingsApi, storageApi, resolveContactLinkIcons } from '@dev-team-cv/supabase';
import { DEFAULT_CONTACT_LINKS, type ContactLink } from '@dev-team-cv/shared-types';
import { FormCard } from '../components/form-card';
import { ContactLinksEditor } from '../components/contact-links-editor';

export function ContactInfoPage() {
  const [links, setLinks] = useState<ContactLink[]>(DEFAULT_CONTACT_LINKS);
  const [savedLinks, setSavedLinks] = useState<ContactLink[]>(DEFAULT_CONTACT_LINKS);
  const [iconFiles, setIconFiles] = useState<(File | null)[]>([]);
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
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedOk(false);
    setSaveError(null);
    try {
      const nextLinks = await resolveContactLinkIcons(
        links,
        iconFiles,
        (path, file) => storageApi.upload('contact-icons', path, file)
      );

      await settingsApi.set(CONTACT_LINKS_KEY, JSON.stringify(nextLinks));
      setLinks(nextLinks);
      setSavedLinks(nextLinks);
      setIconFiles(nextLinks.map(() => null));
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
        isDirty={isDirty}
        saving={saving}
        savedOk={savedOk}
        onSave={handleSave}
      >
        {saveError && <p role="alert" className="text-sm text-red-500">{saveError}</p>}

        <ContactLinksEditor
          key={JSON.stringify(savedLinks)}
          links={links}
          savedLinks={savedLinks}
          onLinksChange={setLinks}
          iconFiles={iconFiles}
          onIconFilesChange={setIconFiles}
          minLinks={1}
        />
      </FormCard>
    </div>
  );
}
