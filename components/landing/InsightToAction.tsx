import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const FLOW_KEYS = ['profile', 'priorities', 'plan', 'progress'] as const;
const EXAMPLE_KEYS = ['priority', 'focus', 'activity', 'reassess'] as const;

export function InsightToAction() {
  const t = useTranslations('landing.insightToAction');

  return (
    <Section tone="sand">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
        <p className="mt-4 text-base text-charcoal-slate/80 sm:text-lg">{t('body')}</p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-4">
        {FLOW_KEYS.map((key, index) => (
          <div key={key} className="rounded-xl bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold text-ignio-purple">{index + 1}</span>
            <h3 className="mt-1 text-base font-bold text-charcoal-slate">{t(`flow.${key}.name`)}</h3>
            <p className="mt-2 text-sm text-charcoal-slate/80">{t(`flow.${key}.description`)}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-ignio-purple/20 bg-white p-6">
        <ul className="space-y-2 text-sm text-charcoal-slate">
          {EXAMPLE_KEYS.map((key) => (
            <li key={key}>{t(`example.${key}`)}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
