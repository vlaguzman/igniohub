import { useTranslations } from 'next-intl';
import { Section, Eyebrow, SectionHeading } from './Section';

const SEGMENT_KEYS = ['programmes', 'education', 'workforce', 'organisations'] as const;

export function ForOrganisations() {
  const t = useTranslations('landing.forOrganisations');
  const tCommon = useTranslations('common');

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

      {/*
        NOTE: there is no real contact channel yet (no form, no inbox to
        route to). Rendering this as a non-navigating button rather than a
        link to a fabricated mailto: or a self-referencing anchor — it needs
        a real destination (contact form, mailto:, or booking link) wired up
        before launch. See report for details.
      */}
      <div className="mt-10 text-center">
        <button
          type="button"
          title={tCommon('comingSoon')}
          className="inline-block cursor-not-allowed rounded-full bg-ignio-purple px-6 py-3 text-sm font-semibold text-white opacity-90"
        >
          {t('cta')}
        </button>
      </div>
    </Section>
  );
}
