-- ── Migration 007: Editable hero headline ─────────────────────────────────────
-- The public hero renders {hero_headline} + {hero_headline_accent} as two lines,
-- with {team_tagline} as the subtitle beneath.

insert into site_settings (key, value) values
  ('hero_headline', 'We build software'),
  ('hero_headline_accent', 'that people love.')
on conflict (key) do nothing;

-- Refresh the tagline default to the descriptive hero subtitle.
update site_settings
  set value = 'A focused team of engineers crafting elegant, performant cross-platform experiences.'
  where key = 'team_tagline' and value = 'Software Engineering Studio';
