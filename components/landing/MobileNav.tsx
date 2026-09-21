'use client';

import { useState } from 'react';
import Link from 'next/link';

type NavItem = { href: string; label: string };

export function MobileNav({
  links,
  assessmentHref,
  assessmentLabel,
  toggleLabel,
}: {
  links: NavItem[];
  assessmentHref: string;
  assessmentLabel: string;
  toggleLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={toggleLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md border border-charcoal-slate/20"
      >
        <span className="h-0.5 w-5 bg-charcoal-slate" />
        <span className="h-0.5 w-5 bg-charcoal-slate" />
        <span className="h-0.5 w-5 bg-charcoal-slate" />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 flex w-56 flex-col gap-1 rounded-lg border border-charcoal-slate/10 bg-white p-3 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2 text-sm font-medium text-charcoal-slate hover:bg-ice-blue-base"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={assessmentHref}
            onClick={() => setOpen(false)}
            className="mt-1 rounded-full bg-ignio-purple px-4 py-2 text-center text-sm font-semibold text-white"
          >
            {assessmentLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
