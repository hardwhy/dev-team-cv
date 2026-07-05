import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { projectsApi, teamMembersApi, storageApi } from '@dev-team-cv/supabase';
import { Button, Input, Textarea, Skeleton } from '@dev-team-cv/ui';
import { slugify } from '@dev-team-cv/shared-utils';
import type { ProjectInsert, TeamMember } from '@dev-team-cv/shared-types';
import { DirtyDot, TechChipInput, ThumbnailPicker } from '../components/project-form-fields';
import { ConfirmDialog } from '../components/confirm-dialog';

const EMPTY: ProjectInsert = {
  title: '', slug: '', description: '', technologies: [], gallery_images: [],
  thumbnail: null, project_url: null, github_url: null,
  start_date: null, end_date: null, project_type: 'web', featured: false,
};

export function ProjectFormPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(projectId);

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<ProjectInsert>(EMPTY);
  const [savedForm, setSavedForm] = useState<ProjectInsert>(EMPTY);
  const [savedMembers, setSavedMembers] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const thumbFileRef = useRef<File | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [discardOpen, setDiscardOpen] = useState(false);

  const isDirty =
    thumbFileRef.current !== null ||
    JSON.stringify(form) !== JSON.stringify(savedForm) ||
    JSON.stringify([...selectedMembers].sort()) !== JSON.stringify([...savedMembers].sort());

  useEffect(() => {
    teamMembersApi.getAll().then(setMembers).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setForm(EMPTY);
      setSavedForm(EMPTY);
      setSelectedMembers([]);
      setSavedMembers([]);
      setThumbFile(null);
      thumbFileRef.current = null;
      setSaveError(null);
      setNotFound(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);
    projectsApi.getById(projectId!)
      .then((project) => {
        if (!project) {
          setNotFound(true);
          return;
        }
        const initial: ProjectInsert = {
          title: project.title, slug: project.slug, description: project.description,
          technologies: project.technologies, gallery_images: project.gallery_images,
          thumbnail: project.thumbnail, project_url: project.project_url, github_url: project.github_url,
          start_date: project.start_date, end_date: project.end_date,
          project_type: project.project_type, featured: project.featured,
        };
        const initialMembers = project.team_members?.map((m) => m.id) ?? [];
        setForm(initial);
        setSavedForm(initial);
        setSelectedMembers(initialMembers);
        setSavedMembers(initialMembers);
        setThumbFile(null);
        thumbFileRef.current = null;
        setSaveError(null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isEditing, projectId]);

  const requestLeave = () => {
    if (saving) return;
    if (isDirty) setDiscardOpen(true);
    else navigate('/projects');
  };

  const f = (field: keyof ProjectInsert, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      let thumb = form.thumbnail;

      if (thumbFile) {
        const ext = thumbFile.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
        const path = `thumbnails/${crypto.randomUUID()}.${ext}`;
        thumb = await storageApi.upload('projects', path, thumbFile);
      }

      const payload: ProjectInsert = {
        ...form,
        thumbnail: thumb,
        slug: form.slug || slugify(form.title),
      };

      let id: string;
      if (isEditing) {
        const p = await projectsApi.update(projectId!, payload);
        id = p.id;
      } else {
        const p = await projectsApi.create(payload);
        id = p.id;
      }
      await projectsApi.assignMembers(id, selectedMembers);
      navigate('/projects');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setSaveError(msg.includes('cors') || msg.includes('network')
        ? 'Upload failed — check that your Supabase storage bucket is set to Public and CORS is configured.'
        : msg);
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const toggleMember = (id: string) =>
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  if (notFound) {
    return <Navigate to="/projects" replace />;
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-[32rem] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/projects"
          onClick={(e) => {
            if (saving) {
              e.preventDefault();
              return;
            }
            if (isDirty) {
              e.preventDefault();
              setDiscardOpen(true);
            }
          }}
          aria-label="Back to projects"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {isEditing ? 'Edit Project' : 'Add Project'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {isEditing ? 'Update the details for this project.' : 'Fill in the details for your new project.'}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-sm">
        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Title" value={form.title}
              onChange={(e) => { f('title', e.target.value); if (!isEditing) f('slug', slugify(e.target.value)); }} />
            <Input label="Slug" value={form.slug} onChange={(e) => f('slug', e.target.value)} />

            <Input label="Project URL" value={form.project_url ?? ''}
              onChange={(e) => f('project_url', e.target.value || null)} />
            <Input label="GitHub URL" value={form.github_url ?? ''}
              onChange={(e) => f('github_url', e.target.value || null)} />

            <Input label="Start Date" type="date" value={form.start_date ?? ''}
              onChange={(e) => f('start_date', e.target.value || null)} />
            <Input label="End Date" type="date" value={form.end_date ?? ''}
              onChange={(e) => f('end_date', e.target.value || null)} />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="project-type" className="text-sm font-medium text-[var(--text-primary)]">
                Project Type
              </label>
              <div className="relative">
                <select
                  id="project-type"
                  value={form.project_type}
                  onChange={(e) => f('project_type', e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--surface)] pl-3 pr-8 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
                >
                  {['web', 'mobile', 'desktop', 'api', 'other'].map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Options</label>
              <label className="flex h-10 items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => f('featured', e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border)] accent-blue-600"
                />
                Mark as Featured
              </label>
            </div>
          </div>

          <TechChipInput
            value={form.technologies}
            onChange={(v) => f('technologies', v)}
          />

          <ThumbnailPicker
            existingUrl={form.thumbnail}
            file={thumbFile}
            onFileChange={(file) => {
              setThumbFile(file);
              thumbFileRef.current = file;
              if (!file) f('thumbnail', null);
            }}
          />

          <Textarea label="Description" value={form.description}
            onChange={(e) => f('description', e.target.value)} />

          <div>
            <p className="mb-2 text-sm font-medium text-[var(--text-primary)]">Assign Team Members</p>
            {members.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No team members available.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMember(m.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-all duration-150 ${
                      selectedMembers.includes(m.id)
                        ? 'border-transparent text-white shadow-sm'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
                    }`}
                    style={selectedMembers.includes(m.id) ? { backgroundColor: m.favorite_color } : {}}
                  >
                    {m.full_name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {saveError && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20 px-4 py-3">
              <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--border)] bg-[var(--surface)]/40 px-6 py-4">
          <DirtyDot isDirty={isDirty} />
          <span className="text-xs text-[var(--text-muted)]">{isDirty ? 'Unsaved changes' : 'Up to date'}</span>
          <div className="ml-auto flex gap-3">
            <Button variant="secondary" disabled={saving} onClick={requestLeave}>Cancel</Button>
            <Button loading={saving} disabled={!isDirty} onClick={handleSave}>
              {isEditing ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={discardOpen}
        title="Discard unsaved changes?"
        description="Your changes will be lost if you leave without saving."
        confirmLabel="Discard"
        variant="danger"
        onConfirm={() => {
          setDiscardOpen(false);
          navigate('/projects');
        }}
        onCancel={() => setDiscardOpen(false)}
      />
    </div>
  );
}
