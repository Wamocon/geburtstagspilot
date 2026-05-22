import { createSupabaseBrowser, isSupabaseReady } from '@/lib/supabase-browser';

// Re-export for backwards compatibility. All DB calls in data.ts
// are wrapped in try/catch and return empty results on failure.
export const supabase = createSupabaseBrowser();
export { isSupabaseReady };
