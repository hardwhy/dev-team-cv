# 🌟 DevTeam — Client Portal

The public-facing portfolio website. A premium single-page experience that showcases who we are, what we build, and how we work.

---

## ✨ What's inside

| Section | What it does |
|---------|-------------|
| 🦸 **Hero** | Team name, tagline, and call-to-action buttons |
| 👋 **About** | Who we are, our values, and our tech stack |
| 👥 **Team** | Horizontally scrollable member cards — click to open a profile drawer |
| 🚀 **Featured Projects** | Our best work, highlighted |
| 📦 **All Projects** | Everything we've shipped |
| 🛠 **Skills** | Interactive tech badge cloud |
| 🌌 **Constellation** | Canvas visualization of team × project relationships |
| 📬 **Contact** | Contact form — submissions go straight to Supabase |

---

## 🚀 Running locally

```bash
# From the monorepo root
npm run dev:client
```

Opens at **http://localhost:4200** 🎉

---

## 🔑 Environment variables

Create `apps/client-portal/.env` (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🏗 Build for production

```bash
npm run build:client
# Output → apps/client-portal/dist/
```

---

## 🎮 Easter egg

Press **Shift + E** anywhere on the page to toggle **Engineer Mode** — reveals architecture diagrams, tech decisions, and implementation details. A fun one for fellow devs. 🤓

---

## 🎨 Design notes

- **Light mode** — clean, open, content-first
- **Dark mode** — deep charcoal, technical, focused
- Flat design — no gradients, no glassmorphism, no gimmicks
- Each team member has a personal color identity used throughout the UI
- Theme switches instantly with no flicker

---

## 🧰 Tech stack

`React` · `Vite` · `TypeScript` · `Tailwind CSS` · `Supabase` · `Canvas API`
