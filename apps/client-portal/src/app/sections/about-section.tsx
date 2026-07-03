import { useEffect, useMemo, useState } from 'react';
import { cn } from '@dev-team-cv/shared-utils';
import { DEFAULT_ABOUT_VALUES, type AboutValue, type Project, type TeamMember } from '@dev-team-cv/shared-types';
import { ABOUT_VALUES_KEY, computeAboutStats, parseAboutValues, settingsApi } from '@dev-team-cv/supabase';
import { SectionWrapper, SectionHeader } from '@dev-team-cv/ui';

const VALUE_GRID_CLASS: Record<number, string> = {
  1: 'grid-cols-1 max-w-sm mx-auto',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
};

interface AboutSectionProps {
  members: TeamMember[];
  projects: Project[];
}

function ValueCard({
  value,
  selected,
  onSelect,
}: {
  value: AboutValue;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'rounded-xl border bg-[var(--surface-raised)] p-4 text-left transition-all duration-200',
        'hover:border-blue-500/40 hover:shadow-sm hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
        selected
          ? 'border-blue-500/60 shadow-md ring-2 ring-blue-500/20'
          : 'border-[var(--border)]'
      )}
    >
      <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">{value.title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{value.desc}</p>
    </button>
  );
}

export function AboutSection({ members, projects }: AboutSectionProps) {
  const [values, setValues] = useState<AboutValue[]>(DEFAULT_ABOUT_VALUES);
  const [selectedValueIndex, setSelectedValueIndex] = useState<number | null>(null);

  const stats = useMemo(() => computeAboutStats(members, projects), [members, projects]);

  useEffect(() => {
    settingsApi
      .getAll()
      .then((settings) => setValues(parseAboutValues(settings[ABOUT_VALUES_KEY])))
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  const gridClass = VALUE_GRID_CLASS[values.length] ?? VALUE_GRID_CLASS[4];

  return (
    <SectionWrapper id="about" className="py-24 border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          label="About Us"
          title="A team that builds software the right way."
          subtitle="We are a compact, experienced engineering team specialising in cross-platform mobile apps, modern web applications, and robust backend systems."
        />

        <p className="text-[var(--text-secondary)] leading-relaxed text-center max-w-3xl mx-auto -mt-6 mb-12">
          Every project we take on gets the full weight of our attention. We do not scale by hiring dozens of people — we scale by being really, really good at what we do.
        </p>

        <div className={cn('grid gap-4 mb-12', gridClass)}>
          {values.map((value, index) => (
            <ValueCard
              key={`${value.title}-${index}`}
              value={value}
              selected={selectedValueIndex === index}
              onSelect={() => setSelectedValueIndex((current) => (current === index ? null : index))}
            />
          ))}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 max-w-xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                <div className="text-sm text-[var(--text-muted)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
