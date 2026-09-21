import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const MEMBER_KEYS = ['diana', 'andres', 'vladimir'] as const;

export function Team() {
  const t = useTranslations('landing.team');

  return (
    <Section id="about" tone="white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="text-center">{t('eyebrow')}</Eyebrow>
        <SectionHeading>{t('title')}</SectionHeading>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {MEMBER_KEYS.map((key) => (
          <div key={key} className="rounded-xl border border-charcoal-slate/10 bg-ice-blue-base/40 p-6">
            <h3 className="text-lg font-bold text-charcoal-slate">{t(`members.${key}.name`)}</h3>
            <p className="mt-1 text-sm font-semibold text-ignio-purple">{t(`members.${key}.role`)}</p>
            <p className="mt-3 text-sm text-charcoal-slate/80">{t(`members.${key}.bio`)}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-base font-semibold text-charcoal-slate">
        {t('closing')}
      </p>
    </Section>
  );
}
