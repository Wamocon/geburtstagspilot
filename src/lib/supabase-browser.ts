import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Returns true if Supabase env vars are set (not placeholder/empty). */
export function isSupabaseReady(): boolean {
  return (
    SUPABASE_URL.length > 0 &&
    !SUPABASE_URL.includes('placeholder') &&
    SUPABASE_ANON_KEY.length > 0 &&
    !SUPABASE_ANON_KEY.includes('placeholder')
  );
}

export function createSupabaseBrowser() {
  if (!isSupabaseReady()) {
    // Return a client that will fail on any real request, but won't
    // crash during SSR or initial render. The UI layer checks
    // isSupabaseReady() and shows an appropriate message.
    return createBrowserClient(
      'https://localhost.invalid',
      'missing-key',
      { db: { schema: 'public' } }
    );
  }

  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      db: { schema: (process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA || 'public') as 'public' },
    }
  );
}
