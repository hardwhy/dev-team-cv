import { useState } from 'react';
import { Modal, Badge, Avatar, SubsectionLabel } from '@dev-team-cv/ui';
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
    <Modal open={open} onClose={onClose} title={project.title} size="lg">
      {/* Compact meta strip */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-4 mb-4 border-b border-[var(--border)] text-sm">
        <span className="text-[var(--text-secondary)]">
          {formatDate(project.start_date)} – {formatDate(project.end_date)}
        </span>
        <Badge label={project.project_type} />
        {project.project_url && (
          <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Live Demo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15,3 21,3 21,9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            GitHub
          </a>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-5">
        {/* Left: image + description */}
        <div className="md:col-span-3 space-y-4">
          {allImages.length > 0 && (
            <div className="relative h-48 overflow-hidden rounded-xl bg-[var(--surface-overlay)]">
              <img
                src={allImages[galleryIndex]}
                alt={`${project.title} screenshot ${galleryIndex + 1}`}
                className="h-full w-full object-contain p-3 bg-white"
                loading="lazy"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryIndex((i) => Math.max(0, i - 1))}
                    disabled={galleryIndex === 0}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 2L4 7l5 5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setGalleryIndex((i) => Math.min(allImages.length - 1, i + 1))}
                    disabled={galleryIndex === allImages.length - 1}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 2l5 5-5 5" />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        aria-label={`View image ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${i === galleryIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div>
            <SubsectionLabel>About</SubsectionLabel>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.description}</p>
          </div>

          <div>
            <SubsectionLabel>Tech Stack</SubsectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((t) => <Badge key={t} label={t} />)}
            </div>
          </div>
        </div>

        {/* Right: team */}
        {project.team_members && project.team_members.length > 0 && (
          <div className="md:col-span-2">
            <SubsectionLabel>Team</SubsectionLabel>
            <ul className="space-y-2">
              {project.team_members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] px-3 py-2 bg-[var(--surface-raised)]"
                >
                  <Avatar
                    src={m.profile_picture}
                    name={m.full_name}
                    color={m.favorite_color}
                    bgColor={m.avatar_background_color}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{m.full_name}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{m.role[0]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
