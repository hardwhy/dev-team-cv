-- ── Migration 008: Flexible contact links schema ──────────────────────────────
-- New shape: { name, label, url, iconUrl }
-- Legacy { icon, label, value } entries are migrated at read time by the app.

update site_settings
set value = '[{"slug":"email","label":"hello@devteam.dev","url":"mailto:hello@devteam.dev","iconUrl":""},{"slug":"github","label":"github.com/dev-team","url":"https://github.com/dev-team","iconUrl":""}]'
where key = 'contact_links'
  and value like '%"icon"%';
