import { useEffect, useState } from 'react';
import {
  BRAND_COPYRIGHT_KEY,
  BRAND_NAME_PRIMARY_KEY,
  BRAND_NAME_SECONDARY_KEY,
  BRAND_TAGLINE_KEY,
  HERO_HEADLINE_KEY,
  HERO_HEADLINE_ACCENT_KEY,
  invalidateBranding,
  settingsApi,
} from '@dev-team-cv/supabase';
import { Input, BrandLogo } from '@dev-team-cv/ui';
import { FormCard } from '../components/form-card';

const EMPTY = { primary: '', secondary: '', tagline: '', copyrightName: '', heroHeadline: '', heroHeadlineAccent: '' };

export function BrandingPage() {
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [tagline, setTagline] = useState('');
  const [copyrightName, setCopyrightName] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroHeadlineAccent, setHeroHeadlineAccent] = useState('');
  const [saved, setSaved] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const isDirty =
    primary !== saved.primary ||
    secondary !== saved.secondary ||
    tagline !== saved.tagline ||
    copyrightName !== saved.copyrightName ||
    heroHeadline !== saved.heroHeadline ||
    heroHeadlineAccent !== saved.heroHeadlineAccent;

  useEffect(() => {
    settingsApi.getAll().then((s) => {
      const next = {
        primary: s[BRAND_NAME_PRIMARY_KEY] ?? '',
        secondary: s[BRAND_NAME_SECONDARY_KEY] ?? '',
        tagline: s[BRAND_TAGLINE_KEY] ?? '',
        copyrightName: s[BRAND_COPYRIGHT_KEY] ?? '',
        heroHeadline: s[HERO_HEADLINE_KEY] ?? '',
        heroHeadlineAccent: s[HERO_HEADLINE_ACCENT_KEY] ?? '',
      };
      setPrimary(next.primary);
      setSecondary(next.secondary);
      setTagline(next.tagline);
      setCopyrightName(next.copyrightName);
      setHeroHeadline(next.heroHeadline);
      setHeroHeadlineAccent(next.heroHeadlineAccent);
      setSaved(next);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true); setSavedOk(false);
    try {
      await Promise.all([
        settingsApi.set(BRAND_NAME_PRIMARY_KEY, primary),
        settingsApi.set(BRAND_NAME_SECONDARY_KEY, secondary),
        settingsApi.set(BRAND_TAGLINE_KEY, tagline),
        settingsApi.set(BRAND_COPYRIGHT_KEY, copyrightName),
        settingsApi.set(HERO_HEADLINE_KEY, heroHeadline),
        settingsApi.set(HERO_HEADLINE_ACCENT_KEY, heroHeadlineAccent),
      ]);
      setSaved({ primary, secondary, tagline, copyrightName, heroHeadline, heroHeadlineAccent });
      invalidateBranding();
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Branding</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          The two-tone wordmark shown in the site header, footer, and hero.
        </p>
      </div>

      <FormCard
        title="Brand Identity"
        description="Configure how your team appears across the public site and admin."
        isDirty={isDirty}
        saving={saving}
        savedOk={savedOk}
        onSave={handleSave}
      >
        <div className="flex items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] py-8">
          <BrandLogo
            primary={primary || 'dev'}
            secondary={secondary || 'team'}
            className="text-3xl font-bold text-[var(--text-primary)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Brand Name — First"
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            placeholder="dev"
            hint="Shown in the primary color."
          />
          <Input
            label="Brand Name — Second"
            value={secondary}
            onChange={(e) => setSecondary(e.target.value)}
            placeholder="team"
            hint="Shown muted, right after the first part."
          />
        </div>
        <Input
          label="Copyright Name"
          value={copyrightName}
          onChange={(e) => setCopyrightName(e.target.value)}
          hint="Used in the footer copyright notice. Defaults to the full brand name."
        />

        {/* Hero content */}
        <div className="pt-2 border-t border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-4 mb-1">Hero Section</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">The large headline and subtitle at the top of the public home page.</p>

          {/* Hero preview */}
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-6 text-center mb-4">
            <p className="text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              {heroHeadline || 'We build software'}
              <br />
              <span className="text-[var(--text-secondary)]">{heroHeadlineAccent || 'that people love.'}</span>
            </p>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              {tagline || 'A focused team of engineers…'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Headline — Line 1"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              placeholder="We build software"
              hint="Shown in the primary color."
            />
            <Input
              label="Headline — Line 2"
              value={heroHeadlineAccent}
              onChange={(e) => setHeroHeadlineAccent(e.target.value)}
              placeholder="that people love."
              hint="Shown muted, on the second line."
            />
          </div>
          <Input
            label="Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            hint="Subtitle shown under the hero headline."
          />
        </div>
      </FormCard>
    </div>
  );
}
