import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

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
