# 🛠 DevTeam — Admin Portal

The CMS dashboard for managing all portfolio content. Fully protected — only authenticated admins get in. 🔐

---

## ✨ What's inside

| Page | What it does |
|------|-------------|
| 📊 **Dashboard** | Stats overview + recent contact submissions |
| 👥 **Team** | Full CRUD for team members — photo upload, colors, skills, social links |
| 🚀 **Projects** | Full CRUD for projects — thumbnail upload, tech chips, team assignment |
| 🖼 **Media** | Browse, upload, copy URL, and delete files from Supabase Storage |
| 📬 **Contacts** | View and delete contact form submissions |
| ⚙️ **Settings** | Edit team name, tagline, and copyright name |

---

## 🚀 Running locally

```bash
# From the monorepo root
npm run dev:admin
```

Opens at **http://localhost:4300** 🎉

---

## 🔑 Environment variables

Create `apps/admin-portal/.env` (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🔐 Authentication

Login is handled via **Supabase Auth**. Create an admin user in your Supabase project:

1. Go to **Authentication → Users** in your Supabase dashboard
2. Click **Add user** and set an email + password
3. That's it — log in at `http://localhost:4300/login`

---

## 🗄 Database setup

Run these SQL files in your Supabase SQL editor **in order**:

```
supabase/migrations/001_initial_schema.sql  ← tables, RLS, triggers
supabase/migrations/002_settings.sql        ← site settings table
supabase/seed/001_seed.sql                  ← initial team members
```

---

## 🖼 Storage setup

Create two buckets in **Supabase → Storage**:

| Bucket | Access | Used for |
|--------|--------|---------|
| `team-members` | Public | Profile photos |
| `projects` | Public | Thumbnails & galleries |

---

## 🏗 Build for production

```bash
npm run build:admin
# Output → apps/admin-portal/dist/
```

---

## 🧰 Tech stack

`React` · `Vite` · `TypeScript` · `Tailwind CSS` · `Supabase Auth` · `React Router v6` · `React Hook Form`
