-- ── Migration 006: Split brand name into first + second part ───────────────────
-- The public logo renders as {team_name}{team_name_secondary}, e.g. "dev" + "team".

insert into site_settings (key, value) values
  ('team_name_secondary', 'team')
on conflict (key) do nothing;

-- Migrate the legacy single-word default into the two-part scheme.
update site_settings set value = 'dev' where key = 'team_name' and value = 'devteam';
