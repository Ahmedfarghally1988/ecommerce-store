import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { decrypt } from './lib/auth';

const intlMiddleware = createIntlMiddleware(routing);

// Routes requiring Admin session (admin_session cookie, role === ADMIN)
const adminRoutes = ['/admin'];

// Routes requiring Customer session (customer_session cookie, role === CUSTOMER, status === APPROVED)
const customerRoutes = ['/account'];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── 301/302 Redirects Guard ──────────────────────────────────────────────
  if (!pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
    try {
      const redirectsUrl = new URL('/api/redirects', request.nextUrl.origin);
      const res = await fetch(redirectsUrl.toString(), { next: { revalidate: 60 } });
      if (res.ok) {
        const redirects = await res.json();
        const matchedRedirect = redirects.find((r: any) => r.source === pathname || r.source === pathname + '/');
        if (matchedRedirect) {
          const redirectUrl = new URL(matchedRedirect.destination, request.nextUrl.origin);
          return NextResponse.redirect(redirectUrl, matchedRedirect.isPermanent ? 301 : 302);
        }
      }
    } catch (err) {
      console.error('Middleware redirect check failed:', err);
    }
  }

  const pathSegments = pathname.split('/').filter(Boolean);
  const possibleLocale = pathSegments[0];
  const isLocalePrefix = routing.locales.includes(possibleLocale as any);
  const locale = isLocalePrefix ? possibleLocale : routing.defaultLocale;

  const pathWithoutLocale = isLocalePrefix
    ? '/' + pathSegments.slice(1).join('/')
    : pathname;

  // ── Admin Route Guard ────────────────────────────────────────────────────
  const isAdminRoute = adminRoutes.some(
    (r) => pathWithoutLocale === r || pathWithoutLocale.startsWith(`${r}/`)
  );

  if (isAdminRoute) {
    // Force Arabic for all Admin routes
    if (locale !== 'ar') {
      const arabicUrl = new URL(request.url);
      arabicUrl.pathname = `/ar${pathWithoutLocale}`;
      return NextResponse.redirect(arabicUrl);
    }
    // Skip the admin login page itself
    if (pathWithoutLocale === '/admin/login') {
      return intlMiddleware(request);
    }

    const adminCookie = request.cookies.get('admin_session');
    const adminSession = adminCookie ? await decrypt(adminCookie.value) : null;

    if (!adminSession || (adminSession.role !== 'ADMIN' && adminSession.role !== 'SUPER_ADMIN')) {
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Customer Account Route Guard ─────────────────────────────────────────
  const isCustomerRoute = customerRoutes.some(
    (r) => pathWithoutLocale === r || pathWithoutLocale.startsWith(`${r}/`)
  );

  if (isCustomerRoute) {
    const customerCookie = request.cookies.get('customer_session');
    const customerSession = customerCookie ? await decrypt(customerCookie.value) : null;

    if (!customerSession || customerSession.role !== 'CUSTOMER') {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Only APPROVED customers can access account pages
    if (customerSession.customerStatus !== 'APPROVED') {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('status', customerSession.customerStatus || 'PENDING');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Pass to next-intl middleware for i18n handling
  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
