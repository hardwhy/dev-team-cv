import { useState } from 'react';
import { useDragScroll } from '@dev-team-cv/shared-hooks';
import { SectionWrapper } from '@dev-team-cv/ui';
import { MemberCard } from './member-card';
import { MemberProfile } from './member-profile';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';

interface TeamSectionProps {
  members: TeamMember[];
  projects: Project[];
}

export function TeamSection({ members, projects }: TeamSectionProps) {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove } = useDragScroll<HTMLDivElement>();

  return (
    <SectionWrapper id="team" className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-widest mb-3">The Team</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">Meet the engineers</h2>
          <p className="mt-3 text-lg text-[var(--text-secondary)] max-w-xl">
            A small, focused team building software that matters.
          </p>
        </div>

        <div
          ref={ref}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          role="list"
          aria-label="Team members"
          className="scroll-container flex items-stretch gap-5 pb-4 px-6 -mx-6"
          style={{ scrollPaddingLeft: '1.5rem' }}
        >
          {members.map((m) => (
            <div key={m.id} role="listitem" className="flex">
              <MemberCard member={m} onClick={setSelected} />
            </div>
          ))}
          {/* Right padding spacer so last card isn't flush against the edge */}
          <div className="w-6 shrink-0" aria-hidden="true" />
        </div>

        {members.length === 0 && (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-[var(--text-muted)]">
            Team members coming soon
          </div>
        )}
      </div>

      <MemberProfile
        member={selected}
        projects={projects}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </SectionWrapper>
  );
}
