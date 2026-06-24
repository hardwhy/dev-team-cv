import { TeamConstellation } from '@dev-team-cv/features-team';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';

interface Props { members: TeamMember[]; projects: Project[]; }

export function ConstellationSection({ members, projects }: Props) {
  return <TeamConstellation members={members} projects={projects} />;
}
