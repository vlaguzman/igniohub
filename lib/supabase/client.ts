import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-only Supabase client factory using the anon/publishable key.
 *
 * Distinct from lib/supabase/server.ts, which holds the service_role client
 * for privileged server-side writes only. This one is safe to import from
 * Client Components — both env vars it reads are NEXT_PUBLIC_-prefixed.
 */
export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createBrowserClient(url, key);
}
