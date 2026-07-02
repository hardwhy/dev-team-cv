import { useState } from 'react';
import { TeamSection as BaseTeamSection } from '@dev-team-cv/features-team';
import { ProjectModal } from '@dev-team-cv/features-projects';
import { Skeleton } from '@dev-team-cv/ui';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';

interface Props { members: TeamMember[]; projects: Project[]; loading: boolean; }

export function TeamSection({ members, projects, loading }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  if (loading) {
    return (
      <section className="py-24 px-6 border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-10 w-72 mb-3" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[272px] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <>
      <BaseTeamSection
        members={members}
        projects={projects}
        onProjectClick={setSelectedProject}
      />
      <ProjectModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
