import { DEFAULT_CONTACT_LINKS, type ContactLink } from '@dev-team-cv/shared-types';

export const CONTACT_LINKS_KEY = 'contact_links';

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeLegacyLink(raw: Record<string, unknown>): ContactLink | null {
  const label = typeof raw.label === 'string' ? raw.label.trim() : '';
  const url =
    typeof raw.url === 'string'
      ? raw.url.trim()
      : typeof raw.value === 'string'
        ? raw.value.trim()
        : '';
  const iconUrl = typeof raw.iconUrl === 'string' ? raw.iconUrl.trim() : '';
  const legacyIcon = typeof raw.icon === 'string' ? raw.icon.trim() : '';
  const slug =
    (typeof raw.slug === 'string' && raw.slug.trim()) ||
    (typeof raw.name === 'string' && raw.name.trim()) ||
    (typeof raw.id === 'string' && raw.id.trim()) ||
    legacyIcon ||
    slugify(label) ||
    'link';

  if (!label && !url) return null;

  return { slug, label, url, iconUrl };
}

function isContactLink(item: unknown): item is ContactLink {
  return (
    typeof item === 'object' &&
    item !== null &&
    'label' in item &&
    ('url' in item || 'value' in item) &&
    typeof (item as ContactLink).label === 'string'
  );
}

export function parseContactLinks(raw: string | undefined | null): ContactLink[] {
  if (!raw) return DEFAULT_CONTACT_LINKS;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_CONTACT_LINKS;

    const links = parsed
      .map((item) => {
        if (!isContactLink(item) && typeof item === 'object' && item !== null) {
          return normalizeLegacyLink(item as Record<string, unknown>);
        }
        if (isContactLink(item)) {
          return normalizeLegacyLink(item as unknown as Record<string, unknown>);
        }
        return null;
      })
      .filter((item): item is ContactLink => item !== null);

    return links.length > 0 ? links : DEFAULT_CONTACT_LINKS;
  } catch {
    return DEFAULT_CONTACT_LINKS;
  }
}

/** Ensures mailto: prefix when the URL looks like a bare email address. */
export function normalizeContactUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('mailto:')) return trimmed;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`;
  return trimmed;
}

export function isExternalContactUrl(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

function normalizeContactLink(item: unknown): ContactLink | null {
  if (typeof item !== 'object' || item === null) return null;
  return normalizeLegacyLink(item as Record<string, unknown>);
}

/** Parses a social_links jsonb array (or legacy JSON string). Returns [] when empty. */
export function parseSocialLinks(raw: unknown): ContactLink[] {
  if (!raw) return [];

  const parsed: unknown =
    typeof raw === 'string'
      ? (() => {
          try {
            return JSON.parse(raw);
          } catch {
            return null;
          }
        })()
      : raw;

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map(normalizeContactLink)
    .filter((item): item is ContactLink => item !== null);
}
