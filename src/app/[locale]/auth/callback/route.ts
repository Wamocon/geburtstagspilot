import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin, pathname } = url;
  const code = searchParams.get('code');

  // Extract locale from the URL path (e.g. /de/auth/callback -> 'de')
  const localeMatch = pathname.match(/^\/(de|en)\//);
  const locale = localeMatch ? localeMatch[1] : 'de';

  const next = searchParams.get('next') ?? `/${locale}/dashboard`;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseKey) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login?error=config`, origin));
  }

  if (code) {
    try {
      // Build the redirect response first so we can set cookies directly on it.
      // Using cookieStore.set() does NOT work for redirect responses in Next.js
      // App Router Route Handlers - cookies must be set on the response object.
      const redirectUrl = next.startsWith('http')
        ? next
        : new URL(next.startsWith('/') ? next : `/${next}`, origin).toString();
      const response = NextResponse.redirect(redirectUrl);

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            // Read cookies from the incoming request
            const cookieHeader = request.headers.get('cookie') ?? '';
            return cookieHeader
              .split(';')
              .filter(Boolean)
              .map((c) => {
                const eqIdx = c.indexOf('=');
                return {
                  name: c.slice(0, eqIdx).trim(),
                  value: c.slice(eqIdx + 1).trim(),
                };
              });
          },
          setAll(cookiesToSet) {
            // Set cookies directly on the redirect response
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return response;
      }
    } catch {
      // Supabase unreachable - redirect to login with error
    }
  }

  return NextResponse.redirect(new URL(`/${locale}/auth/login?error=auth`, origin));
}
