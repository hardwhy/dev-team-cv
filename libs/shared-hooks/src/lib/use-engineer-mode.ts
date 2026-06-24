import { useEffect, useState } from 'react';

export function useEngineerMode(): boolean {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'E') setActive((v) => !v);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return active;
}
