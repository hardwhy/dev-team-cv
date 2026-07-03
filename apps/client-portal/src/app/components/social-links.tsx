import { useEffect, useState } from 'react';
import { cn } from '@dev-team-cv/shared-utils';
import {
  CONTACT_LINKS_KEY,
  isExternalContactUrl,
  normalizeContactUrl,
  parseContactLinks,
  settingsApi,
} from '@dev-team-cv/supabase';
import type { ContactLink } from '@dev-team-cv/shared-types';

function SocialIcon({ iconUrl, label }: { iconUrl: string; label: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!iconUrl) return;
    setFailed(false);
    const img = new Image();
    img.onerror = () => setFailed(true);
    img.src = iconUrl;
  }, [iconUrl]);

  if (!iconUrl || failed) {
    return (
      <span className="text-sm font-medium text-current">{label}</span>
    );
  }

  return (
    <span
      role="img"
      aria-label={label}
      className="block h-5 w-5 bg-current"
      style={{
        maskImage: `url("${iconUrl}")`,
        WebkitMaskImage: `url("${iconUrl}")`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  );
}

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

  if (links.length === 0) return null;

  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {links.map((link, index) => {
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
