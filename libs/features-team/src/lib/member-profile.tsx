import { Avatar, Badge, Drawer } from '@dev-team-cv/ui';
import { formatDate } from '@dev-team-cv/shared-utils';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';

interface MemberProfileProps {
  member: TeamMember | null;
  projects: Project[];
  open: boolean;
  onClose: () => void;
}

export function MemberProfile({ member, projects, open, onClose }: MemberProfileProps) {
  if (!member) return null;

  const memberProjects = projects.filter((p) =>
    p.team_members?.some((m) => m.id === member.id)
  );

  return (
    <Drawer open={open} onClose={onClose} title={member.full_name}>
      <div className="space-y-6">
        {/* Header */}
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
            <div className="mt-1 flex flex-wrap gap-1">
              {member.role.map((r) => (
                <Badge key={r} label={r} color={member.favorite_color} />
              ))}
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {member.years_of_experience} years of experience
            </p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">About</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{member.long_bio || member.short_bio}</p>
        </div>

        {/* Skills */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <Badge key={skill} label={skill} color={member.favorite_color} />
            ))}
          </div>
        </div>

        {/* Projects */}
        {memberProjects.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Projects</h3>
            <ul className="space-y-2">
              {memberProjects.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3">
                  {p.thumbnail && (
                    <img src={p.thumbnail} alt={p.title} className="h-10 w-10 rounded object-cover shrink-0" loading="lazy" />
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
          </div>
        )}

        {/* Social links */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Links</h3>
          <div className="flex flex-wrap gap-2">
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
              >
                LinkedIn
              </a>
            )}
            {member.github_url && (
              <a
                href={member.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
              >
                GitHub
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
              >
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
