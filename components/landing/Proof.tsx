import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const STAT_KEYS = ['entrepreneurs', 'years', 'cycles', 'satisfaction'] as const;
const INSTITUTION_KEYS = ['cancilleria', 'consulado', 'colombiaNosUne', 'procolombia'] as const;

export function Proof() {
  const t = useTranslations('landing.proof');

  return (
    <Section tone="forest">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center" tone="amber">
          {t('eyebrow')}
        </Eyebrow>
        <SectionHeading className="text-warm-sand">{t('title')}</SectionHeading>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_KEYS.map((key) => (
          <div key={key} className="rounded-xl border border-warm-sand/15 p-6 text-center">
            <p className="text-4xl font-bold text-ignio-amber">{t(`stats.${key}.value`)}</p>
            <p className="mt-2 text-sm text-warm-sand/80">{t(`stats.${key}.label`)}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-warm-sand/80">{t('trustFraming')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INSTITUTION_KEYS.map((key) => (
          <div
            key={key}
            className="flex min-h-[88px] items-center justify-center rounded-xl border border-warm-sand/15 p-5 text-center"
          >
            <p className="text-sm font-semibold text-warm-sand">{t(`institutions.${key}`)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
