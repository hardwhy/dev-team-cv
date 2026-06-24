import { useState } from 'react';
import { Modal, Badge, Avatar } from '@dev-team-cv/ui';
import { formatDate } from '@dev-team-cv/shared-utils';
import type { Project } from '@dev-team-cv/shared-types';

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, open, onClose }: ProjectModalProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  if (!project) return null;

  const allImages = [
    ...(project.thumbnail ? [project.thumbnail] : []),
    ...project.gallery_images,
  ];

  return (
    <Modal open={open} onClose={onClose} title={project.title} size="xl">
      <div className="space-y-6">
        {/* Gallery */}
        {allImages.length > 0 && (
          <div>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--surface-overlay)]">
              <img
                src={allImages[galleryIndex]}
                alt={`${project.title} screenshot ${galleryIndex + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryIndex((i) => Math.max(0, i - 1))}
                    disabled={galleryIndex === 0}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 2L4 7l5 5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setGalleryIndex((i) => Math.min(allImages.length - 1, i + 1))}
                    disabled={galleryIndex === allImages.length - 1}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 2l5 5-5 5" />
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        aria-label={`View image ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${i === galleryIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">About</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.description}</p>
            </div>

            {/* Tech stack */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => <Badge key={t} label={t} />)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Timeline</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {formatDate(project.start_date)} – {formatDate(project.end_date)}
              </p>
            </div>

            {/* Type */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Type</h3>
              <Badge label={project.project_type} />
            </div>

            {/* Team */}
            {project.team_members && project.team_members.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Team</h3>
                <div className="space-y-2">
                  {project.team_members.map((m) => (
                    <div key={m.id} className="flex items-center gap-2">
                      <Avatar src={m.profile_picture} name={m.full_name} color={m.favorite_color} bgColor={m.avatar_background_color} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{m.full_name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{m.role[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-col gap-2">
              {project.project_url && (
                <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
