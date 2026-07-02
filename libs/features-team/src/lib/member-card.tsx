import { Avatar, Badge } from '@dev-team-cv/ui';
import { cn } from '@dev-team-cv/shared-utils';
import type { TeamMember } from '@dev-team-cv/shared-types';

interface MemberCardProps {
  member: TeamMember;
  onClick: (member: TeamMember) => void;
  selected?: boolean;
}

const VISIBLE_SKILLS = 2;

export function MemberCard({ member, onClick, selected }: MemberCardProps) {
  const primaryRole = member.role[0] ?? 'Engineer';
  const visibleSkills = member.skills.slice(0, VISIBLE_SKILLS);
  const hiddenCount = member.skills.length - VISIBLE_SKILLS;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View ${member.full_name}'s profile`}
      aria-pressed={selected}
      onClick={() => onClick(member)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(member)}
      className={cn(
        'glass-card glass-card-interactive relative w-full h-[272px] shrink-0 rounded-2xl p-6',
        'cursor-pointer select-none flex flex-col items-center text-center',
        'focus-visible:ring-2 focus-visible:ring-offset-2 outline-none',
        selected && 'ring-2 ring-[var(--accent-color)] ring-offset-2 ring-offset-[var(--surface)]'
      )}
      style={{ '--accent-color': member.favorite_color } as React.CSSProperties}
    >
      {/* Avatar with color ring */}
      <div
        className="relative mb-4 rounded-full p-0.5"
        style={{
          background: `linear-gradient(135deg, ${member.favorite_color}88, ${member.favorite_color}22)`,
        }}
      >
        <Avatar
          src={member.profile_picture}
          name={member.full_name}
          color={member.favorite_color}
          bgColor={member.avatar_background_color}
          size="lg"
          className="ring-2 ring-[var(--surface)]"
        />
      </div>

      <h3 className="font-semibold text-[var(--text-primary)] truncate max-w-full px-1">
        {member.full_name}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] truncate max-w-full px-1 mt-0.5">
        {primaryRole}
      </p>
      <p className="text-xs text-[var(--text-muted)] mt-1">
        {member.years_of_experience} yr{member.years_of_experience !== 1 ? 's' : ''} experience
      </p>

      {/* Skills — fit within card, never clip */}
      <div className="chip-row mt-auto pt-4">
        {visibleSkills.map((skill) => (
          <Badge key={skill} label={skill} color={member.favorite_color} />
        ))}
        {hiddenCount > 0 && (
          <span className="chip-more">+{hiddenCount} more</span>
        )}
      </div>
    </article>
  );
}
