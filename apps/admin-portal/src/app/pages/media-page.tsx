import { useEffect, useState } from 'react';
import { storageApi } from '@dev-team-cv/supabase';
import type { StorageBucket } from '@dev-team-cv/supabase';
import { Button, Skeleton } from '@dev-team-cv/ui';
import { generateStoragePath } from '@dev-team-cv/shared-utils';

interface FileItem {
  name: string;
  url: string;
  bucket: StorageBucket;
}

const BUCKETS: StorageBucket[] = ['team-members', 'projects'];

export function MediaPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBucket, setActiveBucket] = useState<StorageBucket>('team-members');
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');

  const load = async (bucket: StorageBucket) => {
    setLoading(true);
    try {
      const items = await storageApi.list(bucket);
      setFiles(items.filter(i => i.name && i.name !== '.emptyFolderPlaceholder').map(i => ({
        name: i.name,
        url: storageApi.getPublicUrl(bucket, i.name),
        bucket,
      })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(activeBucket); }, [activeBucket]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = generateStoragePath('', file.name);
      await storageApi.upload(activeBucket, path, file);
      load(activeBucket);
    } catch (err) { console.error(err); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleDelete = async (item: FileItem) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    await storageApi.delete(item.bucket, [item.name]);
    load(activeBucket);
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Media</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage uploaded files in Supabase Storage.</p>
        </div>
        <label className="cursor-pointer">
          <Button loading={uploading} as="span">Upload File</Button>
          <input type="file" className="sr-only" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* Bucket tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {BUCKETS.map(b => (
          <button
            key={b}
            onClick={() => setActiveBucket(b)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeBucket === b ? 'border-[var(--text-primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search files..."
        className="h-10 w-full max-w-sm rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map(f => (
            <div key={f.name} className="group relative rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden">
              {isImage(f.name) ? (
                <img src={f.url} alt={f.name} className="aspect-square w-full object-cover" loading="lazy" />
              ) : (
                <div className="aspect-square flex items-center justify-center text-[var(--text-muted)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
                  </svg>
                </div>
              )}
              <div className="p-2">
                <p className="text-xs text-[var(--text-secondary)] truncate" title={f.name}>{f.name}</p>
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => navigator.clipboard.writeText(f.url)} aria-label="Copy URL"
                  className="rounded-md bg-white/10 hover:bg-white/20 p-1.5 text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button onClick={() => handleDelete(f)} aria-label="Delete file"
                  className="rounded-md bg-red-500/80 hover:bg-red-500 p-1.5 text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)]">
          {search ? 'No files match your search' : 'No files uploaded yet'}
        </div>
      )}
    </div>
  );
}
