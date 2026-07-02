import { Badge, Avatar } from '@dev-team-cv/ui';
import { cn } from '@dev-team-cv/shared-utils';
import type { Project } from '@dev-team-cv/shared-types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  layout?: 'scroll' | 'grid';
}

const VISIBLE_TECH = 3;

export function ProjectCard({ project, onClick, layout = 'scroll' }: ProjectCardProps) {
  const visibleTech = project.technologies.slice(0, VISIBLE_TECH);
  const hiddenTechCount = project.technologies.length - VISIBLE_TECH;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} project details`}
      onClick={() => onClick(project)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(project)}
      className={cn(
        'glass-card glass-card-interactive group rounded-2xl cursor-pointer flex flex-col focus-visible:ring-2 outline-none',
        layout === 'grid'
          ? 'w-full h-full min-h-[420px]'
          : 'w-80 h-[420px] shrink-0'
      )}
    >
      <div className="card-thumb relative aspect-video shrink-0 bg-[var(--surface-overlay)] rounded-t-2xl">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-full w-full object-cover rounded-t-2xl transition-[filter] duration-300 group-hover:brightness-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        {project.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-[var(--text-primary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--surface)]">
            Featured
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 min-h-0 rounded-b-2xl bg-[color-mix(in_srgb,var(--surface-raised)_55%,transparent)]">
        <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1 shrink-0">
          {project.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-1 line-clamp-2 shrink-0">
          {project.description}
        </p>

        <div className="chip-row mt-auto pt-3">
          {visibleTech.map((t) => (
            <Badge key={t} label={t} />
          ))}
          {hiddenTechCount > 0 && (
            <span className="chip-more">+{hiddenTechCount} more</span>
          )}
        </div>

        {project.team_members && project.team_members.length > 0 && (
          <div className="flex items-center gap-2 mt-3 shrink-0">
            <div className="flex -space-x-2">
              {project.team_members.slice(0, 3).map((m) => (
                <Avatar
                  key={m.id}
                  src={m.profile_picture}
                  name={m.full_name}
                  color={m.favorite_color}
                  bgColor={m.avatar_background_color}
                  size="sm"
                  className="ring-2 ring-[var(--surface-raised)]"
                />
              ))}
            </div>
            {project.team_members.length > 3 && (
              <span className="text-xs text-[var(--text-muted)]">
                +{project.team_members.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
