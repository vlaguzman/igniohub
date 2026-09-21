import type { ReactNode } from 'react';

export function CapabilityGroup({
  capHead,
  capDesc,
  children,
}: {
  capHead?: string;
  capDesc?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      {capHead && (
        <div className="rounded-xl bg-ice-blue-base/50 px-4 py-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ignio-purple">{capHead}</h3>
          {capDesc && <p className="mt-1 text-sm text-charcoal-slate/70">{capDesc}</p>}
        </div>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
