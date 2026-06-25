import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SectionWrapper, Button, Input, Textarea } from '@dev-team-cv/ui';
import { contactApi, settingsApi } from '@dev-team-cv/supabase';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type FormData = z.infer<typeof schema>;

interface ContactLink {
  icon: string;
  label: string;
  value: string;
}

function ContactLinkIcon({ type }: { type: string }) {
  if (type === 'email') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  );
  if (type === 'github') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
    </svg>
  );
  if (type === 'linkedin') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
  if (type === 'twitter') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  // website / fallback
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);

  // Load contact links from settings
  useEffect(() => {
    settingsApi.getAll().then((s) => {
      const raw = s['contact_links'];
      if (raw) {
        try {
          const parsed: ContactLink[] = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Normalise: ensure mailto: prefix for email entries
            setContactLinks(parsed.map((l) => ({
              ...l,
              value: l.icon === 'email' && !l.value.startsWith('mailto:')
                ? `mailto:${l.value}`
                : l.value,
            })));
          }
        } catch { /* keep defaults */ }
      }
    }).catch(() => { /* keep defaults */ });
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await contactApi.submit(data);
      setSubmitted(true);
      reset();
    } catch {
      setError('Something went wrong. Please try again or reach out directly by email.');
    }
  };

  return (
    <SectionWrapper id="contact" className="py-24 border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-widest mb-3">Contact</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
              Let&rsquo;s build something together.
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
              Have a project in mind? We would love to hear about it. Send us a message and we will get back to you within 24 hours.
            </p>

            <div className="space-y-4">
              {contactLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.value}
                  target={link.icon !== 'email' ? '_blank' : undefined}
                  rel={link.icon !== 'email' ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] group-hover:border-[var(--text-primary)] transition-colors">
                    <ContactLinkIcon type={link.icon} />
                  </div>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#22c55e" strokeWidth="2.5" aria-hidden="true">
                    <path d="M3 10l5 5L17 5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Message sent!</h3>
                <p className="text-sm text-[var(--text-secondary)]">We will get back to you within 24 hours.</p>
                <Button variant="ghost" className="mt-4" onClick={() => setSubmitted(false)}>Send another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <Input label="Your name" placeholder="Jane Smith" error={errors.name?.message} {...register('name')} />
                <Input label="Email address" type="email" placeholder="jane@example.com" error={errors.email?.message} {...register('email')} />
                <Textarea label="Message" placeholder="Tell us about your project..." error={errors.message?.message} {...register('message')} />
                {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
                <Button type="submit" loading={isSubmitting} className="w-full">Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
