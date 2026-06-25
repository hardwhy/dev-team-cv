import { useEffect, useRef, useState } from 'react';
import { teamMembersApi, storageApi } from '@dev-team-cv/supabase';
import { Button, Card, Avatar, Badge, Modal, Input, Textarea, Skeleton } from '@dev-team-cv/ui';
import { generateStoragePath } from '@dev-team-cv/shared-utils';
import type { TeamMember, TeamMemberInsert } from '@dev-team-cv/shared-types';

const EMPTY_FORM: TeamMemberInsert = {
  full_name: '', role: [], short_bio: '', long_bio: '', years_of_experience: 0,
  skills: [], linkedin_url: '', github_url: '', portfolio_url: '', email: '',
  favorite_color: '#2563EB', accent_color: '#1D4ED8', secondary_color: '#BFDBFE',
  avatar_background_color: '#EFF6FF', profile_picture: null,
};

// ── Chip input ────────────────────────────────────────────────────────────────
function ChipInput({ label, hint, value, onChange }: {
  label: string; hint?: string; value: string[]; onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');
  const addFromInput = () => {
    const items = input.split(',').map((s) => s.trim()).filter(Boolean);
    if (!items.length) return;
    onChange([...new Set([...value, ...items])]);
    setInput('');
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addFromInput(); }
    if (e.key === 'Backspace' && input === '' && value.length > 0) onChange(value.slice(0, -1));
  };
  const remove = (item: string) => onChange(value.filter((t) => t !== item));

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      <div className="min-h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-colors">
        {value.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-overlay)] border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
            {item}
            <button type="button" onClick={() => remove(item)} aria-label={`Remove ${item}`} className="rounded-full hover:text-red-500 transition-colors ml-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7"/></svg>
            </button>
          </span>
        ))}
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} onBlur={addFromInput}
          placeholder={value.length === 0 ? 'Type and press Enter or comma…' : ''}
          className="flex-1 min-w-24 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none" />
      </div>
      {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

// ── Photo picker with preview (same pattern as ThumbnailPicker) ───────────────
function PhotoPicker({ existingUrl, file, onFileChange }: {
  existingUrl: string | null; file: File | null; onFileChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">Profile Photo</label>
      <div
        className="relative w-full h-36 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden cursor-pointer hover:border-[var(--text-muted)] transition-colors"
        onClick={() => inputRef.current?.click()}
        role="button" tabIndex={0} aria-label="Click to choose profile photo"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Profile photo preview" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change photo</span>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            <span className="text-xs">Click to upload photo</span>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
      {(file || existingUrl) && (
        <Button type="button" variant="danger" size="sm" onClick={() => onFileChange(null)}>
          Remove photo
        </Button>
      )}
    </div>
  );
}

// ── Dirty indicator dot ───────────────────────────────────────────────────────
function DirtyDot({ isDirty }: { isDirty: boolean }) {
  return (
    <span title={isDirty ? 'Unsaved changes' : 'Up to date'}
      className={`inline-block h-2 w-2 rounded-full transition-colors duration-200 ${isDirty ? 'bg-yellow-400' : 'bg-green-500'}`} />
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<TeamMemberInsert>(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState<TeamMemberInsert>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const photoFileRef = useRef<File | null>(null);

  const isDirty = photoFileRef.current !== null || JSON.stringify(form) !== JSON.stringify(savedForm);

  const load = () => {
    setLoading(true);
    teamMembersApi.getAll().then(setMembers).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null); setForm(EMPTY_FORM); setSavedForm(EMPTY_FORM);
    setPhotoFile(null); photoFileRef.current = null; setSaveError(null); setModalOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    const initial: TeamMemberInsert = {
      full_name: m.full_name, role: m.role, short_bio: m.short_bio, long_bio: m.long_bio,
      years_of_experience: m.years_of_experience, skills: m.skills,
      linkedin_url: m.linkedin_url ?? '', github_url: m.github_url ?? '',
      portfolio_url: m.portfolio_url ?? '', email: m.email ?? '',
      favorite_color: m.favorite_color, accent_color: m.accent_color,
      secondary_color: m.secondary_color, avatar_background_color: m.avatar_background_color,
      profile_picture: m.profile_picture,
    };
    setForm(initial); setSavedForm(initial);
    setPhotoFile(null); photoFileRef.current = null; setSaveError(null); setModalOpen(true);
  };

  const handleClose = () => { if (!saving) setModalOpen(false); };

  const handleSave = async () => {
    setSaving(true); setSaveError(null);
    try {
      let photoUrl = form.profile_picture;
      if (photoFile) {
        const path = generateStoragePath('profiles', photoFile.name);
        photoUrl = await storageApi.upload('team-members', path, photoFile);
      }
      const payload = { ...form, profile_picture: photoUrl };
      if (editing) { await teamMembersApi.update(editing.id, payload); }
      else { await teamMembersApi.create(payload); }
      setModalOpen(false); load();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Unknown error');
      console.error(e);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this team member?')) return;
    await teamMembersApi.delete(id); load();
  };

  const f = (field: keyof TeamMemberInsert, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Team</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage team member profiles.</p>
        </div>
        <Button onClick={openCreate}>Add Member</Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((m) => (
            <Card key={m.id} className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Avatar src={m.profile_picture} name={m.full_name} color={m.favorite_color} bgColor={m.avatar_background_color} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--text-primary)] truncate">{m.full_name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {m.role.slice(0, 2).map((r) => <Badge key={r} label={r} color={m.favorite_color} />)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{m.short_bio}</p>
              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <Button variant="secondary" size="sm" onClick={() => openEdit(m)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(m.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={handleClose} title={editing ? 'Edit Member' : 'Add Member'} size="lg" locked={saving}>
        <div className="grid md:grid-cols-2 gap-5">
          <Input label="Full Name" value={form.full_name} onChange={(e) => f('full_name', e.target.value)} />
          <Input label="Years of Experience" type="number" value={form.years_of_experience}
            onChange={(e) => f('years_of_experience', parseInt(e.target.value) || 0)} />

          <div className="md:col-span-2">
            <ChipInput label="Roles" hint="Press Enter or comma to add. Click a chip to remove."
              value={form.role} onChange={(v) => f('role', v)} />
          </div>

          <div className="md:col-span-2">
            <ChipInput label="Skills" hint="Press Enter or comma to add. Click a chip to remove."
              value={form.skills} onChange={(v) => f('skills', v)} />
          </div>

          <Input label="Email" type="email" value={form.email ?? ''} onChange={(e) => f('email', e.target.value)} />
          <Input label="LinkedIn URL" value={form.linkedin_url ?? ''} onChange={(e) => f('linkedin_url', e.target.value)} />
          <Input label="GitHub URL" value={form.github_url ?? ''} onChange={(e) => f('github_url', e.target.value)} />
          <Input label="Portfolio URL" value={form.portfolio_url ?? ''} onChange={(e) => f('portfolio_url', e.target.value)} />

          {/* Photo picker with preview — full width */}
          <div className="md:col-span-2">
            <PhotoPicker
              existingUrl={form.profile_picture}
              file={photoFile}
              onFileChange={(file) => {
                setPhotoFile(file);
                photoFileRef.current = file;
                if (!file) f('profile_picture', null);
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(['favorite_color', 'accent_color', 'secondary_color', 'avatar_background_color'] as const).map((c) => (
              <div key={c} className="flex flex-col gap-1 items-center">
                <input type="color" value={form[c] as string} onChange={(e) => f(c, e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-[10px] text-[var(--text-muted)] text-center leading-tight">
                  {c.replace(/_/g, ' ').replace('color', '')}
                </span>
              </div>
            ))}
          </div>

          <div className="md:col-span-2">
            <Textarea label="Short Bio" value={form.short_bio} onChange={(e) => f('short_bio', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Long Bio" value={form.long_bio} onChange={(e) => f('long_bio', e.target.value)} />
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
            {editing ? 'Save Changes' : 'Create Member'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
