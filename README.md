# DevTeam Portfolio Platform

A production-ready team portfolio platform built with Nx, React, Vite, Tailwind CSS, and Supabase.

## Architecture

```
apps/
├── client-portal   → Public-facing portfolio website (port 4200)
└── admin-portal    → CMS dashboard (port 4300)

libs/
├── ui              → Shared design system components
├── auth            → Auth context, protected routes
├── supabase        → Supabase client + API modules
├── shared-types    → TypeScript types
├── shared-utils    → Utility functions (cn, slugify, formatDate…)
├── shared-hooks    → Custom hooks (useDragScroll, useScrollSpy…)
├── features-team   → Team cards, profile drawer, constellation
├── features-projects → Project cards, project modal
├── features-dashboard → Dashboard widgets (reserved)
├── features-media  → Media manager (reserved)
└── theme           → ThemeProvider, dark/light, member colors

supabase/
├── migrations/001_initial_schema.sql
└── seed/001_seed.sql
```

## Quick Start

### 1. Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project

### 2. Clone & Install

```bash
git clone <repo-url>
cd dev-team-cv
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the SQL editor, run `supabase/migrations/001_initial_schema.sql`
3. Then run `supabase/seed/001_seed.sql` to seed the three team members
4. Create two storage buckets: `team-members` and `projects` (set to Public)

### 4. Configure Environment Variables

Copy the example env files and fill in your Supabase credentials:

```bash
cp apps/client-portal/.env.example apps/client-portal/.env
cp apps/admin-portal/.env.example apps/admin-portal/.env
```

Edit both `.env` files:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the Apps

**Client Portal** (http://localhost:4200):
```bash
npx vite --config apps/client-portal/vite.config.ts apps/client-portal
```

**Admin Portal** (http://localhost:4300):
```bash
npx vite --config apps/admin-portal/vite.config.ts apps/admin-portal
```

Or via Nx:
```bash
npx nx serve @dev-team-cv/client-portal
npx nx serve @dev-team-cv/admin-portal
```

## Features

### Client Portal
- Single-page scrolling experience with smooth section navigation
- Hero, About, Team, Featured Projects, All Projects, Skills, Constellation, Contact
- Horizontal drag-scroll for team members and projects
- Interactive Team Constellation visualization (canvas)
- Light / Dark mode with instant switching (no flicker)
- Engineer Mode (`Shift+E`) — reveals architecture details
- Scroll progress indicator
- Section reveal animations
- Contact form → stored in Supabase
- Fully accessible (WCAG, keyboard nav, ARIA)

### Admin Portal
- Protected login (Supabase Auth)
- Dashboard with stats and recent contact submissions
- Full CRUD for Team Members (with photo upload)
- Full CRUD for Projects (with thumbnail upload, member assignment)
- Media manager (browse, upload, copy URL, delete)
- Contact submission viewer

### Design System
- Flat, clean, timeless design
- CSS custom property based token system
- Each team member has a personal color identity
- Colors adapt between light and dark modes

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Set root directory to `apps/client-portal` (or `apps/admin-portal`)
4. Add environment variables
5. Set build command: `npm run build` (after adding vite build scripts)

### Build Commands

```bash
# Client portal
cd apps/client-portal && npx vite build

# Admin portal
cd apps/admin-portal && npx vite build
```

## Team Color Identity

| Member | Primary | Usage |
|--------|---------|-------|
| Ayi Hardiyanto | Deep Blue `#2563EB` | Member cards, badges, highlights |
| Dedy Indra Setiawan | Emerald Green `#059669` | Member cards, badges, highlights |
| Muhammad Syehan | Warm Orange `#EA580C` | Member cards, badges, highlights |

Colors are editable from the Admin Portal → Team → Edit Member.

## Engineer Mode

Press `Shift+E` on the client portal to toggle Engineer Mode. It overlays architecture and technical details on the hero section — a fun easter egg for fellow engineers.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Nx 23 |
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS 3 |
| State | React Context + hooks |
| Forms | React Hook Form + Zod |
| Animation | CSS transitions, Canvas API |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Deploy | Vercel / Netlify |
