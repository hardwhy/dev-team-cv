-- ── Migration 005: About section values setting ───────────────────────────────

insert into site_settings (key, value) values
  (
    'about_values',
    '[{"title":"Craftsmanship","desc":"We obsess over code quality, performance, and the details that make products feel exceptional."},{"title":"Clarity","desc":"We communicate openly, write clear code, and build systems that are easy to understand and extend."},{"title":"Ownership","desc":"We take full responsibility from design to deployment, treating every project as our own."},{"title":"Collaboration","desc":"Small team, big thinking. We work closely with clients and each other to deliver the best outcome."}]'
  )
on conflict (key) do nothing;
