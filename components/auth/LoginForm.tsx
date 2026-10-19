'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { signIn, type SignInState } from '@/lib/auth/actions';

/**
 * Neither `useFormState` (react-dom) nor `useActionState` (react) is
 * available on this repo's installed react/react-dom 18.3.1 — the former
 * never shipped in 18.x and the latter is React 19-only. Instead we call the
 * server action directly from a form `action` wrapped in `startTransition`,
 * track pending state with `useTransition`, and hold the returned state in
 * local `useState`. This gives the same UX (pending flag, error state)
 * without either hook.
 */
export function LoginForm() {
  const t = useTranslations('auth');
  const [state, setState] = useState<SignInState>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await signIn(state, formData);
      setState(result);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-charcoal-slate">
          {t('login.emailLabel')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-charcoal-slate/20 p-3 text-sm text-charcoal-slate outline-none focus:border-ignio-purple"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-charcoal-slate">
          {t('login.passwordLabel')}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-charcoal-slate/20 p-3 text-sm text-charcoal-slate outline-none focus:border-ignio-purple"
        />
      </div>

      <div aria-live="polite" className="min-h-[1.25rem] text-sm font-medium text-red-600">
        {state?.error}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 w-full rounded-full bg-ignio-purple px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? t('login.submitting') : t('login.submit')}
      </button>
    </form>
  );
}
