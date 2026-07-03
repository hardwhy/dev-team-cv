import { supabase } from './supabase-client';
import type { ContactSubmission, ContactSubmissionInsert } from '@dev-team-cv/shared-types';

const CONTACT_SUBMIT_ERRORS: Array<{ match: string; message: string }> = [
  { match: 'Too many messages from this email', message: 'You have sent several messages recently. Please wait about an hour before trying again.' },
  { match: 'Daily message limit reached', message: 'Daily message limit reached for this email. Please try again tomorrow.' },
  { match: 'already sent recently', message: 'This message was already sent recently.' },
  { match: 'Name is too short', message: 'Please enter your name.' },
  { match: 'Message is too short', message: 'Message must be at least 10 characters.' },
];

export function getContactSubmitErrorMessage(error: unknown): string {
  const message =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message: string }).message)
      : '';

  const known = CONTACT_SUBMIT_ERRORS.find(({ match }) => message.includes(match));
  return known?.message ?? 'Something went wrong. Please try again.';
}

export const contactApi = {
  async submit(submission: ContactSubmissionInsert): Promise<void> {
    const { error } = await supabase.from('contact_submissions').insert(submission);
    if (error) {
      throw new Error(getContactSubmitErrorMessage(error));
    }
  },

  async getAll(): Promise<ContactSubmission[]> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) throw error;
  },
};
