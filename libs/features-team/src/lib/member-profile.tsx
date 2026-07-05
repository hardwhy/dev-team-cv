import { useEffect, useRef, useState } from 'react';
import { Avatar, Badge, SubsectionLabel, SocialIcon } from '@dev-team-cv/ui';
import { cn, formatDate } from '@dev-team-cv/shared-utils';
import { isExternalContactUrl, normalizeContactUrl } from '@dev-team-cv/supabase';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';

interface MemberProfileProps {
  member: TeamMember | null;
  projects: Project[];
  open: boolean;
  onClose: () => void;
  onProjectClick?: (project: Project) => void;
}

const ANIM_MS = 320;

export function MemberProfile({ member, projects, open, onClose, onProjectClick }: MemberProfileProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [render, setRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const [clip, setClip] = useState(true);
  const [current, setCurrent] = useState<TeamMember | null>(member);

  useEffect(() => {
    if (member) setCurrent(member);
  }, [member]);

  useEffect(() => {
    if (open) {
      setRender(true);
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    setClip(true);
    const t = setTimeout(() => setRender(false), ANIM_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => { clearTimeout(t); window.removeEventListener('keydown', handler); };
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  }, [open, member]);

  const activeMember = member ?? current;
  const memberProjects = activeMember
    ? projects.filter((p) => p.team_members?.some((m) => m.id === activeMember.id))
    : [];

  if (!render || !activeMember) return null;
  const memberData = activeMember;

  return (
    <div ref={panelRef} aria-live="polite" className="mx-auto max-w-4xl px-6 overflow-visible">
      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        style={{
          gridTemplateRows: visible ? '1fr' : '0fr',
          opacity: visible ? 1 : 0,
        }}
        onTransitionEnd={(e) => {
          if (e.propertyName === 'grid-template-rows' && visible) setClip(false);
        }}
      >
        <div className={cn('min-h-0', clip ? 'overflow-hidden' : 'overflow-visible')}>
          <div className="card-row-padding">
            <div
              className={cn(
                'glass-panel rounded-2xl transition-transform duration-300 ease-out will-change-transform',
                visible ? 'translate-y-0 scale-100' : '-translate-y-1 scale-[0.98]'
              )}
              style={{
                borderTopWidth: 2,
                borderTopColor: memberData.favorite_color,
                boxShadow: `0 12px 48px color-mix(in srgb, ${memberData.favorite_color} 14%, transparent), 0 4px 24px color-mix(in srgb, #000000 8%, transparent)`,
              }}
            >
              <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex items-center gap-5 min-w-0">
              <div
                className="rounded-full p-1 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${memberData.favorite_color}99, ${memberData.favorite_color}22)`,
                }}
              >
                <Avatar
                  src={memberData.profile_picture}
                  name={memberData.full_name}
                  color={memberData.favorite_color}
                  bgColor={memberData.avatar_background_color}
                  size="xl"
                  className="ring-2 ring-[var(--surface)]"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-[var(--text-primary)] truncate">
                  {memberData.full_name}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                  {memberData.years_of_experience} yr{memberData.years_of_experience !== 1 ? 's' : ''} experience
                </p>
                <div className="chip-row mt-2">
                  {memberData.role.map((r) => (
                    <Badge key={r} label={r} color={memberData.favorite_color} />
                  ))}
                </div>
              </div>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close profile"
              className="rounded-lg p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <SubsectionLabel className="mb-3">About</SubsectionLabel>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {memberData.long_bio || memberData.short_bio}
              </p>

              {memberData.social_links?.some((link) => link.iconUrl.trim()) && (
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {memberData.social_links.map((link, index) => {
                    const href = normalizeContactUrl(link.url);
                    if (!href || !link.iconUrl.trim()) return null;
                    const external = isExternalContactUrl(href);

                    return (
                      <a
                        key={`${link.slug}-${index}`}
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        aria-label={link.label || link.slug}
                        title={link.label || link.slug}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <SocialIcon iconUrl={link.iconUrl} label={link.label || link.slug} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <SubsectionLabel className="mb-3">Skills</SubsectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {memberData.skills.map((skill) => (
                  <Badge key={skill} label={skill} color={memberData.favorite_color} />
                ))}
              </div>
            </div>

            <div>
              <SubsectionLabel className="mb-3">Projects</SubsectionLabel>
              {memberProjects.length > 0 ? (
                <ul className="space-y-2">
                  {memberProjects.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onProjectClick?.(p)}
                        disabled={!onProjectClick}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-left',
                          'bg-[color-mix(in_srgb,var(--surface-overlay)_40%,transparent)] transition-colors',
                          onProjectClick && 'cursor-pointer hover:bg-[var(--surface-overlay)] hover:border-[color-mix(in_srgb,var(--border)_80%,var(--text-muted))]'
                        )}
                      >
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="h-9 w-9 rounded-lg object-cover shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-lg bg-[var(--surface-overlay)] shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                            {p.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {formatDate(p.start_date)} – {formatDate(p.end_date)}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">No projects yet.</p>
              )}
              </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
