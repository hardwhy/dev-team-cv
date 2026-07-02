import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export const SECTION_QUERY_KEY = 'section';

export function useSectionQuery(validSections: readonly string[]) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const onHome = location.pathname === '/';
  const section = onHome ? searchParams.get(SECTION_QUERY_KEY) ?? '' : '';
  const scrollingRef = useRef(false);

  const goToSection = useCallback(
    (id: string, { replace = false }: { replace?: boolean } = {}) => {
      if (!validSections.includes(id)) return;

      if (!onHome) {
        navigate({ pathname: '/', search: `?${SECTION_QUERY_KEY}=${id}` });
        return;
      }

      scrollingRef.current = true;
      setSearchParams({ [SECTION_QUERY_KEY]: id }, { replace });
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => {
        scrollingRef.current = false;
      }, 800);
    },
    [navigate, onHome, setSearchParams, validSections]
  );

  const syncSectionFromScroll = useCallback(
    (id: string) => {
      if (!onHome || scrollingRef.current) return;
      if (id === section) return;
      setSearchParams({ [SECTION_QUERY_KEY]: id }, { replace: true });
    },
    [onHome, section, setSearchParams]
  );

  useEffect(() => {
    if (!onHome || scrollingRef.current) return;
    const id = searchParams.get(SECTION_QUERY_KEY);
    if (!id || !validSections.includes(id)) return;

    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [onHome, searchParams, validSections]);

  return { onHome, section, goToSection, syncSectionFromScroll };
}
