import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';
import { CAPABILITY_KEYS, SAMPLE_SCORES } from '@/lib/sample-profile';

export function WhatYouGet() {
  const t = useTranslations('landing');
  const tGet = useTranslations('landing.whatYouGet');

  return (
    <Section id="product" tone="ice">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{tGet('eyebrow')}</Eyebrow>
        <SectionHeading>{tGet('title')}</SectionHeading>
        <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{tGet('subhead')}</p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <p className="mb-5 text-sm font-semibold text-charcoal-slate">{tGet('profileLabel')}</p>
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {CAPABILITY_KEYS.map((key) => (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs text-charcoal-slate/70">
                <span>{t(`capabilities.items.${key}.name`)}</span>
                <span className="font-semibold text-charcoal-slate">{SAMPLE_SCORES[key]}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-ice-blue-base">
                <div
                  className="h-full rounded-full bg-ignio-purple"
                  style={{ width: `${SAMPLE_SCORES[key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 border-t border-charcoal-slate/10 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ignio-purple">
              {tGet('strongest.label')}
            </p>
            <p className="mt-1 text-lg font-bold text-charcoal-slate">{tGet('strongest.value')}</p>
            <p className="mt-1 text-sm text-charcoal-slate/70">{tGet('strongest.note')}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ignio-amber">
              {tGet('opportunity.label')}
            </p>
            <p className="mt-1 text-lg font-bold text-charcoal-slate">{tGet('opportunity.value')}</p>
            <p className="mt-1 text-sm text-charcoal-slate/70">{tGet('opportunity.note')}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-charcoal-slate/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-slate/60">
            {tGet('nextStep.label')}
          </p>
          <p className="mt-1 text-base text-charcoal-slate">{tGet('nextStep.value')}</p>
        </div>

        <p className="mt-6 text-xs italic text-charcoal-slate/60">{tGet('disclaimer')}</p>
      </div>
    </Section>
  );
}
