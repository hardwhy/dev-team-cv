import { ProjectsSection as BaseProjectsSection } from '@dev-team-cv/features-projects';
import type { Project } from '@dev-team-cv/shared-types';

interface Props { projects: Project[]; loading: boolean; }

export function AllProjectsSection({ projects, loading }: Props) {
  return (
    <BaseProjectsSection
      projects={projects}
      loading={loading}
      title="All Projects"
      subtitle="Everything we have shipped."
      sectionId="projects"
    />
  );
}
