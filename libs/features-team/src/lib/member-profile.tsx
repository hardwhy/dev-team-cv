import { useEffect, useRef } from 'react';
import { Avatar, Badge } from '@dev-team-cv/ui';
import { formatDate } from '@dev-team-cv/shared-utils';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';

interface MemberProfileProps {
  member: TeamMember | null;
  projects: Project[];
  open: boolean;
  onClose: () => void;
}

/**
 * Below-carousel reveal panel.
 * Slides open under the team scroll row — no overlay, no scroll lock.
 * The page simply grows to accommodate the detail.
 */
export function MemberProfile({ member, projects, open, onClose }: MemberProfileProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => { clearTimeout(t); window.removeEventListener('keydown', handler); };
  }, [open, onClose]);

  // Scroll the panel into view when it opens
  useEffect(() => {
    if (open && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  }, [open, member]);

  const memberProjects = member
    ? projects.filter((p) => p.team_members?.some((m) => m.id === member.id))
    : [];

  return (
    <div
      ref={panelRef}
      aria-live="polite"
      style={{
        maxHeight: open ? '600px' : '0px',
        opacity: open ? 1 : 0,
        transition: open
          ? 'max-height 380ms cubic-bezier(0.22,1,0.36,1), opacity 220ms ease'
          : 'max-height 260ms cubic-bezier(0.4,0,1,1), opacity 150ms ease',
        overflow: 'hidden',
      }}
    >
      {member && (
        <div
          className="mx-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden"
          style={{ borderTopColor: member.favorite_color, borderTopWidth: 3 }}
        >
          <div className="p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Avatar
                  src={member.profile_picture}
                  name={member.full_name}
                  color={member.favorite_color}
                  bgColor={member.avatar_background_color}
                  size="xl"
                />
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{member.full_name}</h2>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    {member.years_of_experience} yr{member.years_of_experience !== 1 ? 's' : ''} experience
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {member.role.map((r) => (
                      <Badge key={r} label={r} color={member.favorite_color} />
                    ))}
                  </div>
                </div>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close profile"
                className="rounded-md p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M2 2l12 12M14 2L2 14" />
                </svg>
              </button>
            </div>

            {/* Body — 3 column grid on wider screens */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* About */}
              <div className="md:col-span-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">About</p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {member.long_bio || member.short_bio}
                </p>

                {/* Social links */}
                {(member.linkedin_url || member.github_url || member.email) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {member.github_url && (
                      <a href={member.github_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C7.368 10.27 6.58 9.9 6.58 9.9c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                        Email
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="md:col-span-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <Badge key={skill} label={skill} color={member.favorite_color} />
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="md:col-span-1">
                {memberProjects.length > 0 ? (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">Projects</p>
                    <ul className="space-y-2">
                      {memberProjects.map((p) => (
                        <li key={p.id} className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3">
                          {p.thumbnail && (
                            <img src={p.thumbnail} alt={p.title} className="h-9 w-9 rounded object-cover shrink-0" loading="lazy" />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-[var(--text-primary)] truncate">{p.title}</p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {formatDate(p.start_date)} – {formatDate(p.end_date)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="text-sm text-[var(--text-muted)]">No projects yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
