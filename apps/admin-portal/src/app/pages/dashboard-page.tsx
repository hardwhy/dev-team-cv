import { useEffect, useState } from 'react';
import { teamMembersApi, projectsApi, contactApi } from '@dev-team-cv/supabase';
import { Card, Skeleton } from '@dev-team-cv/ui';
import type { ContactSubmission } from '@dev-team-cv/shared-types';

interface Stats {
  members: number;
  projects: number;
  featured: number;
  contacts: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([teamMembersApi.getAll(), projectsApi.getAll(), contactApi.getAll()])
      .then(([m, p, c]) => {
        setStats({ members: m.length, projects: p.length, featured: p.filter((x) => x.featured).length, contacts: c.length });
        setContacts(c.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Team Members', value: stats?.members, color: '#2563EB' },
    { label: 'Total Projects', value: stats?.projects, color: '#059669' },
    { label: 'Featured', value: stats?.featured, color: '#D97706' },
    { label: 'Contact Submissions', value: stats?.contacts, color: '#7C3AED' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Overview of your portfolio content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="flex flex-col gap-2">
            {loading ? (
              <><Skeleton className="h-8 w-16" /><Skeleton className="h-4 w-24" /></>
            ) : (
              <>
                <span className="text-3xl font-bold" style={{ color: s.color }}>{s.value ?? 0}</span>
                <span className="text-sm text-[var(--text-secondary)]">{s.label}</span>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Recent contacts */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Contact Submissions</h2>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : contacts.length > 0 ? (
          <div className="space-y-3">
            {contacts.map((c) => (
              <Card key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[var(--text-primary)]">{c.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{c.email}</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">{c.message}</p>
                  </div>
                  <time className="text-xs text-[var(--text-muted)] shrink-0">
                    {new Date(c.created_at).toLocaleDateString()}
                  </time>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)]">
            No submissions yet
          </div>
        )}
      </div>
    </div>
  );
}
