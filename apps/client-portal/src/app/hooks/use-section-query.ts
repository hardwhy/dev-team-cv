import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export const SECTION_QUERY_KEY = 'section';

export function useSectionQuery(validSections: readonly string[]) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const onHome = location.pathname === '/';
  const section = onHome ? searchParams.get(SECTION_QUERY_KEY) ?? '' : '';
  const didInitialScroll = useRef(false);

  const goToSection = useCallback(
    (id: string) => {
      if (!validSections.includes(id)) return;

      if (!onHome) {
        navigate(id === 'hero' ? '/' : { pathname: '/', search: `?${SECTION_QUERY_KEY}=${id}` });
        return;
      }

      setSearchParams(id === 'hero' ? {} : { [SECTION_QUERY_KEY]: id }, { replace: true });
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    },
    [navigate, onHome, setSearchParams, validSections]
  );

  // Reflect the current scroll position into ?section= without triggering a scroll.
  const setActiveSection = useCallback(
    (id: string) => {
      if (!onHome) return;
      const next = id === 'hero' ? '' : id;
      if (next === (searchParams.get(SECTION_QUERY_KEY) ?? '')) return;
      setSearchParams(next ? { [SECTION_QUERY_KEY]: next } : {}, { replace: true });
    },
    [onHome, searchParams, setSearchParams]
  );

  // Only scroll on first load (e.g. opening /?section=team directly).
  useEffect(() => {
    if (!onHome || didInitialScroll.current) return;
    didInitialScroll.current = true;
    const id = searchParams.get(SECTION_QUERY_KEY);
    if (!id || !validSections.includes(id)) return;

    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [onHome, searchParams, validSections]);

  return { onHome, section, goToSection, setActiveSection };
}
