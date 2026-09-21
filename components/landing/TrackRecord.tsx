import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const STAT_KEYS = ['entrepreneurs', 'years', 'cycles', 'satisfaction'] as const;

export function TrackRecord() {
  const t = useTranslations('landing.trackRecord');

  return (
    <Section tone="forest">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center" tone="amber">{t('eyebrow')}</Eyebrow>
        <SectionHeading className="text-warm-sand">{t('title')}</SectionHeading>
        <p className="mt-4 text-base text-warm-sand/80 sm:text-lg">{t('intro')}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_KEYS.map((key) => (
          <div key={key} className="rounded-xl border border-warm-sand/15 p-6 text-center">
            <p className="text-4xl font-bold text-ignio-amber">{t(`stats.${key}.value`)}</p>
            <p className="mt-2 text-sm text-warm-sand/80">{t(`stats.${key}.label`)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
