import { supabase } from './supabase-client';

export const settingsApi = {
  async get(key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();
    if (error) return null;
    return data?.value ?? null;
  },

  async getAll(): Promise<Record<string, string>> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');
    if (error) return {};
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  },

  async set(key: string, value: string): Promise<void> {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
};
