# 🚀 DevTeam Portfolio

A slick portfolio platform for our dev team — built with **Nx**, **React**, **Vite**, **Tailwind CSS**, and **Supabase**. Two apps in one repo: a public-facing portfolio site and a private admin dashboard.

---

## 🗂 What's in here?

```
apps/
├── client-portal   → 🌐 Public portfolio (port 4200)
└── admin-portal    → 🔐 CMS dashboard (port 4300)

libs/
├── ui              → 🎨 Shared design system (Button, Card, Badge, Drawer…)
├── auth            → 🔑 Auth context + protected routes
├── supabase        → 🗄 Supabase client + API modules
├── shared-types    → 📝 TypeScript types shared across apps
├── shared-utils    → 🛠 Handy utilities (cn, slugify, formatDate…)
├── shared-hooks    → 🪝 Custom hooks (drag scroll, scroll spy, engineer mode…)
├── features-team   → 👥 Team cards, profile sidebar, constellation canvas
├── features-projects → 📦 Project cards + project modal
├── theme           → 🌙 ThemeProvider, dark/light mode, member colors

supabase/
├── migrations/     → 📋 SQL schema files (run these once in Supabase)
└── seed/           → 🌱 Seed data for team members
```

---

## ⚡ Quick start

### 1. Prerequisites

- Node.js 18+
- npm 9+
- A free [Supabase](https://supabase.com) project

### 2. Install

```bash
git clone <repo-url>
cd dev-team-cv
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Open the SQL editor and run the migrations **in order**:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_settings.sql`
   - `supabase/migrations/003_contact_links_and_rls_fix.sql`
3. Run the seed: `supabase/seed/001_seed.sql`
4. Create two **public** storage buckets: `team-members` and `projects`

### 4. Environment variables

```bash
cp apps/client-portal/.env.example apps/client-portal/.env
cp apps/admin-portal/.env.example apps/admin-portal/.env
```

Fill in both `.env` files:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run locally

```bash
# Client portal → http://localhost:4200
npx nx serve @dev-team-cv/client-portal

# Admin portal → http://localhost:4300
npx nx serve @dev-team-cv/admin-portal
```

---

## ✨ Features

### 🌐 Client Portal

- Single-page scroll experience — hero, about, team, projects, skills, constellation, contact
- Horizontal drag-scroll carousels for team members and projects
- **Team member sidebar** — click any card to open a profile panel (no page takeover)
- Interactive **Team Constellation** — canvas-based member + project relationship viz
- 🌙 Light / Dark mode (no flicker, stored in localStorage)
- 🤓 **Engineer Mode** (`Shift+E`) — reveals architecture details as an Easter egg
- Scroll progress indicator + section reveal animations
- Contact form that saves submissions to Supabase
- Fully accessible (WCAG, keyboard nav, ARIA)

### 🔐 Admin Portal

- Protected login (Supabase Auth)
- Dashboard with quick stats + recent contact submissions
- **Team CRUD** — add/edit members with chip inputs for roles & skills, photo upload, color pickers
- **Projects CRUD** — manage projects with compact thumbnail, tech chip input, member assignment
- **Contacts** — view and delete contact form submissions
- **Settings** — edit team branding + contact links (email, GitHub, etc.) shown on the public site
- Dirty state tracking on all forms — save button only enables when there are actual changes
- Dirty indicator dot 🟡 = unsaved, 🟢 = up to date
- Sign out confirmation dialog
- Theme toggler next to sign out in the header

---

## 🎨 Design system

Colors are driven by CSS custom properties, so dark/light mode just works. Each team member has their own color identity used in cards, badges, and the constellation.

| Member | Color |
|--------|-------|
| Ayi Hardiyanto | Deep Blue `#2563EB` |
| Dedy Indra Setiawan | Emerald `#059669` |
| Muhammad Syehan | Warm Orange `#EA580C` |

---

## 🛠 Tech stack

| Layer | Tech |
|-------|------|
| Monorepo | Nx 23 |
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS 3 |
| State | React Context + hooks |
| Forms | React Hook Form + Zod |
| Animation | CSS transitions, Canvas API |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Deploy | Vercel / Netlify |

---

## 🚢 Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Set root directory to `apps/client-portal` (or `apps/admin-portal` for the admin)
4. Add your env variables
5. Build command: `npx vite build`

### Manual build

```bash
cd apps/client-portal && npx vite build
cd apps/admin-portal && npx vite build
```

---

## 🔧 Supabase RLS notes

Row-level security is enabled on all tables. The key policies are:

- **Public** can read `team_members`, `projects`, `project_members`, `site_settings`
- **Authenticated users** (admins) can write to all of the above
- **Anyone** can insert to `contact_submissions`; only admins can read/delete them

If you get `new row violates row-level security policy` errors when saving, run migrations **003** and **004** in your Supabase SQL editor (in order):

- **003** — splits table write policies into explicit `insert`/`update`/`delete` rules using `auth.uid() is not null` (more reliable than `auth.role()`)
- **004** — adds storage bucket policies so thumbnail/photo uploads work for authenticated admins

---

## 🤓 Engineer Mode

Press `Shift+E` on the public site to toggle a tech architecture overlay on the hero. It's a fun Easter egg for fellow engineers visiting the portfolio.

---

## 📬 Contact links

You can manage the contact links (email, GitHub, LinkedIn, etc.) shown in the public contact section directly from **Admin → Settings → Contact Info**. Changes reflect immediately on the public site.
