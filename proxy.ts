import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Refresh the Supabase auth session first so its Set-Cookie headers exist
  // before next-intl builds its own response.
  const supabaseResponse = await updateSession(request);
  const intlResponse = intlMiddleware(request);

  // @supabase/ssr sets refreshed auth cookies on `supabaseResponse`. Copy
  // them onto the response next-intl produces (which carries the locale
  // routing decision) so neither middleware's effect is lost.
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie);
  });

  return intlResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
