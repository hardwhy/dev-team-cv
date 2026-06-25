import { useEffect, useRef, useState } from 'react';
import { projectsApi, teamMembersApi, storageApi } from '@dev-team-cv/supabase';
import { Button, Card, Badge, Modal, Input, Textarea, Skeleton } from '@dev-team-cv/ui';
import { slugify } from '@dev-team-cv/shared-utils';
import type { Project, ProjectInsert, TeamMember } from '@dev-team-cv/shared-types';

const EMPTY: ProjectInsert = {
  title: '', slug: '', description: '', technologies: [], gallery_images: [],
  thumbnail: null, project_url: null, github_url: null,
  start_date: null, end_date: null, project_type: 'web', featured: false,
};

// ── Tech chip input ──────────────────────────────────────────────────────────
function TechChipInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addFromInput = () => {
    const items = input.split(',').map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    onChange([...new Set([...value, ...items])]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addFromInput();
    }
    if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const remove = (tech: string) => onChange(value.filter((t) => t !== tech));

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">Technologies</label>
      <div className="min-h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-colors">
        {value.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-overlay)] border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"
          >
            {tech}
            <button
              type="button"
              onClick={() => remove(tech)}
              aria-label={`Remove ${tech}`}
              className="rounded-full hover:text-red-500 transition-colors ml-0.5"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
              </svg>
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addFromInput}
          placeholder={value.length === 0 ? 'Type and press Enter or comma…' : ''}
          className="flex-1 min-w-24 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
        />
      </div>
      <p className="text-xs text-[var(--text-muted)]">Press Enter or comma to add. Click a chip to remove.</p>
    </div>
  );
}

// ── Thumbnail picker with preview ────────────────────────────────────────────
function ThumbnailPicker({
  existingUrl,
  file,
  onFileChange,
}: {
  existingUrl: string | null;
  file: File | null;
  onFileChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">Thumbnail</label>
      <div
        className="relative w-full h-36 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden cursor-pointer hover:border-[var(--text-muted)] transition-colors"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Click to choose thumbnail"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change image</span>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span className="text-xs">Click to upload thumbnail</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
      {(file || existingUrl) && (
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onFileChange(null)}
        >
          Remove thumbnail
        </Button>
      )}
    </div>
  );
}

// ── Dirty indicator dot ───────────────────────────────────────────────────────
function DirtyDot({ isDirty }: { isDirty: boolean }) {
  return (
    <span
      title={isDirty ? 'Unsaved changes' : 'Up to date'}
      className={`inline-block h-2 w-2 rounded-full transition-colors duration-200 ${isDirty ? 'bg-yellow-400' : 'bg-green-500'}`}
    />
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectInsert>(EMPTY);
  const [savedForm, setSavedForm] = useState<ProjectInsert>(EMPTY);
  const [savedMembers, setSavedMembers] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const thumbFileRef = useRef<File | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // isDirty = any field/member/file changed from the initial snapshot
  const isDirty =
    thumbFileRef.current !== null ||
    JSON.stringify(form) !== JSON.stringify(savedForm) ||
    JSON.stringify([...selectedMembers].sort()) !== JSON.stringify([...savedMembers].sort());

  const load = () => {
    setLoading(true);
    Promise.all([projectsApi.getAll(), teamMembersApi.getAll()])
      .then(([p, m]) => { setProjects(p); setMembers(m); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setSavedForm(EMPTY);
    setSelectedMembers([]);
    setSavedMembers([]);
    setThumbFile(null);
    thumbFileRef.current = null;
    setSaveError(null);
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    const initial: ProjectInsert = {
      title: p.title, slug: p.slug, description: p.description,
      technologies: p.technologies, gallery_images: p.gallery_images,
      thumbnail: p.thumbnail, project_url: p.project_url, github_url: p.github_url,
      start_date: p.start_date, end_date: p.end_date,
      project_type: p.project_type, featured: p.featured,
    };
    const initialMembers = p.team_members?.map((m) => m.id) ?? [];
    setForm(initial);
    setSavedForm(initial);
    setSelectedMembers(initialMembers);
    setSavedMembers(initialMembers);
    setThumbFile(null);
    thumbFileRef.current = null;
    setSaveError(null);
    setModalOpen(true);
  };

  const handleClose = () => { if (!saving) setModalOpen(false); };

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
      if (editing) {
        const p = await projectsApi.update(editing.id, payload);
        id = p.id;
      } else {
        const p = await projectsApi.create(payload);
        id = p.id;
      }
      await projectsApi.assignMembers(id, selectedMembers);
      setModalOpen(false);
      load();
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    await projectsApi.delete(id);
    load();
  };

  const toggleMember = (id: string) =>
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openCreate}>Add Project</Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)]">
          No projects yet — add your first one.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="flex flex-col">
              {/* Thumbnail — strictly 100×100 */}
              <div className="flex items-start gap-3 mb-3">
                <div className="rounded-lg bg-[var(--surface-overlay)] overflow-hidden shrink-0" style={{ width: 100, height: 100, minWidth: 100, minHeight: 100 }}>
                  {p.thumbnail
                    ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                    : <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                        </svg>
                      </div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-[var(--text-primary)] line-clamp-2">{p.title}</p>
                    {p.featured && <Badge label="Featured" color="#D97706" />}
                  </div>
                  <div className="flex flex-wrap gap-1 flex-1">
                    {p.technologies.slice(0, 3).map((t) => <Badge key={t} label={t} />)}
                    {p.technologies.length > 3 && <span className="text-xs text-[var(--text-muted)] self-center">+{p.technologies.length - 3}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={handleClose} title={editing ? 'Edit Project' : 'Add Project'} size="xl" locked={saving}>
        <div className="grid md:grid-cols-2 gap-5">

          {/* Row 1: Title + Slug */}
          <Input label="Title" value={form.title}
            onChange={(e) => { f('title', e.target.value); if (!editing) f('slug', slugify(e.target.value)); }} />
          <Input label="Slug" value={form.slug} onChange={(e) => f('slug', e.target.value)} />

          {/* Row 2: Project URL + GitHub URL */}
          <Input label="Project URL" value={form.project_url ?? ''}
            onChange={(e) => f('project_url', e.target.value || null)} />
          <Input label="GitHub URL" value={form.github_url ?? ''}
            onChange={(e) => f('github_url', e.target.value || null)} />

          {/* Row 3: Dates */}
          <Input label="Start Date" type="date" value={form.start_date ?? ''}
            onChange={(e) => f('start_date', e.target.value || null)} />
          <Input label="End Date" type="date" value={form.end_date ?? ''}
            onChange={(e) => f('end_date', e.target.value || null)} />

          {/* Row 4: Project Type + Featured */}
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
            <div className="flex h-10 items-center">
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer select-none">
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

          {/* Row 5: Tech chips — full width */}
          <div className="md:col-span-2">
            <TechChipInput
              value={form.technologies}
              onChange={(v) => f('technologies', v)}
            />
          </div>

          {/* Row 6: Thumbnail — full width */}
          <div className="md:col-span-2">
            <ThumbnailPicker
              existingUrl={form.thumbnail}
              file={thumbFile}
              onFileChange={(file) => {
                setThumbFile(file);
                thumbFileRef.current = file;
                if (!file) f('thumbnail', null);
              }}
            />
          </div>

          {/* Row 7: Description — full width */}
          <div className="md:col-span-2">
            <Textarea label="Description" value={form.description}
              onChange={(e) => f('description', e.target.value)} />
          </div>

          {/* Row 8: Team members — full width */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Assign Team Members</p>
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
          </div>
        </div>

        {saveError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20 px-4 py-3">
            <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
          </div>
        )}

        <div className="flex justify-end items-center gap-3 mt-6 pt-5 border-t border-[var(--border)]">
          <div className="flex items-center gap-1.5 mr-auto">
            <DirtyDot isDirty={isDirty} />
            <span className="text-xs text-[var(--text-muted)]">{isDirty ? 'Unsaved changes' : 'Up to date'}</span>
          </div>
          <Button variant="secondary" disabled={saving} onClick={handleClose}>Cancel</Button>
          <Button loading={saving} disabled={!isDirty} onClick={handleSave}>
            {editing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
