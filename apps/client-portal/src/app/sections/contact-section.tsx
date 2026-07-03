import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SectionWrapper, Button, Input, Textarea, SectionHeader } from '@dev-team-cv/ui';
import { contactApi } from '@dev-team-cv/supabase';

const CONTACT_COOLDOWN_KEY = 'contact_form_last_submit';
const MIN_FORM_DWELL_MS = 3_000;
const CLIENT_COOLDOWN_MS = 5 * 60_000;

const schema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Valid email required').max(254),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
  website: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function getClientCooldownRemainingMs(): number {
  const raw = sessionStorage.getItem(CONTACT_COOLDOWN_KEY);
  if (!raw) return 0;
  const remaining = Number(raw) - Date.now();
  return remaining > 0 ? remaining : 0;
}

function markClientCooldown(): void {
  sessionStorage.setItem(CONTACT_COOLDOWN_KEY, String(Date.now() + CLIENT_COOLDOWN_MS));
}

function formatCooldown(ms: number): string {
  const minutes = Math.max(1, Math.ceil(ms / 60_000));
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
}

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formReadyAt = useRef(Date.now());

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { website: '' },
  });

  useEffect(() => {
    formReadyAt.current = Date.now();
  }, []);

  const onSubmit = async (data: FormData) => {
    setError(null);

    if (data.website) {
      setSubmitted(true);
      reset();
      return;
    }

    const dwellMs = Date.now() - formReadyAt.current;
    if (dwellMs < MIN_FORM_DWELL_MS) {
      setError('Please take a moment to finish your message before sending.');
      return;
    }

    const cooldownMs = getClientCooldownRemainingMs();
    if (cooldownMs > 0) {
      setError(`Please wait ${formatCooldown(cooldownMs)} before sending another message.`);
      return;
    }

    try {
      await contactApi.submit({
        name: data.name,
        email: data.email,
        message: data.message,
      });
      markClientCooldown();
      setSubmitted(true);
      reset({ website: '' });
    } catch (err) {
      console.error('Contact form submission failed:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <SectionWrapper id="contact" className="py-24 border-t border-[var(--border)]">
      <div className="mx-auto max-w-xl px-6">
        <SectionHeader
          label="Contact"
          title="Let's build something together."
          subtitle="Have a project in mind? Send us a message and we will get back to you within 24 hours."
          className="mb-10"
        />

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

              <div className="h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('website')}
                />
              </div>

              {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
              <Button type="submit" loading={isSubmitting} className="w-full">Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
