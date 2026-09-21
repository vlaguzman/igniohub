import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const SEGMENT_KEYS = ['programmes', 'incubators', 'diaspora', 'economicIntegration'] as const;

export function ForOrganisations() {
  const t = useTranslations('landing.forOrganisations');
  const locale = useLocale();

  return (
    <Section id="organisations" tone="ice">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
        <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('body')}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {SEGMENT_KEYS.map((key) => (
          <div key={key} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-charcoal-slate">{t(`segments.${key}`)}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href={`/${locale}/organizations`}
          className="inline-block rounded-full bg-ignio-purple px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {t('cta')}
        </Link>
      </div>
    </Section>
  );
}
