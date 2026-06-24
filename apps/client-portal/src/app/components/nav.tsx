import { useState } from 'react';
import { cn } from '@dev-team-cv/shared-utils';
import { useScrollSpy } from '@dev-team-cv/shared-hooks';
import { ThemeToggle } from '@dev-team-cv/ui';

const SECTIONS = ['hero', 'about', 'team', 'projects', 'skills', 'constellation', 'contact'];
const LABELS: Record<string, string> = {
  hero: 'Home', about: 'About', team: 'Team', projects: 'Projects',
  skills: 'Skills', constellation: 'Network', contact: 'Contact',
};

export function Nav() {
  const active = useScrollSpy(SECTIONS);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl flex h-14 items-center justify-between px-6" aria-label="Main navigation">
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="font-semibold text-[var(--text-primary)] text-sm tracking-tight"
          aria-label="Go to top"
        >
          dev<span className="text-[var(--text-muted)]">team</span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {SECTIONS.filter((s) => s !== 'hero').map((id) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm transition-colors duration-150',
                  active === id
                    ? 'text-[var(--text-primary)] bg-[var(--surface-raised)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                )}
                aria-current={active === id ? 'page' : undefined}
              >
                {LABELS[id]}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2l14 14M16 2L2 16"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 5h14M2 9h14M2 13h14"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-6 pb-4">
          <ul className="flex flex-col gap-1 pt-3">
            {SECTIONS.filter((s) => s !== 'hero').map((id) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
                >
                  {LABELS[id]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
