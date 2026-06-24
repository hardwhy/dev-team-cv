import { useState } from 'react';
import { useDragScroll } from '@dev-team-cv/shared-hooks';
import { SectionWrapper, Skeleton } from '@dev-team-cv/ui';
import { ProjectCard } from './project-card';
import { ProjectModal } from './project-modal';
import type { Project } from '@dev-team-cv/shared-types';

interface ProjectsSectionProps {
  projects: Project[];
  loading?: boolean;
  featuredOnly?: boolean;
  title?: string;
  subtitle?: string;
  sectionId?: string;
}

export function ProjectsSection({
  projects,
  loading,
  featuredOnly = false,
  title = 'Projects',
  subtitle = 'A selection of what we have built.',
  sectionId = 'projects',
}: ProjectsSectionProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove } = useDragScroll<HTMLDivElement>();

  const displayed = featuredOnly ? projects.filter((p) => p.featured) : projects;

  return (
    <SectionWrapper id={sectionId} className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-widest mb-3">
            {featuredOnly ? 'Featured Work' : 'All Work'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{title}</h2>
          <p className="mt-3 text-lg text-[var(--text-secondary)] max-w-xl">{subtitle}</p>
        </div>

        {loading ? (
          <div className="flex gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-80 shrink-0 rounded-2xl overflow-hidden border border-[var(--border)]">
                <Skeleton className="aspect-video w-full" rounded={false} />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length > 0 ? (
          <div
            ref={ref}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            role="list"
            aria-label={`${title} list`}
            className="scroll-container flex gap-5 pb-4"
          >
            {displayed.map((p) => (
              <div key={p.id} role="listitem">
                <ProjectCard project={p} onClick={setSelected} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-[var(--text-muted)]">
            Projects coming soon
          </div>
        )}
      </div>

      <ProjectModal
        project={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </SectionWrapper>
  );
}
