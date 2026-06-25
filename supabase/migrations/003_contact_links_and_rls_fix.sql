-- ── Migration 003: Contact links setting + RLS policy fixes ──────────────────
-- Safe to re-run: drops all variants before recreating.
-- Uses auth.uid() is not null — most reliable RLS check in Supabase.

-- 1. Seed contact_links default in site_settings
insert into site_settings (key, value)
values (
  'contact_links',
  '[{"icon":"email","label":"hello@devteam.dev","value":"mailto:hello@devteam.dev"},{"icon":"github","label":"github.com/dev-team","value":"https://github.com/dev-team"}]'
)
on conflict (key) do nothing;

-- 2. team_members write policies
drop policy if exists "Admin write team_members"   on team_members;
drop policy if exists "Admin insert team_members"  on team_members;
drop policy if exists "Admin update team_members"  on team_members;
drop policy if exists "Admin delete team_members"  on team_members;

create policy "Admin insert team_members" on team_members
  for insert with check (auth.uid() is not null);
create policy "Admin update team_members" on team_members
  for update using (auth.uid() is not null);
create policy "Admin delete team_members" on team_members
  for delete using (auth.uid() is not null);

-- 3. projects write policies
drop policy if exists "Admin write projects"   on projects;
drop policy if exists "Admin insert projects"  on projects;
drop policy if exists "Admin update projects"  on projects;
drop policy if exists "Admin delete projects"  on projects;

create policy "Admin insert projects" on projects
  for insert with check (auth.uid() is not null);
create policy "Admin update projects" on projects
  for update using (auth.uid() is not null);
create policy "Admin delete projects" on projects
  for delete using (auth.uid() is not null);

-- 4. project_members write policies
drop policy if exists "Admin write project_members"   on project_members;
drop policy if exists "Admin insert project_members"  on project_members;
drop policy if exists "Admin update project_members"  on project_members;
drop policy if exists "Admin delete project_members"  on project_members;

create policy "Admin insert project_members" on project_members
  for insert with check (auth.uid() is not null);
create policy "Admin delete project_members" on project_members
  for delete using (auth.uid() is not null);

-- 5. site_settings write policies
drop policy if exists "Admin write site_settings"   on site_settings;
drop policy if exists "Admin insert site_settings"  on site_settings;
drop policy if exists "Admin update site_settings"  on site_settings;
drop policy if exists "Admin delete site_settings"  on site_settings;

create policy "Admin insert site_settings" on site_settings
  for insert with check (auth.uid() is not null);
create policy "Admin update site_settings" on site_settings
  for update using (auth.uid() is not null);
create policy "Admin delete site_settings" on site_settings
  for delete using (auth.uid() is not null);
