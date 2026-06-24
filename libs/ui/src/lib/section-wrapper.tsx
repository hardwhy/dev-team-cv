import { useRef, useEffect, useState } from 'react';
import { cn } from '@dev-team-cv/shared-utils';

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div';
}

export function SectionWrapper({ id, children, className, as: Tag = 'section', ...props }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      className={cn(
        'transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
