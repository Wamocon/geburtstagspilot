import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extract locale from path
  const localeMatch = pathname.match(/^\/(de|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'de';

  // Set up Supabase client for session refresh
  let response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes: dashboard requires auth
  if (pathname.includes('/dashboard') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Admin routes: require admin role
  if (pathname.includes('/admin') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  if (pathname.includes('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.includes('/auth/login') && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }
  if (pathname.includes('/auth/register') && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, favicon.svg, robots.txt, sitemap.xml
     * - public folder files (images, etc.)
     */
    '/((?!_next|favicon\\.ico|favicon\\.svg|robots\\.txt|sitemap\\.xml|.*\\..*).*)',
  ],
};
