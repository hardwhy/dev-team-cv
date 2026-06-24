import { useEffect, useState } from 'react';
import { ScrollProgress } from '@dev-team-cv/ui';
import { useEngineerMode } from '@dev-team-cv/shared-hooks';
import { teamMembersApi, projectsApi } from '@dev-team-cv/supabase';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';
import { Nav } from './components/nav';
import { EngineerModeBadge } from './components/engineer-mode-badge';
import { HeroSection } from './sections/hero-section';
import { AboutSection } from './sections/about-section';
import { TeamSection } from './sections/team-section-wrapper';
import { FeaturedProjectsSection } from './sections/featured-projects-section';
import { AllProjectsSection } from './sections/all-projects-section';
import { SkillsSection } from './sections/skills-section';
import { ContactSection } from './sections/contact-section';
import { ConstellationSection } from './sections/constellation-section';

export function App() {
  const engineerMode = useEngineerMode();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([teamMembersApi.getAll(), projectsApi.getAll()])
      .then(([m, p]) => { setMembers(m); setProjects(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <HeroSection engineerMode={engineerMode} />
        <AboutSection />
        <TeamSection members={members} projects={projects} loading={loading} />
        <FeaturedProjectsSection projects={projects} loading={loading} featured />
        <AllProjectsSection projects={projects} loading={loading} />
        <SkillsSection members={members} />
        <ConstellationSection members={members} projects={projects} />
        <ContactSection />
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)]">
        <p>
          &copy; {new Date().getFullYear()} devteam. Built with React, Vite &amp; Supabase.
        </p>
      </footer>

      {engineerMode && <EngineerModeBadge />}
    </>
  );
}

export default App;
