import { Badge, Avatar } from '@dev-team-cv/ui';
import { cn, truncate } from '@dev-team-cv/shared-utils';
import type { Project } from '@dev-team-cv/shared-types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} project details`}
      onClick={() => onClick(project)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(project)}
      className={cn(
        'group w-80 shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]',
        'overflow-hidden cursor-pointer transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 outline-none'
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[var(--surface-overlay)]">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
        {project.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-[var(--text-primary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--surface)]">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">{project.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
          {truncate(project.description, 90)}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((t) => (
            <Badge key={t} label={t} />
          ))}
          {project.technologies.length > 4 && (
            <span className="text-xs text-[var(--text-muted)] self-center">+{project.technologies.length - 4}</span>
          )}
        </div>

        {/* Team avatars */}
        {project.team_members && project.team_members.length > 0 && (
          <div className="flex items-center gap-2">
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
              <span className="text-xs text-[var(--text-muted)]">+{project.team_members.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
