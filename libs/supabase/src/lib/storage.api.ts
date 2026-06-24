import { supabase } from './supabase-client';

export type StorageBucket = 'team-members' | 'projects';

export const storageApi = {
  async upload(bucket: StorageBucket, path: string, file: File): Promise<string> {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type, // required — prevents CORS preflight issues
        cacheControl: '3600',
      });
    if (error) throw error;
    return storageApi.getPublicUrl(bucket, path);
  },

  getPublicUrl(bucket: StorageBucket, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  async delete(bucket: StorageBucket, paths: string[]): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) throw error;
  },

  async list(bucket: StorageBucket, folder?: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder ?? '', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) throw error;
    return data ?? [];
  },
};
