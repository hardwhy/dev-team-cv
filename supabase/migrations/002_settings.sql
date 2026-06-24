-- ── Site Settings ─────────────────────────────────────────────────────────────
create table if not exists site_settings (
  key   text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

-- Public can read settings
create policy "Public read site_settings" on site_settings
  for select using (true);

-- Authenticated (admin) can write
create policy "Admin write site_settings" on site_settings
  for all using (auth.role() = 'authenticated');

-- Seed defaults
insert into site_settings (key, value) values
  ('team_name', 'devteam'),
  ('team_tagline', 'Software Engineering Studio'),
  ('copyright_name', 'devteam')
on conflict (key) do nothing;
