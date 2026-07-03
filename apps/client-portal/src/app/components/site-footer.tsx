import { useBranding } from '@dev-team-cv/supabase';
import { SocialLinks } from './social-links';

export function SiteFooter() {
  const branding = useBranding();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-4">
        <SocialLinks />
        <p className="text-sm text-[var(--text-muted)] text-center">
          &copy; {year} {branding.copyrightName}. Built with React, Vite &amp; Supabase.
        </p>
      </div>
    </footer>
  );
}
