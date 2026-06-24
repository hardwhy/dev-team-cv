import { Button } from '@dev-team-cv/ui';

interface HeroSectionProps {
  engineerMode: boolean;
}

export function HeroSection({ engineerMode }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] dark:opacity-[0.15] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-1.5 mb-8 text-sm text-[var(--text-secondary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
          Available for projects
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] mb-6 animate-fade-in">
          We build software
          <br />
          <span className="text-[var(--text-secondary)]">that people love.</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          A focused team of engineers crafting elegant, performant cross-platform experiences.
        </p>

        <p className="text-base text-[var(--text-muted)] max-w-xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '150ms' }}>
          From mobile to web, from design systems to cloud infrastructure — we ship with care.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Button size="lg" onClick={() => scrollTo('projects')}>View Projects</Button>
          <Button size="lg" variant="secondary" onClick={() => scrollTo('team')}>Meet the Team</Button>
          <Button size="lg" variant="ghost" onClick={() => scrollTo('contact')}>Contact Us</Button>
        </div>

        {engineerMode && (
          <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 text-left font-mono text-sm text-[var(--text-secondary)]">
            <p className="text-green-500 mb-2">// ENGINEER MODE — Architecture Overview</p>
            <p>Stack: React + Vite + Tailwind + Supabase</p>
            <p>Pattern: Nx Monorepo, Feature-based libs</p>
            <p>Auth: Supabase Auth (JWT + RLS)</p>
            <p>Storage: Supabase Storage buckets</p>
            <p>DB: PostgreSQL (team_members, projects, project_members, contact_submissions)</p>
          </div>
        )}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] animate-bounce" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 2v12M3 9l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
}
