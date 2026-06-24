import { useEffect, useState } from 'react';
import { contactApi } from '@dev-team-cv/supabase';
import { Button, Card, Skeleton } from '@dev-team-cv/ui';
import type { ContactSubmission } from '@dev-team-cv/shared-types';

export function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    contactApi.getAll().then(setContacts).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this submission?')) return;
    await contactApi.delete(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Contact Submissions</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{contacts.length} total submissions.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : contacts.length > 0 ? (
        <div className="space-y-3">
          {contacts.map(c => (
            <Card key={c.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold text-[var(--text-primary)]">{c.name}</p>
                  <a href={`mailto:${c.email}`} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">{c.email}</a>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{c.message}</p>
                <time className="text-xs text-[var(--text-muted)] mt-2 block">{new Date(c.created_at).toLocaleString()}</time>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" size="sm" as="a" href={`mailto:${c.email}`}>Reply</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)]">
          No submissions yet
        </div>
      )}
    </div>
  );
}
