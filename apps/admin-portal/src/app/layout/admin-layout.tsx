import { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@dev-team-cv/auth';
import { ThemeToggle, BrandLogo } from '@dev-team-cv/ui';
import { useBranding } from '@dev-team-cv/supabase';
import { cn } from '@dev-team-cv/shared-utils';
import { ConfirmDialog } from '../components/confirm-dialog';

interface NavChild {
  to: string;
  label: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: string;
  children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard',  icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/team',      label: 'Team',        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/projects',  label: 'Projects',    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { to: '/contacts',  label: 'Contacts',    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { to: '/about',     label: 'About',       icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  {
    to: '/settings',
    label: 'Settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    children: [
      { to: '/settings/branding', label: 'Branding' },
      { to: '/settings/contact', label: 'Social Links' },
    ],
  },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const branding = useBranding();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const year = new Date().getFullYear();
  const clientPortalUrl =
    (import.meta.env['VITE_CLIENT_PORTAL_URL'] as string | undefined)?.trim() ||
    'http://localhost:4200';

  const isSettingsActive = location.pathname.startsWith('/settings');

  useEffect(() => {
    if (isSettingsActive) setSettingsOpen(true);
  }, [isSettingsActive]);

  const handleSignOut = () => setConfirmSignOut(true);
  const confirmAndSignOut = async () => {
    setConfirmSignOut(false);
    await signOut();
  };

  const linkClass = (isActive: boolean, indented = false) =>
    cn(
      'flex items-center gap-3 rounded-lg text-sm transition-all duration-150',
      indented ? 'px-3 py-1.5 ml-7' : 'px-3 py-2',
      isActive
        ? 'glass-nav-item text-[var(--text-primary)] font-medium'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)]/60'
    );

  return (
    <div className="admin-ambient flex h-screen overflow-hidden">
      <aside className="glass-sidebar w-60 shrink-0 flex flex-col border-r">
        <div className="flex h-14 items-center border-b border-[var(--border)]/50 px-5">
          <span className="font-semibold text-sm text-[var(--text-primary)]">
            <BrandLogo primary={branding.primary} secondary={branding.secondary} />
            <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">admin</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
          <ul className="space-y-0.5" role="list">
            {NAV_ITEMS.map((item) => {
              if (!item.children) {
                return (
                  <li key={item.to}>
                    <NavLink to={item.to} className={({ isActive }) => linkClass(isActive)}>
                      <NavIcon d={item.icon} />
                      {item.label}
                    </NavLink>
                  </li>
                );
              }

              return (
                <li key={item.to}>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen((open) => !open)}
                    className={cn(
                      linkClass(isSettingsActive),
                      'w-full'
                    )}
                    aria-expanded={settingsOpen}
                  >
                    <NavIcon d={item.icon} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                      className={cn('shrink-0 transition-transform duration-200', settingsOpen && 'rotate-180')}
                    >
                      <path d="M2 4l4 4 4-4" />
                    </svg>
                  </button>

                  {settingsOpen && (
                    <ul className="mt-0.5 space-y-0.5" role="list">
                      {item.children.map((child) => (
                        <li key={child.to}>
                          <NavLink to={child.to} className={({ isActive }) => linkClass(isActive, true)}>
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[var(--border)]/50 p-3 space-y-2">
          <div className="px-2 text-xs text-[var(--text-muted)] truncate">{user?.email}</div>
          <p className="px-2 text-[10px] text-[var(--text-muted)] leading-relaxed">
            &copy; {year} {branding.copyrightName}. All rights reserved.
          </p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="glass-header flex h-14 items-center justify-end gap-2 border-b px-6">
          <a
            href={clientPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Preview live site"
            title="Preview live site"
            className="flex items-center rounded-md p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)]/60 transition-colors duration-150"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </a>
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex items-center rounded-md p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)]/60 transition-colors duration-150"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="2" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={confirmSignOut}
        title="Sign out?"
        description="You will be returned to the login screen."
        confirmLabel="Sign out"
        variant="danger"
        onConfirm={confirmAndSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </div>
  );
}
