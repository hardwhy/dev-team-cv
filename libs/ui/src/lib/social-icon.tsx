import { useEffect, useState } from 'react';
import { cn } from '@dev-team-cv/shared-utils';

interface SocialIconProps {
  iconUrl: string;
  label: string;
  className?: string;
}

/** Renders a mask-based social icon. Returns null when no icon URL is available. */
export function SocialIcon({ iconUrl, label, className }: SocialIconProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!iconUrl) return;
    setFailed(false);
    const img = new Image();
    img.onerror = () => setFailed(true);
    img.src = iconUrl;
  }, [iconUrl]);

  if (!iconUrl || failed) return null;

  return (
    <span
      role="img"
      aria-label={label}
      className={cn('block h-5 w-5 bg-current', className)}
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
