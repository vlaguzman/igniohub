import type { ReactNode } from 'react';

type SectionTone = 'sand' | 'ice' | 'white' | 'forest';

const TONE_CLASSES: Record<SectionTone, string> = {
  sand: 'bg-warm-sand',
  ice: 'bg-ice-blue-base',
  white: 'bg-white',
  forest: 'bg-deep-forest text-warm-sand',
};

export function Section({
  id,
  tone = 'white',
  className = '',
  innerClassName = '',
  children,
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${TONE_CLASSES[tone]} ${id ? 'scroll-mt-20' : ''} ${className}`}>
      <div className={`mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

const EYEBROW_TONE_CLASSES = {
  purple: 'text-ignio-purple',
  amber: 'text-ignio-amber',
} as const;

export function Eyebrow({
  children,
  className = '',
  tone = 'purple',
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof EYEBROW_TONE_CLASSES;
}) {
  return (
    <p className={`mb-3 text-sm font-semibold uppercase tracking-wide ${EYEBROW_TONE_CLASSES[tone]} ${className}`}>
      {children}
    </p>
  );
}

export function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-3xl font-bold text-charcoal-slate sm:text-4xl ${className}`}>{children}</h2>
  );
}
