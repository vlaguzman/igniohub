'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

function withLocale(pathname: string, locale: string) {
  const segments = pathname.split('/');
  // segments[0] is '' (leading slash), segments[1] is the current locale prefix.
  segments[1] = locale;
  return segments.join('/') || '/';
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className={`flex items-center gap-1 text-sm font-semibold ${className}`}>
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-charcoal-slate/30">/</span>}
          <Link
            href={withLocale(pathname, loc)}
            aria-current={loc === locale ? 'true' : undefined}
            className={
              loc === locale
                ? 'text-ignio-purple'
                : 'text-charcoal-slate/60 transition hover:text-charcoal-slate'
            }
          >
            {loc.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
