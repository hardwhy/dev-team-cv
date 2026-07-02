import { useState } from 'react';
import { SectionWrapper, SectionHeader } from '@dev-team-cv/ui';
import { MemberCard } from './member-card';
import { MemberProfile } from './member-profile';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';

interface TeamSectionProps {
  members: TeamMember[];
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

export function TeamSection({ members, projects, onProjectClick }: TeamSectionProps) {
  const [selected, setSelected] = useState<TeamMember | null>(null);

  const handleSelect = (member: TeamMember) => {
    setSelected((prev) => (prev?.id === member.id ? null : member));
  };

  return (
    <SectionWrapper id="team" className="py-24 border-t border-[var(--border)] overflow-visible">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          label="The Team"
          title="Meet the engineers"
          subtitle="A small, focused team building software that matters."
        />

        {members.length > 0 ? (
          <div
            role="list"
            aria-label="Team members"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto card-row-padding"
          >
            {members.map((m) => (
              <div key={m.id} role="listitem" className="card-shadow-room w-full">
                <MemberCard
                  member={m}
                  onClick={handleSelect}
                  selected={selected?.id === m.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] text-[var(--text-muted)] glass-card max-w-4xl mx-auto">
            Team members coming soon
          </div>
        )}
      </div>

      <MemberProfile
        member={selected}
        projects={projects}
        open={!!selected}
        onClose={() => setSelected(null)}
        onProjectClick={onProjectClick}
      />
    </SectionWrapper>
  );
}
