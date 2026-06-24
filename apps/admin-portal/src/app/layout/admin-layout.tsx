import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@dev-team-cv/auth';
import { ThemeToggle, Button } from '@dev-team-cv/ui';
import { cn } from '@dev-team-cv/shared-utils';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard',  icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/team',      label: 'Team',        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/projects',  label: 'Projects',    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { to: '/media',     label: 'Media',       icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/contacts',  label: 'Contacts',    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { to: '/settings',  label: 'Settings',    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const year = new Date().getFullYear();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="flex h-14 items-center border-b border-[var(--border)] px-5">
          <span className="font-semibold text-sm text-[var(--text-primary)]">
            dev<span className="text-[var(--text-muted)]">team</span>
            <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">admin</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
          <ul className="space-y-0.5" role="list">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150',
                    isActive
                      ? 'bg-[var(--surface-overlay)] text-[var(--text-primary)] font-medium'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)]'
                  )}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d={icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User + copyright footer */}
        <div className="border-t border-[var(--border)] p-3 space-y-3">
          <div className="px-2 text-xs text-[var(--text-muted)] truncate">{user?.email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => signOut()}>
            Sign out
          </Button>
          <p className="px-2 text-[10px] text-[var(--text-muted)] leading-relaxed">
            &copy; {year} devteam. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-[var(--border)] px-6">
          <div />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
