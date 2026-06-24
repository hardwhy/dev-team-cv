import { supabase } from './supabase-client';
import type { ContactSubmission, ContactSubmissionInsert } from '@dev-team-cv/shared-types';

export const contactApi = {
  async submit(submission: ContactSubmissionInsert): Promise<ContactSubmission> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert(submission)
      .select()
      .single();
    if (error) throw error;
    return data;
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
