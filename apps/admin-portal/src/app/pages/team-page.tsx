import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamMembersApi } from '@dev-team-cv/supabase';
import { Button, Avatar, Skeleton } from '@dev-team-cv/ui';
import type { TeamMember } from '@dev-team-cv/shared-types';
import { ConfirmDialog } from '../components/confirm-dialog';

function MemberCard({ member, onEdit, onDelete }: {
  member: TeamMember;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const extraRoles = member.role.length - 2;
  const experience = member.years_of_experience;

  return (
    <div className="glass-card group relative flex flex-col overflow-hidden rounded-2xl">
      {/* Accent band tinted by the member's brand color */}
      <div
        className="h-14 w-full"
        style={{
          background: `linear-gradient(120deg, ${member.favorite_color}, ${member.accent_color})`,
        }}
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-col px-4 pb-4">
        <div className="-mt-8 flex items-end justify-between">
          <div className="rounded-full ring-4 ring-[var(--surface-raised)]">
            <Avatar
              src={member.profile_picture}
              name={member.full_name}
              color={member.favorite_color}
              bgColor={member.avatar_background_color}
              size="xl"
            />
          </div>
          {experience > 0 && (
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[var(--surface-overlay)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
              {experience} {experience === 1 ? 'yr' : 'yrs'} exp
            </span>
          )}
        </div>

        <p className="mt-3 truncate font-semibold text-[var(--text-primary)]">{member.full_name}</p>

        <div className="mt-1.5 flex flex-wrap gap-1">
          {member.role.slice(0, 2).map((r) => (
            <span
              key={r}
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{
                color: member.favorite_color,
                backgroundColor: `color-mix(in srgb, ${member.favorite_color} 14%, transparent)`,
              }}
            >
              {r}
            </span>
          ))}
          {extraRoles > 0 && (
            <span className="text-[11px] text-[var(--text-muted)] self-center">+{extraRoles} more</span>
          )}
        </div>

        <p className="mt-2 min-h-[2.5rem] text-sm text-[var(--text-secondary)] line-clamp-2">
          {member.short_bio || 'No bio yet.'}
        </p>

        <div className="mt-4 flex gap-2 border-t border-[var(--border)] pt-3">
          <Button variant="secondary" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export function TeamPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    teamMembersApi.getAll().then(setMembers).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await teamMembersApi.delete(pendingDelete.id);
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
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Team</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage team member profiles.</p>
        </div>
        <Button onClick={() => navigate('/team/new')}>Add Member</Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      ) : members.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)]">
          No team members yet — add your first one.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              onEdit={() => navigate(`/team/${m.id}/edit`)}
              onDelete={() => setPendingDelete(m)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete team member?"
        description={
          pendingDelete
            ? `“${pendingDelete.full_name}” will be permanently removed. This action cannot be undone.`
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
