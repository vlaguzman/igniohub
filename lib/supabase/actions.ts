import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase server client for use inside Server Actions and Route Handlers,
 * backed by the anon/publishable key and wired to `next/headers` cookies()
 * so a successful sign-in can set the session cookie on the response.
 *
 * Distinct from lib/supabase/server.ts (service_role, read-only cookies,
 * privileged writes) — this one represents the signed-in user, not the app.
 */
export async function createActionSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}
