import { useCallback, useEffect, useState } from 'react';
import { settingsApi } from './settings.api';

export const BRAND_NAME_PRIMARY_KEY = 'team_name';
export const BRAND_NAME_SECONDARY_KEY = 'team_name_secondary';
export const BRAND_TAGLINE_KEY = 'team_tagline';
export const BRAND_COPYRIGHT_KEY = 'copyright_name';
export const HERO_HEADLINE_KEY = 'hero_headline';
export const HERO_HEADLINE_ACCENT_KEY = 'hero_headline_accent';

export interface Branding {
  /** First part of the logo, rendered in the primary text color. */
  primary: string;
  /** Second part of the logo, rendered muted (e.g. "team" in "devteam"). */
  secondary: string;
  tagline: string;
  copyrightName: string;
  /** First line of the hero headline, in the primary color. */
  heroHeadline: string;
  /** Second line of the hero headline, rendered in the muted accent color. */
  heroHeadlineAccent: string;
}

export const DEFAULT_BRANDING: Branding = {
  primary: 'dev',
  secondary: 'team',
  tagline: 'A focused team of engineers crafting elegant, performant cross-platform experiences.',
  copyrightName: 'devteam',
  heroHeadline: 'We build software',
  heroHeadlineAccent: 'that people love.',
};

export function parseBranding(settings: Record<string, string>): Branding {
  const primary = settings[BRAND_NAME_PRIMARY_KEY]?.trim() || DEFAULT_BRANDING.primary;
  const secondary = settings[BRAND_NAME_SECONDARY_KEY] ?? DEFAULT_BRANDING.secondary;
  const copyrightName =
    settings[BRAND_COPYRIGHT_KEY]?.trim() || `${primary}${secondary}`.trim() || DEFAULT_BRANDING.copyrightName;
  return {
    primary,
    secondary,
    tagline: settings[BRAND_TAGLINE_KEY]?.trim() || DEFAULT_BRANDING.tagline,
    copyrightName,
    heroHeadline: settings[HERO_HEADLINE_KEY]?.trim() || DEFAULT_BRANDING.heroHeadline,
    heroHeadlineAccent: settings[HERO_HEADLINE_ACCENT_KEY]?.trim() || DEFAULT_BRANDING.heroHeadlineAccent,
  };
}

const listeners = new Set<() => void>();

/** Notify all useBranding subscribers to re-fetch from the database. */
export function invalidateBranding(): void {
  listeners.forEach((listener) => listener());
}

/** Reactively loads site branding from settings, falling back to sensible defaults. */
export function useBranding(): Branding {
  const [branding, setBranding] = useState<Branding>(DEFAULT_BRANDING);

  const refresh = useCallback(() => {
    settingsApi
      .getAll()
      .then((settings) => setBranding(parseBranding(settings)))
      .catch(() => {
        /* keep current */
      });
  }, []);

  useEffect(() => {
    refresh();
    listeners.add(refresh);
    return () => {
      listeners.delete(refresh);
    };
  }, [refresh]);

  return branding;
}
