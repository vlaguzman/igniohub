import type { ComputeResult, IntensityKey } from '@/lib/assessment/types';

const LEVEL_STYLE: Record<IntensityKey, string> = {
  ninguna: 'border-charcoal-slate/10 bg-white',
  leve: 'border-charcoal-slate/20 bg-white',
  moderada: 'border-ignio-purple/40 bg-ignio-purple/5',
  alta: 'border-ignio-amber/50 bg-ignio-amber/10',
};

export function ResultsSignals({ result }: { result: ComputeResult }) {
  if (result.narratives.length === 0) {
    return (
      <div className="rounded-xl border border-charcoal-slate/10 bg-white p-6 text-sm text-charcoal-slate/70">
        No se detectaron patrones psicosociales dominantes con la evidencia disponible.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {result.narratives.map((n) => (
        <div key={n.k} className={`rounded-xl border p-5 shadow-sm ${LEVEL_STYLE[n.level]}`}>
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-charcoal-slate">{n.name}</h4>
            <span className="shrink-0 rounded-full bg-charcoal-slate/10 px-2 py-0.5 text-xs font-semibold uppercase text-charcoal-slate/70">
              {n.level}
            </span>
          </div>
          <p className="mt-2 text-sm text-charcoal-slate/80">{n.msg}</p>
          <ul className="mt-3 flex flex-col gap-1 text-xs text-charcoal-slate/60">
            {n.hits.map((h, i) => (
              <li key={i}>• {h}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
