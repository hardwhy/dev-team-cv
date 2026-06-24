import { SectionWrapper, Badge } from '@dev-team-cv/ui';
import type { TeamMember } from '@dev-team-cv/shared-types';

interface SkillsSectionProps {
  members: TeamMember[];
}

export function SkillsSection({ members }: SkillsSectionProps) {
  // Aggregate all skills with member color info
  const skillMap = new Map<string, { skill: string; color: string; count: number }>();
  members.forEach((m) => {
    m.skills.forEach((s) => {
      if (!skillMap.has(s)) {
        skillMap.set(s, { skill: s, color: m.favorite_color, count: 1 });
      } else {
        skillMap.get(s)!.count++;
      }
    });
  });
  const skills = [...skillMap.values()].sort((a, b) => b.count - a.count);

  return (
    <SectionWrapper id="skills" className="py-24 border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-widest mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">Skills &amp; Technologies</h2>
          <p className="mt-3 text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            The tools we reach for to get things done well.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((s) => (
            <Badge
              key={s.skill}
              label={s.skill}
              color={s.color}
              interactive
              className="text-sm py-1.5 px-4 cursor-default"
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
