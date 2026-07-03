import { useEffect, useState } from 'react';
import { useEngineerMode } from '@dev-team-cv/shared-hooks';
import { teamMembersApi, projectsApi } from '@dev-team-cv/supabase';
import type { TeamMember, Project } from '@dev-team-cv/shared-types';
import { EngineerModeBadge } from '../components/engineer-mode-badge';
import { HeroSection } from '../sections/hero-section';
import { AboutSection } from '../sections/about-section';
import { TeamSection } from '../sections/team-section-wrapper';
import { FeaturedProjectsSection } from '../sections/featured-projects-section';
import { SkillsSection } from '../sections/skills-section';
import { ContactSection } from '../sections/contact-section';
// Kept for future use — constellation section is currently hidden.
// import { ConstellationSection } from '../sections/constellation-section';
import { SiteFooter } from '../components/site-footer';

export function HomePage() {
  const engineerMode = useEngineerMode();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([teamMembersApi.getAll(), projectsApi.getAll()])
      .then(([m, p]) => {
        setMembers(m);
        setProjects(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <HeroSection engineerMode={engineerMode} />
        <AboutSection members={members} projects={projects} />
        <TeamSection members={members} projects={projects} loading={loading} />
        <FeaturedProjectsSection projects={projects} loading={loading} featured />
        <SkillsSection members={members} projects={projects} />
        {/* Constellation section temporarily hidden — kept for future use. */}
        {/* <ConstellationSection members={members} projects={projects} /> */}
        <ContactSection />
      </main>

      <SiteFooter />

      {engineerMode && <EngineerModeBadge />}
    </>
  );
}
