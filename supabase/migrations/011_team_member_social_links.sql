-- ── Migration 011: Replace fixed contact columns with flexible social_links ──

alter table team_members
  add column if not exists social_links jsonb not null default '[]';

-- Migrate legacy email / linkedin / github / portfolio columns into social_links
update team_members
set social_links = coalesce(
  (
    select jsonb_agg(link order by ord)
    from (
      select 1 as ord, jsonb_build_object(
        'slug', 'email',
        'label', 'Email',
        'url', case
          when email like 'mailto:%' then email
          else 'mailto:' || email
        end,
        'iconUrl', ''
      ) as link
      where email is not null and trim(email) <> ''

      union all

      select 2, jsonb_build_object(
        'slug', 'linkedin',
        'label', 'LinkedIn',
        'url', linkedin_url,
        'iconUrl', ''
      )
      where linkedin_url is not null and trim(linkedin_url) <> ''

      union all

      select 3, jsonb_build_object(
        'slug', 'github',
        'label', 'GitHub',
        'url', github_url,
        'iconUrl', ''
      )
      where github_url is not null and trim(github_url) <> ''

      union all

      select 4, jsonb_build_object(
        'slug', 'portfolio',
        'label', 'Portfolio',
        'url', portfolio_url,
        'iconUrl', ''
      )
      where portfolio_url is not null and trim(portfolio_url) <> ''
    ) links
  ),
  '[]'::jsonb
)
where social_links = '[]'::jsonb;

alter table team_members drop column if exists linkedin_url;
alter table team_members drop column if exists github_url;
alter table team_members drop column if exists portfolio_url;
alter table team_members drop column if exists email;
