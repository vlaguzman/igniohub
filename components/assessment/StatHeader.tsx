export function StatHeader({
  label,
  value,
  sublabel,
  caption,
}: {
  label: string;
  value: string;
  sublabel?: string;
  caption?: string;
}) {
  return (
    <div className="rounded-2xl bg-deep-forest p-6 text-warm-sand sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-warm-sand/70">{label}</p>
      <p className="mt-2 text-4xl font-bold sm:text-5xl">{value}</p>
      {sublabel && <p className="mt-1 text-lg font-semibold text-ignio-amber">{sublabel}</p>}
      {caption && <p className="mt-3 max-w-2xl text-sm text-warm-sand/80">{caption}</p>}
    </div>
  );
}
