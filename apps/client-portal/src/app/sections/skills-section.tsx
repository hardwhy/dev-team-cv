import { SectionWrapper, Badge, SectionHeader } from '@dev-team-cv/ui';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';

interface SkillsSectionProps {
  members: TeamMember[];
  projects?: Project[];
}

export function SkillsSection({ members, projects = [] }: SkillsSectionProps) {
  const skillMap = new Map<string, { skill: string; color: string; count: number }>();

  members.forEach((m) => {
    m.skills.forEach((s) => {
      const existing = skillMap.get(s);
      if (!existing) {
        skillMap.set(s, { skill: s, color: m.favorite_color, count: 1 });
      } else {
        existing.count++;
      }
    });
  });

  projects.forEach((p) => {
    p.technologies.forEach((t) => {
      const existing = skillMap.get(t);
      if (!existing) {
        skillMap.set(t, { skill: t, color: 'var(--text-muted)', count: 1 });
      } else {
        existing.count++;
      }
    });
  });

  const skills = [...skillMap.values()].sort((a, b) => b.count - a.count);

  return (
    <SectionWrapper id="skills" className="py-24 border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          label="Capabilities"
          title="Skills & Technologies"
          subtitle="The tools we reach for to get things done well."
        />

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
