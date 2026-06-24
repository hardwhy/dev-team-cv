import { useEffect, useState } from 'react';
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

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<TeamMemberInsert>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const load = () => {
    setLoading(true);
    teamMembersApi.getAll().then(setMembers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setPhotoFile(null); setModalOpen(true); };
  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      full_name: m.full_name, role: m.role, short_bio: m.short_bio, long_bio: m.long_bio,
      years_of_experience: m.years_of_experience, skills: m.skills,
      linkedin_url: m.linkedin_url ?? '', github_url: m.github_url ?? '',
      portfolio_url: m.portfolio_url ?? '', email: m.email ?? '',
      favorite_color: m.favorite_color, accent_color: m.accent_color,
      secondary_color: m.secondary_color, avatar_background_color: m.avatar_background_color,
      profile_picture: m.profile_picture,
    });
    setPhotoFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let photoUrl = form.profile_picture;
      if (photoFile) {
        const path = generateStoragePath('profiles', photoFile.name);
        photoUrl = await storageApi.upload('team-members', path, photoFile);
      }
      const payload = { ...form, profile_picture: photoUrl };
      if (editing) {
        await teamMembersApi.update(editing.id, payload);
      } else {
        await teamMembersApi.create(payload);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this team member?')) return;
    await teamMembersApi.delete(id);
    load();
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
          {[1,2,3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
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
                    {m.role.slice(0, 2).map(r => <Badge key={r} label={r} color={m.favorite_color} />)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Member' : 'Add Member'} size="lg">
        <div className="grid md:grid-cols-2 gap-5">
          <Input label="Full Name" value={form.full_name} onChange={e => f('full_name', e.target.value)} />
          <Input label="Years of Experience" type="number" value={form.years_of_experience} onChange={e => f('years_of_experience', parseInt(e.target.value) || 0)} />
          <Input label="Roles (comma-separated)" value={form.role.join(', ')} onChange={e => f('role', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          <Input label="Skills (comma-separated)" value={form.skills.join(', ')} onChange={e => f('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          <Input label="Email" type="email" value={form.email ?? ''} onChange={e => f('email', e.target.value)} />
          <Input label="LinkedIn URL" value={form.linkedin_url ?? ''} onChange={e => f('linkedin_url', e.target.value)} />
          <Input label="GitHub URL" value={form.github_url ?? ''} onChange={e => f('github_url', e.target.value)} />
          <Input label="Portfolio URL" value={form.portfolio_url ?? ''} onChange={e => f('portfolio_url', e.target.value)} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
              className="text-sm text-[var(--text-secondary)] file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-[var(--border)] file:bg-[var(--surface-raised)] file:text-sm file:cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(['favorite_color', 'accent_color', 'secondary_color', 'avatar_background_color'] as const).map(c => (
              <div key={c} className="flex flex-col gap-1 items-center">
                <input type="color" value={form[c] as string} onChange={e => f(c, e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-[10px] text-[var(--text-muted)] text-center">{c.replace(/_/g,' ').replace('color','')}</span>
              </div>
            ))}
          </div>

          <div className="md:col-span-2">
            <Textarea label="Short Bio" value={form.short_bio} onChange={e => f('short_bio', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Long Bio" value={form.long_bio} onChange={e => f('long_bio', e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[var(--border)]">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button loading={saving} onClick={handleSave}>{editing ? 'Save Changes' : 'Create Member'}</Button>
        </div>
      </Modal>
    </div>
  );
}
