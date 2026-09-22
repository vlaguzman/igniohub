import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createServerSupabaseClient } from './server';

/**
 * D17 — the client factory must throw *inside* the function (never at
 * module scope) naming the specific missing env var. A top-level throw
 * would break `next build` on any machine without the env vars set.
 *
 * These tests cover the missing-key failure modes without needing a real
 * Supabase project or a real SUPABASE_SERVICE_ROLE_KEY (D17 / launch prompt
 * requirement — the key is not yet set in .env.local).
 */
describe('createServerSupabaseClient', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('throws a named error when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'fake-service-role-key';

    expect(() => createServerSupabaseClient()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it('throws a named error when SUPABASE_SERVICE_ROLE_KEY is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';

    expect(() => createServerSupabaseClient()).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });

  it('returns a client without throwing when both env vars are present', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'fake-service-role-key';

    const client = createServerSupabaseClient();

    expect(client).toBeDefined();
    expect(typeof client.from).toBe('function');
  });
});
