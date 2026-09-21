import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const ROW_KEYS = ['focus', 'outcome', 'interpretation', 'orientation', 'result'] as const;

export function Comparison() {
  const t = useTranslations('landing.comparison');

  return (
    <Section tone="sand">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
        <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('intro')}</p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-charcoal-slate/10">
        <div className="hidden grid-cols-3 gap-4 bg-charcoal-slate/5 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-charcoal-slate/60 sm:grid">
          <span />
          <span>{t('columns.traditional')}</span>
          <span className="text-ignio-purple">{t('columns.ignio')}</span>
        </div>

        <div className="divide-y divide-charcoal-slate/10 bg-white">
          {ROW_KEYS.map((key) => (
            <div key={key} className="grid gap-2 px-5 py-4 sm:grid-cols-3 sm:gap-4 sm:py-5">
              <p className="text-sm font-semibold text-charcoal-slate">{t(`rows.${key}.label`)}</p>
              <p className="text-sm text-charcoal-slate/70">
                <span className="mr-2 font-semibold uppercase tracking-wide text-charcoal-slate/40 sm:hidden">
                  {t('columns.traditional')}:
                </span>
                {t(`rows.${key}.traditional`)}
              </p>
              <p className="text-sm font-medium text-charcoal-slate">
                <span className="mr-2 font-semibold uppercase tracking-wide text-ignio-purple/60 sm:hidden">
                  {t('columns.ignio')}:
                </span>
                {t(`rows.${key}.ignio`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-base font-semibold text-charcoal-slate">
        {t('closing')}
      </p>
    </Section>
  );
}
