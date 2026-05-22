import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      db: { schema: (process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'public') as 'public' },
    }
  );
}
