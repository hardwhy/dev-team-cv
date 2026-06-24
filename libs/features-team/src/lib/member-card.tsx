import { Avatar, Badge } from '@dev-team-cv/ui';
import { cn } from '@dev-team-cv/shared-utils';
import type { TeamMember } from '@dev-team-cv/shared-types';

interface MemberCardProps {
  member: TeamMember;
  onClick: (member: TeamMember) => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  const primaryRole = member.role[0] ?? 'Engineer';
  const topSkills = member.skills.slice(0, 3);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View ${member.full_name}'s profile`}
      onClick={() => onClick(member)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(member)}
      className={cn(
        // Fixed width, full height of the flex row so all cards stretch equally
        'group relative w-72 h-full shrink-0 rounded-2xl border border-[var(--border)]',
        'bg-[var(--surface-raised)] p-6 cursor-pointer select-none',
        'flex flex-col',
        'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
        'focus-visible:ring-2 focus-visible:ring-offset-2 outline-none'
      )}
      style={{ '--member-color': member.favorite_color } as React.CSSProperties}
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full opacity-60"
        style={{ backgroundColor: member.favorite_color }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-4">
        <Avatar
          src={member.profile_picture}
          name={member.full_name}
          color={member.favorite_color}
          bgColor={member.avatar_background_color}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] truncate">{member.full_name}</h3>
          <p className="text-sm text-[var(--text-secondary)] truncate mt-0.5">{primaryRole}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {member.years_of_experience} yr{member.years_of_experience !== 1 ? 's' : ''} experience
          </p>
        </div>
      </div>

      {/* Skills — push to fill space so "View profile" is always at the bottom */}
      <div className="mt-4 flex flex-wrap gap-1.5 flex-1">
        {topSkills.map((skill) => (
          <Badge key={skill} label={skill} color={member.favorite_color} />
        ))}
        {member.skills.length > 3 && (
          <span className="text-xs text-[var(--text-muted)] self-center">
            +{member.skills.length - 3} more
          </span>
        )}
      </div>

      <div
        className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: member.favorite_color }}
      >
        View profile
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M2.5 6h7M6 2.5L9.5 6 6 9.5" />
        </svg>
      </div>
    </article>
  );
}
