import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { teamMembersApi, storageApi } from '@dev-team-cv/supabase';
import { Button, Input, Textarea, Skeleton, Avatar } from '@dev-team-cv/ui';
import { generateStoragePath } from '@dev-team-cv/shared-utils';
import type { TeamMember, TeamMemberInsert } from '@dev-team-cv/shared-types';
import { DirtyDot } from '../components/project-form-fields';
import { ContactLinksEditor } from '../components/contact-links-editor';
import { ConfirmDialog } from '../components/confirm-dialog';
import { resolveContactLinkIcons } from '../utils/resolve-contact-link-icons';

const EMPTY_FORM: TeamMemberInsert = {
  full_name: '', role: [], short_bio: '', long_bio: '', years_of_experience: 0,
  skills: [], social_links: [],
  favorite_color: '#2563EB', accent_color: '#1D4ED8', secondary_color: '#BFDBFE',
  avatar_background_color: '#EFF6FF', profile_picture: null,
};

const COLOR_FIELDS = [
  { key: 'favorite_color', label: 'Primary' },
  { key: 'accent_color', label: 'Accent' },
  { key: 'secondary_color', label: 'Secondary' },
  { key: 'avatar_background_color', label: 'Avatar BG' },
] as const;

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

function PhotoPicker({ existingUrl, file, onFileChange }: {
  existingUrl: string | null; file: File | null; onFileChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text-primary)]">Profile Photo</label>
      <div
        className="relative w-full h-40 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface)] overflow-hidden cursor-pointer hover:border-[var(--text-muted)] transition-colors"
        onClick={() => inputRef.current?.click()}
        role="button" tabIndex={0} aria-label="Click to choose profile photo"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Profile photo preview" className="w-full h-full object-contain p-2" />
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

export function TeamFormPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(memberId);

  const [loading, setLoading] = useState(isEditing);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<TeamMemberInsert>(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState<TeamMemberInsert>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const photoFileRef = useRef<File | null>(null);
  const [iconFiles, setIconFiles] = useState<(File | null)[]>([]);
  const [discardOpen, setDiscardOpen] = useState(false);

  const hasPendingIcons = iconFiles.some(Boolean);
  const isDirty = photoFileRef.current !== null || hasPendingIcons || JSON.stringify(form) !== JSON.stringify(savedForm);

  useEffect(() => {
    if (!isEditing) {
      setForm(EMPTY_FORM); setSavedForm(EMPTY_FORM);
      setPhotoFile(null); photoFileRef.current = null;
      setIconFiles([]);
      setSaveError(null); setNotFound(false); setLoading(false);
      return;
    }

    setLoading(true); setNotFound(false);
    teamMembersApi.getById(memberId!)
      .then((m: TeamMember | null) => {
        if (!m) { setNotFound(true); return; }
        const initial: TeamMemberInsert = {
          full_name: m.full_name, role: m.role, short_bio: m.short_bio, long_bio: m.long_bio,
          years_of_experience: m.years_of_experience, skills: m.skills,
          social_links: m.social_links ?? [],
          favorite_color: m.favorite_color, accent_color: m.accent_color,
          secondary_color: m.secondary_color, avatar_background_color: m.avatar_background_color,
          profile_picture: m.profile_picture,
        };
        setForm(initial); setSavedForm(initial);
        setPhotoFile(null); photoFileRef.current = null;
        setIconFiles(m.social_links?.map(() => null) ?? []);
        setSaveError(null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isEditing, memberId]);

  const f = (field: keyof TeamMemberInsert, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const requestLeave = () => {
    if (saving) return;
    if (isDirty) setDiscardOpen(true);
    else navigate('/team');
  };

  const handleSave = async () => {
    setSaving(true); setSaveError(null);
    try {
      let photoUrl = form.profile_picture;
      if (photoFile) {
        const path = generateStoragePath('profiles', photoFile.name);
        photoUrl = await storageApi.upload('team-members', path, photoFile);
      }

      const socialLinks = await resolveContactLinkIcons(
        form.social_links,
        iconFiles,
        (path, file) => storageApi.upload('contact-icons', path, file),
        'member-icons'
      );

      const payload = { ...form, profile_picture: photoUrl, social_links: socialLinks };
      if (isEditing) await teamMembersApi.update(memberId!, payload);
      else await teamMembersApi.create(payload);
      navigate('/team');
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Unknown error');
      console.error(e);
    } finally { setSaving(false); }
  };

  if (notFound) return <Navigate to="/team" replace />;

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
          to="/team"
          onClick={(e) => {
            if (saving) { e.preventDefault(); return; }
            if (isDirty) { e.preventDefault(); setDiscardOpen(true); }
          }}
          aria-label="Back to team"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {isEditing ? 'Edit Member' : 'Add Member'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {isEditing ? 'Update the details for this team member.' : 'Fill in the details for the new team member.'}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-sm">
        {/* Preview header */}
        <div className="flex items-center gap-4 border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-overlay)]/60 to-transparent px-6 py-5">
          <Avatar
            src={photoFile ? URL.createObjectURL(photoFile) : form.profile_picture}
            name={form.full_name || 'New Member'}
            color={form.favorite_color}
            bgColor={form.avatar_background_color}
            size="lg"
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-[var(--text-primary)]">
              {form.full_name || 'New Member'}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {form.role.length > 0 ? (
                form.role.slice(0, 3).map((r) => (
                  <span key={r} className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: form.favorite_color }}>
                    {r}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--text-muted)]">No roles yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
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

            <div className="md:col-span-2">
              <ContactLinksEditor
                key={isEditing ? memberId : 'new'}
                links={form.social_links}
                savedLinks={savedForm.social_links}
                onLinksChange={(social_links) => f('social_links', social_links)}
                iconFiles={iconFiles}
                onIconFilesChange={setIconFiles}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <PhotoPicker
              existingUrl={form.profile_picture}
              file={photoFile}
              onFileChange={(file) => {
                setPhotoFile(file);
                photoFileRef.current = file;
                if (!file) f('profile_picture', null);
              }}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Brand Colors</label>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_FIELDS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 cursor-pointer">
                    <input type="color" value={form[key] as string} onChange={(e) => f(key, e.target.value)}
                      className="h-7 w-7 shrink-0 rounded cursor-pointer border-0 p-0 bg-transparent" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-[var(--text-primary)]">{label}</span>
                      <span className="block text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{form[key] as string}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Textarea label="Short Bio" value={form.short_bio} onChange={(e) => f('short_bio', e.target.value)} />
          <Textarea label="Long Bio" value={form.long_bio} onChange={(e) => f('long_bio', e.target.value)} />

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
            <Button variant="secondary" disabled={saving} onClick={requestLeave}>
              Cancel
            </Button>
            <Button loading={saving} disabled={!isDirty} onClick={handleSave}>
              {isEditing ? 'Save Changes' : 'Create Member'}
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
          navigate('/team');
        }}
        onCancel={() => setDiscardOpen(false)}
      />
    </div>
  );
}
