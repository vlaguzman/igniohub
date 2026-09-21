import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

export function AhaMoment() {
  const t = useTranslations('landing.ahaMoment');

  return (
    <Section tone="ice">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
        <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('subhead')}</p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ignio-purple">
              {t('strongest.label')}
            </p>
            <p className="mt-1 text-lg font-bold text-charcoal-slate">{t('strongest.value')}</p>
            <p className="mt-1 text-sm text-charcoal-slate/70">{t('strongest.note')}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ignio-amber">
              {t('opportunity.label')}
            </p>
            <p className="mt-1 text-lg font-bold text-charcoal-slate">{t('opportunity.value')}</p>
            <p className="mt-1 text-sm text-charcoal-slate/70">{t('opportunity.note')}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-charcoal-slate/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-slate/60">
            {t('nextStep.label')}
          </p>
          <p className="mt-1 text-base text-charcoal-slate">{t('nextStep.value')}</p>
        </div>

        <p className="mt-6 text-xs italic text-charcoal-slate/60">{t('disclaimer')}</p>
      </div>
    </Section>
  );
}
