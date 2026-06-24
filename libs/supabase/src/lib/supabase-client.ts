import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env['VITE_SUPABASE_URL'] as string) ?? '';
const supabaseAnonKey = (import.meta.env['VITE_SUPABASE_ANON_KEY'] as string) ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[DevTeam] Supabase env vars are not set. ' +
    'Copy .env.example to .env in each app directory and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// createClient still works with empty strings during development — calls will fail
// gracefully with network errors rather than crashing at module load time.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
