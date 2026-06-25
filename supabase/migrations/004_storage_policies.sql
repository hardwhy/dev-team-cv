-- ── Migration 004: Storage bucket RLS for admin uploads ─────────────────────
-- Without these policies, thumbnail/photo uploads fail with:
--   "new row violates row-level security policy"

-- Ensure buckets exist and are public (read via getPublicUrl)
insert into storage.buckets (id, name, public)
values
  ('team-members', 'team-members', true),
  ('projects', 'projects', true)
on conflict (id) do update set public = excluded.public;

-- team-members bucket
drop policy if exists "Public read team-members storage"   on storage.objects;
drop policy if exists "Admin upload team-members storage"  on storage.objects;
drop policy if exists "Admin update team-members storage"  on storage.objects;
drop policy if exists "Admin delete team-members storage"  on storage.objects;

create policy "Public read team-members storage" on storage.objects
  for select using (bucket_id = 'team-members');

create policy "Admin upload team-members storage" on storage.objects
  for insert with check (bucket_id = 'team-members' and auth.uid() is not null);

create policy "Admin update team-members storage" on storage.objects
  for update using (bucket_id = 'team-members' and auth.uid() is not null);

create policy "Admin delete team-members storage" on storage.objects
  for delete using (bucket_id = 'team-members' and auth.uid() is not null);

-- projects bucket
drop policy if exists "Public read projects storage"   on storage.objects;
drop policy if exists "Admin upload projects storage"  on storage.objects;
drop policy if exists "Admin update projects storage"  on storage.objects;
drop policy if exists "Admin delete projects storage"  on storage.objects;

create policy "Public read projects storage" on storage.objects
  for select using (bucket_id = 'projects');

create policy "Admin upload projects storage" on storage.objects
  for insert with check (bucket_id = 'projects' and auth.uid() is not null);

create policy "Admin update projects storage" on storage.objects
  for update using (bucket_id = 'projects' and auth.uid() is not null);

create policy "Admin delete projects storage" on storage.objects
  for delete using (bucket_id = 'projects' and auth.uid() is not null);
