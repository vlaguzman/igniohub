import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Section } from './Section';

export function FinalCta() {
  const t = useTranslations('landing.finalCta');
  const locale = useLocale();

  return (
    <Section tone="forest">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-warm-sand sm:text-4xl">{t('title')}</h2>
        <p className="mt-4 text-base text-warm-sand/80 sm:text-lg">{t('subhead')}</p>
        <Link
          href={`/${locale}/assessment`}
          className="mt-8 inline-block rounded-full bg-ignio-amber px-8 py-3 text-sm font-semibold text-charcoal-slate transition hover:opacity-90"
        >
          {t('cta')}
        </Link>
        <p className="mt-6 text-sm text-warm-sand/70">
          <a href="#organisations" className="underline underline-offset-2 hover:text-warm-sand">
            {t('secondary')}
          </a>
        </p>
      </div>
    </Section>
  );
}
