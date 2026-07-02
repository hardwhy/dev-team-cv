import { ProjectsSection as BaseProjectsSection } from '@dev-team-cv/features-projects';
import type { Project } from '@dev-team-cv/shared-types';

interface Props { projects: Project[]; loading: boolean; featured?: boolean; }

export function FeaturedProjectsSection({ projects, loading, featured }: Props) {
  return (
    <BaseProjectsSection
      projects={projects}
      loading={loading}
      featuredOnly={featured}
      title="Featured Projects"
      subtitle="Our most impactful work."
      sectionId="projects"
      showAllLink
    />
  );
}
