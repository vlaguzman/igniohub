import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client factory using the service_role key.
 *
 * D17 — the guard throws *inside* the function, never at module scope. A
 * top-level throw would break `next build` on any machine without the env
 * vars set and would poison the module graph of anything that transitively
 * imports it. The guard against SUPABASE_SERVICE_ROLE_KEY reaching the
 * browser is the absence of a NEXT_PUBLIC_ prefix (a bundled copy resolves
 * to `undefined` -> fails closed here), not the `server-only` package,
 * which is not installed and is not being added.
 */
export function createServerSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      'Missing env var NEXT_PUBLIC_SUPABASE_URL — required by createServerSupabaseClient()',
    );
  }
  if (!key) {
    throw new Error(
      'Missing env var SUPABASE_SERVICE_ROLE_KEY — required by createServerSupabaseClient()',
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
