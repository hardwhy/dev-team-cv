import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@dev-team-cv/shared-utils';
import { useScrollSpy } from '@dev-team-cv/shared-hooks';
import { ThemeToggle } from '@dev-team-cv/ui';
import { useSectionQuery } from '../hooks/use-section-query';

const HOME_SECTIONS = ['hero', 'about', 'team', 'projects', 'skills', 'constellation', 'contact'] as const;
const NAV_SECTIONS = HOME_SECTIONS.filter((s) => s !== 'hero');
const SECTION_LABELS: Record<(typeof NAV_SECTIONS)[number], string> = {
  about: 'About',
  team: 'Team',
  projects: 'Featured',
  skills: 'Skills',
  constellation: 'Network',
  contact: 'Contact',
};

type NavKey = (typeof NAV_SECTIONS)[number] | 'all-projects';

const NAV_ITEMS: { key: NavKey; label: string; type: 'section' | 'route'; to?: string }[] = [
  ...NAV_SECTIONS.map((id) => ({
    key: id as NavKey,
    label: SECTION_LABELS[id],
    type: 'section' as const,
  })),
  { key: 'all-projects', label: 'All Projects', type: 'route', to: '/projects' },
];

export function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { onHome, section, goToSection, syncSectionFromScroll } = useSectionQuery(HOME_SECTIONS);
  const scrollActive = useScrollSpy([...HOME_SECTIONS]);
  const [pending, setPending] = useState<string | null>(null);

  const onAllProjects = location.pathname === '/projects';
  const active: NavKey | '' = onAllProjects
    ? 'all-projects'
    : onHome
    ? ((pending ?? section ?? scrollActive) as NavKey)
    : '';

  useEffect(() => {
    if (!onHome || pending) return;
    syncSectionFromScroll(scrollActive);
  }, [onHome, pending, scrollActive, syncSectionFromScroll]);

  useEffect(() => {
    if (pending && scrollActive === pending) setPending(null);
  }, [scrollActive, pending]);

  useEffect(() => {
    if (!pending) return;
    const cancel = () => setPending(null);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchmove', cancel, { passive: true });
    return () => {
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchmove', cancel);
    };
  }, [pending]);

  const [menuOpen, setMenuOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement | HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const updateIndicator = useCallback(() => {
    const btn = btnRefs.current.get(active);
    const list = listRef.current;
    if (!btn || !list || !active) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const listRect = list.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - listRect.left,
      width: btnRect.width,
      opacity: 1,
    });
  }, [active]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, menuOpen]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const goHome = () => {
    setMenuOpen(false);
    if (onHome) {
      setPending('hero');
      goToSection('hero', { replace: true });
    } else {
      navigate('/');
    }
  };

  const handleSectionClick = (id: (typeof NAV_SECTIONS)[number]) => {
    setMenuOpen(false);
    setPending(id);
    goToSection(id);
  };

  const linkClass = (key: NavKey, isActive: boolean, fullWidth = false) =>
    cn(
      'relative z-10 rounded-full text-sm font-medium transition-colors duration-200',
      fullWidth ? 'w-full text-left px-3 py-2.5' : 'px-3.5 py-2',
      isActive
        ? 'font-semibold text-[var(--text-primary)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    );

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl flex h-14 items-center justify-between px-6" aria-label="Main navigation">
        <button
          onClick={goHome}
          className="font-semibold text-[var(--text-primary)] text-sm tracking-tight"
          aria-label="Go to top"
        >
          dev<span className="text-[var(--text-muted)]">team</span>
        </button>

        <ul ref={listRef} className="relative hidden md:flex items-center gap-0.5" role="list">
          <div
            aria-hidden="true"
            className="nav-glass-indicator pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
          />
          {NAV_ITEMS.map(({ key, label, type, to }) => {
            const isActive = active === key;
            if (type === 'route' && to) {
              return (
                <li key={key}>
                  <Link
                    ref={(el) => {
                      if (el) btnRefs.current.set(key, el);
                      else btnRefs.current.delete(key);
                    }}
                    to={to}
                    className={linkClass(key, isActive)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            }

            return (
              <li key={key}>
                <button
                  ref={(el) => {
                    if (el) btnRefs.current.set(key, el);
                    else btnRefs.current.delete(key);
                  }}
                  onClick={() => handleSectionClick(key as (typeof NAV_SECTIONS)[number])}
                  className={linkClass(key, isActive)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
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

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-6 pb-4">
          <ul className="flex flex-col gap-1 pt-3">
            {NAV_ITEMS.map(({ key, label, type, to }) => {
              const isActive = active === key;
              if (type === 'route' && to) {
                return (
                  <li key={key}>
                    <Link
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        linkClass(key, isActive, true),
                        isActive && 'bg-[var(--surface-overlay)] ring-1 ring-[var(--border)]'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={key}>
                  <button
                    onClick={() => handleSectionClick(key as (typeof NAV_SECTIONS)[number])}
                    className={cn(
                      linkClass(key, isActive, true),
                      isActive && 'bg-[var(--surface-overlay)] ring-1 ring-[var(--border)]'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
