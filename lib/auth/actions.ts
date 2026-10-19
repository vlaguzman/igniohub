'use server';

import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createActionSupabaseClient } from '@/lib/supabase/actions';

export type SignInState = { error: string } | null;

export async function signIn(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'auth.errors' });

  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || email.length === 0 || typeof password !== 'string' || password.length === 0) {
    return { error: t('missingFields') };
  }

  const supabase = await createActionSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Translated, generic message — never surface Supabase's raw error text
    // (it can leak whether an account exists).
    return { error: t('invalidCredentials') };
  }

  redirect(`/${locale}`);
}
