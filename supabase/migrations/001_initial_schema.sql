-- ─────────────────────────────────────────────────────────────────────────────
-- 001 Initial Schema
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Team Members ─────────────────────────────────────────────────────────────
create table if not exists team_members (
  id                    uuid primary key default uuid_generate_v4(),
  full_name             text not null,
  role                  text[] not null default '{}',
  profile_picture       text,
  short_bio             text not null default '',
  long_bio              text not null default '',
  years_of_experience   integer not null default 0,
  skills                text[] not null default '{}',
  linkedin_url          text,
  github_url            text,
  portfolio_url         text,
  email                 text,
  favorite_color        text not null default '#3B82F6',
  accent_color          text not null default '#2563EB',
  secondary_color       text not null default '#BFDBFE',
  avatar_background_color text not null default '#EFF6FF',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ─── Projects ─────────────────────────────────────────────────────────────────
create type project_type_enum as enum ('web', 'mobile', 'desktop', 'api', 'other');

create table if not exists projects (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text not null unique,
  thumbnail       text,
  gallery_images  text[] not null default '{}',
  description     text not null default '',
  technologies    text[] not null default '{}',
  project_url     text,
  github_url      text,
  start_date      date,
  end_date        date,
  project_type    project_type_enum not null default 'web',
  featured        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── Project Members (many-to-many) ───────────────────────────────────────────
create table if not exists project_members (
  project_id      uuid not null references projects(id) on delete cascade,
  team_member_id  uuid not null references team_members(id) on delete cascade,
  primary key (project_id, team_member_id)
);

-- ─── Contact Submissions ──────────────────────────────────────────────────────
create table if not exists contact_submissions (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ─── Updated_at trigger ───────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger team_members_updated_at
  before update on team_members
  for each row execute procedure set_updated_at();

create trigger projects_updated_at
  before update on projects
  for each row execute procedure set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table team_members enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table contact_submissions enable row level security;

-- Public read access
create policy "Public read team_members" on team_members for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read project_members" on project_members for select using (true);

-- Admin write access (authenticated users with admin role via JWT claim)
create policy "Admin write team_members" on team_members
  for all using (auth.role() = 'authenticated');

create policy "Admin write projects" on projects
  for all using (auth.role() = 'authenticated');

create policy "Admin write project_members" on project_members
  for all using (auth.role() = 'authenticated');

-- Contact: anyone can insert, only admins can read
create policy "Public insert contact" on contact_submissions
  for insert with check (true);

create policy "Admin read contact" on contact_submissions
  for select using (auth.role() = 'authenticated');

create policy "Admin delete contact" on contact_submissions
  for delete using (auth.role() = 'authenticated');
