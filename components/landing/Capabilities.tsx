import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';
import { RadarChart } from '@/components/shared/RadarChart';
import { CAPABILITY_KEYS, SAMPLE_SCORES } from '@/lib/sample-profile';

export function Capabilities() {
  const t = useTranslations('landing.capabilities');
  const locale = useLocale();

  return (
    <Section tone="white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
      </div>

      <div className="mx-auto mt-10 rounded-2xl border border-charcoal-slate/10 bg-white p-6 shadow-sm sm:p-8">
        <RadarChart
          data={CAPABILITY_KEYS.map((key) => ({
            key,
            label: t(`items.${key}.name`),
            score: SAMPLE_SCORES[key],
          }))}
        />
        <p className="mt-4 text-center text-xs italic text-charcoal-slate/60">{t('disclaimer')}</p>
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
