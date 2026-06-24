import { TeamSection as BaseTeamSection } from '@dev-team-cv/features-team';
import { Skeleton } from '@dev-team-cv/ui';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';

interface Props { members: TeamMember[]; projects: Project[]; loading: boolean; }

export function TeamSection({ members, projects, loading }: Props) {
  if (loading) {
    return (
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex gap-5">
            {[1,2,3].map(i => <Skeleton key={i} className="w-72 h-48 shrink-0 rounded-2xl" />)}
          </div>
        </div>
      </section>
    );
  }
  return <BaseTeamSection members={members} projects={projects} />;
}
