import { SectionWrapper, SectionHeader } from '@dev-team-cv/ui';

const VALUES = [
  { title: 'Craftsmanship', desc: 'We obsess over code quality, performance, and the details that make products feel exceptional.' },
  { title: 'Clarity', desc: 'We communicate openly, write clear code, and build systems that are easy to understand and extend.' },
  { title: 'Ownership', desc: 'We take full responsibility from design to deployment, treating every project as our own.' },
  { title: 'Collaboration', desc: 'Small team, big thinking. We work closely with clients and each other to deliver the best outcome.' },
];

export function AboutSection() {
  return (
    <SectionWrapper id="about" className="py-24 border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          label="About Us"
          title="A team that builds software the right way."
          subtitle="We are a compact, experienced engineering team specialising in cross-platform mobile apps, modern web applications, and robust backend systems."
        />

        <p className="text-[var(--text-secondary)] leading-relaxed text-center max-w-3xl mx-auto -mt-6 mb-12">
          Every project we take on gets the full weight of our attention. We do not scale by hiring dozens of people — we scale by being really, really good at what we do.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
              <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">{v.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 max-w-xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: '3', label: 'Engineers' },
              { value: '10+', label: 'Projects' },
              { value: '15+', label: 'Yrs combined' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-[var(--text-primary)]">{s.value}</div>
                <div className="text-sm text-[var(--text-muted)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
