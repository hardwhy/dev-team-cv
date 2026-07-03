-- ── Migration 009: Contact icon storage bucket ──────────────────────────────

insert into storage.buckets (id, name, public)
values ('contact-icons', 'contact-icons', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read contact-icons storage"   on storage.objects;
drop policy if exists "Admin upload contact-icons storage"  on storage.objects;
drop policy if exists "Admin update contact-icons storage"  on storage.objects;
drop policy if exists "Admin delete contact-icons storage"  on storage.objects;

create policy "Public read contact-icons storage" on storage.objects
  for select using (bucket_id = 'contact-icons');

create policy "Admin upload contact-icons storage" on storage.objects
  for insert with check (bucket_id = 'contact-icons' and auth.uid() is not null);

create policy "Admin update contact-icons storage" on storage.objects
  for update using (bucket_id = 'contact-icons' and auth.uid() is not null);

create policy "Admin delete contact-icons storage" on storage.objects
  for delete using (bucket_id = 'contact-icons' and auth.uid() is not null);

-- Normalize stored contact_links: name → slug
update site_settings
set value = replace(replace(value, '"name":', '"slug":'), '"id":', '"slug":')
where key = 'contact_links';
