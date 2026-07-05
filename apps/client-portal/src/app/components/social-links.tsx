import { useEffect, useState } from 'react';
import { cn } from '@dev-team-cv/shared-utils';
import { SocialIcon } from '@dev-team-cv/ui';
import {
  CONTACT_LINKS_KEY,
  isExternalContactUrl,
  normalizeContactUrl,
  parseContactLinks,
  settingsApi,
} from '@dev-team-cv/supabase';
import type { ContactLink } from '@dev-team-cv/shared-types';

interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className }: SocialLinksProps) {
  const [links, setLinks] = useState<ContactLink[]>([]);

  useEffect(() => {
    settingsApi
      .getAll()
      .then((settings) => {
        setLinks(
          parseContactLinks(settings[CONTACT_LINKS_KEY]).map((link) => ({
            ...link,
            url: normalizeContactUrl(link.url),
          }))
        );
      })
      .catch(() => {
        /* keep empty */
      });
  }, []);

  const visibleLinks = links.filter((link) => link.iconUrl.trim());

  if (visibleLinks.length === 0) return null;

  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {visibleLinks.map((link, index) => {
        const href = normalizeContactUrl(link.url);
        const external = isExternalContactUrl(href);

        return (
          <a
            key={`${link.slug}-${index}`}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={link.label}
            title={link.label}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <SocialIcon iconUrl={link.iconUrl} label={link.label} />
          </a>
        );
      })}
    </div>
  );
}
