import type { ReactNode } from 'react';

export function QuestionCard({
  text,
  hint,
  children,
}: {
  text: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
      <p className="text-base font-semibold text-charcoal-slate">{text}</p>
      {hint && <p className="mt-1 text-sm text-charcoal-slate/60">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function RadioRow({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-charcoal-slate/10 p-3 text-sm text-charcoal-slate transition hover:bg-ice-blue-base/40 has-[:checked]:border-ignio-purple has-[:checked]:bg-ignio-purple/5">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 accent-ignio-purple"
      />
      <span>{label}</span>
    </label>
  );
}

export function CheckboxRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-charcoal-slate/10 p-3 text-sm text-charcoal-slate transition hover:bg-ice-blue-base/40 has-[:checked]:border-ignio-purple has-[:checked]:bg-ignio-purple/5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 accent-ignio-purple"
      />
      <span>{label}</span>
    </label>
  );
}
