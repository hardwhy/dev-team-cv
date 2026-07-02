import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '@dev-team-cv/supabase';
import type { Project } from '@dev-team-cv/shared-types';
import { ProjectsSection } from '@dev-team-cv/features-projects';

export function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi
      .getAll()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <main id="main-content" tabIndex={-1} className="pt-14">
        <ProjectsSection
          projects={projects}
          loading={loading}
          title="All Projects"
          subtitle="Everything we have shipped."
          layout="grid"
        />

        <div className="pb-16 text-center">
          <Link
            to="/?section=projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 2L4 7l5 5" />
            </svg>
            Back to featured work
          </Link>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)]">
        <p>&copy; {new Date().getFullYear()} devteam. Built with React, Vite &amp; Supabase.</p>
      </footer>
    </>
  );
}
