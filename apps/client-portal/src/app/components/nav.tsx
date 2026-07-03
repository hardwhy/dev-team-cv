import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@dev-team-cv/shared-utils';
import { useScrollSpy } from '@dev-team-cv/shared-hooks';
import { ThemeToggle, BrandLogo } from '@dev-team-cv/ui';
import { useBranding } from '@dev-team-cv/supabase';
import { useSectionQuery } from '../hooks/use-section-query';

// 'constellation' is intentionally omitted here to hide it from the nav/scroll-spy
// while keeping the section code and label mapping in place for future use.
const HOME_SECTIONS = ['hero', 'about', 'team', 'projects', 'skills', 'contact'] as const;
const NAV_ITEMS = HOME_SECTIONS.filter((s) => s !== 'hero');
const LABELS: Record<string, string> = {
  hero: 'Home',
  about: 'About',
  team: 'Team',
  projects: 'Projects',
  skills: 'Skills',
  constellation: 'Network',
  contact: 'Contact',
};

export function Nav() {
  const navigate = useNavigate();
  const branding = useBranding();
  const { onHome, goToSection, setActiveSection } = useSectionQuery(HOME_SECTIONS);
  const scrollActive = useScrollSpy([...HOME_SECTIONS]);
  const [pending, setPending] = useState<string | null>(null);

  const active = onHome ? pending ?? scrollActive : '';

  // Keep ?section= in sync with the section the user has scrolled to.
  useEffect(() => {
    if (!onHome || pending) return;
    setActiveSection(scrollActive);
  }, [onHome, pending, scrollActive, setActiveSection]);

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
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
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

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setPending(id);
    goToSection(id);
  };

  const goHome = () => {
    setMenuOpen(false);
    if (onHome) {
      setPending('hero');
      goToSection('hero');
    } else {
      navigate('/');
    }
  };

  const linkClass = (isActive: boolean, fullWidth = false) =>
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
          className="font-semibold text-[var(--text-primary)] text-sm"
          aria-label="Go to top"
        >
          <BrandLogo primary={branding.primary} secondary={branding.secondary} />
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
          {NAV_ITEMS.map((id) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  ref={(el) => {
                    if (el) btnRefs.current.set(id, el);
                    else btnRefs.current.delete(id);
                  }}
                  onClick={() => scrollTo(id)}
                  className={linkClass(isActive)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {LABELS[id]}
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
            {NAV_ITEMS.map((id) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className={cn(
                      linkClass(isActive, true),
                      isActive && 'bg-[var(--surface-overlay)] ring-1 ring-[var(--border)]'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {LABELS[id]}
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
