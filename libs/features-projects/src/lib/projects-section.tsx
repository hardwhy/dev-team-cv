import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDragScroll } from '@dev-team-cv/shared-hooks';
import { cn } from '@dev-team-cv/shared-utils';
import { SectionWrapper, Skeleton, SectionHeader } from '@dev-team-cv/ui';
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
  showAllLink?: boolean;
  allProjectsHref?: string;
  layout?: 'scroll' | 'grid';
}

export function ProjectsSection({
  projects,
  loading,
  featuredOnly = false,
  title = 'Projects',
  subtitle = 'A selection of what we have built.',
  sectionId = 'projects',
  showAllLink = false,
  allProjectsHref = '/projects',
  layout = 'scroll',
}: ProjectsSectionProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove } = useDragScroll<HTMLDivElement>();

  const displayed = featuredOnly ? projects.filter((p) => p.featured) : projects;

  const cardList = displayed.map((p) => (
    <div
      key={p.id}
      role="listitem"
      className={cn('card-shadow-room', layout === 'grid' && 'w-full min-w-0')}
    >
      <ProjectCard project={p} onClick={setSelected} layout={layout} />
    </div>
  ));

  return (
    <SectionWrapper id={sectionId} className="py-24 border-t border-[var(--border)] overflow-visible">
      <div className="mx-auto max-w-7xl px-6 overflow-visible">
        <SectionHeader
          label={featuredOnly ? 'Featured Work' : 'All Work'}
          title={title}
          subtitle={subtitle}
        />

        {loading ? (
          <div className="flex justify-center gap-5 card-row-padding">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-80 h-[420px] shrink-0 rounded-2xl border border-[var(--border)]">
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
          layout === 'grid' ? (
            <div
              role="list"
              aria-label={`${title} list`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 card-row-padding"
            >
              {cardList}
            </div>
          ) : (
            <div className="card-row-padding overflow-visible">
              <div
                ref={ref}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                role="list"
                aria-label={`${title} list`}
                className="scroll-container"
              >
                <div className="flex gap-5 w-max mx-auto px-2">
                  {cardList}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-[var(--text-muted)]">
            Projects coming soon
          </div>
        )}

        {showAllLink && displayed.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              to={allProjectsHref}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
            >
              View all projects
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </Link>
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
