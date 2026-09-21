import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';
import { CAPABILITY_KEYS } from '@/lib/sample-profile';

export function Capabilities() {
  const t = useTranslations('landing.capabilities');
  const locale = useLocale();

  return (
    <Section tone="white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITY_KEYS.map((key) => (
          <div
            key={key}
            className="rounded-xl border border-charcoal-slate/10 bg-ice-blue-base/50 p-5 text-center"
          >
            <h3 className="text-sm font-bold text-charcoal-slate">{t(`items.${key}.name`)}</h3>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href={`/${locale}/capabilities`}
          className="inline-block rounded-full border border-ignio-purple/30 px-6 py-3 text-sm font-semibold text-ignio-purple transition hover:bg-ignio-purple/5"
        >
          {t('cta')}
        </Link>
      </div>
    </Section>
  );
}
