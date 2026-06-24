insert into team_members (
  full_name, role, short_bio, long_bio, years_of_experience, skills,
  linkedin_url, github_url, email,
  favorite_color, accent_color, secondary_color, avatar_background_color
)
values
  (
    'Ayi Hardiyanto',
    ARRAY['Senior Software Engineer','Frontend Engineer','Mobile Engineer','Flutter Specialist','React Developer'],
    'Crafting elegant cross-platform experiences with Flutter and React.',
    'Ayi is a senior engineer with deep expertise in building beautiful, performant apps for both mobile and web. He leads frontend architecture decisions and champions clean code practices across the team.',
    6,
    ARRAY['Flutter','Dart','React','TypeScript','Tailwind CSS','Firebase','Supabase','REST APIs','GraphQL','CI/CD'],
    'https://linkedin.com/in/ayi-hardiyanto',
    'https://github.com/ayi-hardiyanto',
    'ayi@devteam.dev',
    '#2563EB', '#1D4ED8', '#BFDBFE', '#EFF6FF'
  ),
  (
    'Dedy Indra Setiawan',
    ARRAY['Backend Engineer','Full-Stack Developer','DevOps'],
    'Building robust server-side systems and scalable infrastructure.',
    'Dedy specialises in backend architecture, API design, and cloud infrastructure. He ensures the team''s systems are reliable, secure, and performant at scale.',
    5,
    ARRAY['Node.js','Express','PostgreSQL','Docker','AWS','TypeScript','REST APIs','Microservices','Redis','GitHub Actions'],
    'https://linkedin.com/in/dedy-indra',
    'https://github.com/dedy-indra',
    'dedy@devteam.dev',
    '#059669', '#047857', '#A7F3D0', '#ECFDF5'
  ),
  (
    'Muhammad Syehan',
    ARRAY['UI/UX Engineer','Frontend Developer','Design Systems'],
    'Turning design visions into pixel-perfect, accessible interfaces.',
    'Syehan bridges design and engineering, creating cohesive design systems and implementing them with precision. He cares deeply about accessibility, performance, and delightful user experiences.',
    4,
    ARRAY['React','TypeScript','Tailwind CSS','Figma','Next.js','Framer Motion','WCAG','Storybook','CSS','Animation'],
    'https://linkedin.com/in/muhammad-syehan',
    'https://github.com/muhammad-syehan',
    'syehan@devteam.dev',
    '#EA580C', '#C2410C', '#FED7AA', '#FFF7ED'
  );
