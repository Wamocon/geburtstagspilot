import { createBrowserClient } from '@supabase/ssr';

// Use placeholder fallbacks so module initialization never throws when env vars
// are missing (e.g. first deploy, CI without secrets). All DB calls in data.ts
// are wrapped in try/catch and return empty results on failure.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    db: { schema: (process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'public') as 'public' },
  }
);
