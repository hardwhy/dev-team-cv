import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsApi } from '@dev-team-cv/supabase';
import { Button, Badge, Skeleton } from '@dev-team-cv/ui';
import type { Project } from '@dev-team-cv/shared-types';
import { ConfirmDialog } from '../components/confirm-dialog';

function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: () => void;
}) {
  const extraTech = project.technologies.length - 3;

  return (
    <div className="glass-card group flex flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-overlay)]/50">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium capitalize text-white backdrop-blur-sm">
          {project.project_type}
        </span>
        {project.featured && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
            </svg>
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-semibold text-[var(--text-primary)] line-clamp-1">{project.title}</p>
        <p className="mt-1 min-h-[2.5rem] text-sm text-[var(--text-secondary)] line-clamp-2">
          {project.description || 'No description yet.'}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1">
          {project.technologies.slice(0, 3).map((t) => <Badge key={t} label={t} />)}
          {extraTech > 0 && (
            <span className="text-xs text-[var(--text-muted)]">+{extraTech} more</span>
          )}
        </div>

        <div className="mt-4 flex gap-2 border-t border-[var(--border)] pt-3">
          <Button variant="secondary" size="sm" as={Link} to={`/projects/${project.id}/edit`}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    projectsApi.getAll()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await projectsApi.delete(pendingDelete.id);
      setPendingDelete(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your portfolio projects.</p>
        </div>
        <Button onClick={() => navigate('/projects/new')}>Add Project</Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)]">
          No projects yet — add your first one.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onDelete={() => setPendingDelete(p)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete project?"
        description={
          pendingDelete
            ? `“${pendingDelete.title}” will be permanently removed. This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setPendingDelete(null)}
      />
    </div>
  );
}
