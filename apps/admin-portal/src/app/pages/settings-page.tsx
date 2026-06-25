import { useEffect, useState } from 'react';
import { settingsApi } from '@dev-team-cv/supabase';
import { Button, Input, Card } from '@dev-team-cv/ui';

// ── Dirty indicator dot ───────────────────────────────────────────────────────
function DirtyDot({ isDirty }: { isDirty: boolean }) {
  return (
    <span
      title={isDirty ? 'Unsaved changes' : 'Up to date'}
      className={`inline-block h-2 w-2 rounded-full transition-colors duration-200 ${isDirty ? 'bg-yellow-400' : 'bg-green-500'}`}
    />
  );
}

// ── Predefined icon options for contact links ─────────────────────────────────
const ICON_OPTIONS = [
  { value: 'email',    label: 'Email' },
  { value: 'github',   label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter',  label: 'Twitter / X' },
  { value: 'website',  label: 'Website' },
];

function ContactIconPreview({ type }: { type: string }) {
  if (type === 'email') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  );
  if (type === 'github') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
    </svg>
  );
  if (type === 'linkedin') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
  if (type === 'twitter') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

// ── Section: Branding ─────────────────────────────────────────────────────────
function BrandingSection() {
  const [teamName, setTeamName] = useState('');
  const [tagline, setTagline] = useState('');
  const [copyrightName, setCopyrightName] = useState('');
  const [saved, setSaved] = useState({ teamName: '', tagline: '', copyrightName: '' });
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const isDirty = teamName !== saved.teamName || tagline !== saved.tagline || copyrightName !== saved.copyrightName;

  useEffect(() => {
    settingsApi.getAll().then((s) => {
      const n = s['team_name'] ?? '';
      const t = s['team_tagline'] ?? '';
      const c = s['copyright_name'] ?? '';
      setTeamName(n); setTagline(t); setCopyrightName(c);
      setSaved({ teamName: n, tagline: t, copyrightName: c });
    });
  }, []);

  const handleSave = async () => {
    setSaving(true); setSavedOk(false);
    try {
      await Promise.all([
        settingsApi.set('team_name', teamName),
        settingsApi.set('team_tagline', tagline),
        settingsApi.set('copyright_name', copyrightName),
      ]);
      setSaved({ teamName, tagline, copyrightName });
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <Card className="space-y-5">
      <h2 className="font-semibold text-[var(--text-primary)]">Branding</h2>
      <Input label="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} hint="Displayed in the site header and hero section." />
      <Input label="Team Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} hint="Short subtitle shown in the hero." />
      <Input label="Copyright Name" value={copyrightName} onChange={(e) => setCopyrightName(e.target.value)} hint="Used in the footer copyright notice." />
      <div className="flex items-center gap-3 pt-2">
        <DirtyDot isDirty={isDirty} />
        <span className="text-xs text-[var(--text-muted)]">{isDirty ? 'Unsaved changes' : 'Up to date'}</span>
        <Button loading={saving} disabled={!isDirty} onClick={handleSave} className="ml-auto">Save Branding</Button>
        {savedOk && <span className="text-sm text-green-500">Saved</span>}
      </div>
    </Card>
  );
}

// ── Section: Contact Info ─────────────────────────────────────────────────────
interface ContactLink {
  icon: string;
  label: string;
  value: string;
}

const DEFAULT_LINKS: ContactLink[] = [
  { icon: 'email',  label: 'Email',  value: '' },
  { icon: 'github', label: 'GitHub', value: '' },
];

function ContactInfoSection() {
  const [links, setLinks] = useState<ContactLink[]>(DEFAULT_LINKS);
  const [savedLinks, setSavedLinks] = useState<ContactLink[]>(DEFAULT_LINKS);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const isDirty = JSON.stringify(links) !== JSON.stringify(savedLinks);

  useEffect(() => {
    settingsApi.getAll().then((s) => {
      const raw = s['contact_links'];
      if (raw) {
        try {
          const parsed: ContactLink[] = JSON.parse(raw);
          setLinks(parsed);
          setSavedLinks(parsed);
          return;
        } catch { /* fall through to defaults */ }
      }
      // Seed from legacy individual keys if they exist
      const seeded: ContactLink[] = [
        { icon: 'email',  label: 'Email',  value: s['contact_email'] ?? '' },
        { icon: 'github', label: 'GitHub', value: s['contact_github'] ?? '' },
      ];
      setLinks(seeded);
      setSavedLinks(seeded);
    });
  }, []);

  const updateLink = (i: number, field: keyof ContactLink, value: string) =>
    setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));

  const addLink = () => setLinks((prev) => [...prev, { icon: 'website', label: '', value: '' }]);

  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true); setSavedOk(false);
    try {
      await settingsApi.set('contact_links', JSON.stringify(links));
      setSavedLinks(links);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[var(--text-primary)]">Contact Info</h2>
        <Button variant="secondary" size="sm" onClick={addLink}>+ Add Link</Button>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">These appear in the public contact section.</p>

      <div className="space-y-4">
        {links.map((link, i) => (
          <div key={i} className="flex items-end gap-3">
            {/* Icon preview */}
            <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] shrink-0">
              <ContactIconPreview type={link.icon} />
            </div>

            {/* Icon type select */}
            <div className="flex flex-col gap-1.5 w-36 shrink-0">
              <label className="text-xs font-medium text-[var(--text-muted)]">Icon</label>
              <div className="relative">
                <select
                  value={link.icon}
                  onChange={(e) => updateLink(i, 'icon', e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--surface)] pl-3 pr-7 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4l4 4 4-4"/></svg>
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="flex flex-col gap-1.5 w-28 shrink-0">
              <label className="text-xs font-medium text-[var(--text-muted)]">Label</label>
              <input
                value={link.label}
                onChange={(e) => updateLink(i, 'label', e.target.value)}
                placeholder="e.g. Email"
                className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
              />
            </div>

            {/* Value (URL or email) */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <label className="text-xs font-medium text-[var(--text-muted)]">
                {link.icon === 'email' ? 'Email address' : 'URL'}
              </label>
              <input
                value={link.value}
                onChange={(e) => updateLink(i, 'value', e.target.value)}
                placeholder={link.icon === 'email' ? 'hello@devteam.dev' : 'https://…'}
                type={link.icon === 'email' ? 'email' : 'url'}
                className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
              />
            </div>

            {/* Remove — disabled when only 1 link remains */}
            <button
              type="button"
              onClick={() => removeLink(i)}
              disabled={links.length <= 1}
              aria-label={`Remove ${link.label}`}
              className="mb-0.5 h-10 w-10 shrink-0 flex items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-[var(--text-muted)] disabled:hover:border-[var(--border)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <DirtyDot isDirty={isDirty} />
        <span className="text-xs text-[var(--text-muted)]">{isDirty ? 'Unsaved changes' : 'Up to date'}</span>
        <Button loading={saving} disabled={!isDirty} onClick={handleSave} className="ml-auto">Save Contact Info</Button>
        {savedOk && <span className="text-sm text-green-500">Saved</span>}
      </div>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Configure site-wide content.</p>
      </div>
      <BrandingSection />
      <ContactInfoSection />
    </div>
  );
}
