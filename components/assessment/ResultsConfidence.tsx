import type { ComputeResult } from '@/lib/assessment/types';
import { StatHeader } from './StatHeader';

const STATUS_STYLE: Record<string, string> = {
  ok: 'bg-ignio-purple',
  alert: 'bg-ignio-amber',
  na: 'bg-charcoal-slate/20',
};

const STATUS_LABEL: Record<string, string> = {
  ok: 'Sin contradicción',
  alert: 'Atención',
  na: 'Sin datos suficientes',
};

export function ResultsConfidence({ result }: { result: ComputeResult }) {
  const { conf, checks } = result;

  return (
    <div className="flex flex-col gap-8">
      <StatHeader label="Confianza del diagnóstico" value={`${conf.total}/100`} sublabel={conf.level} caption={conf.msg} />

      <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
        <h4 className="text-sm font-bold text-charcoal-slate">Desglose</h4>
        <div className="mt-3 flex flex-col gap-3">
          {conf.parts.map((p) => (
            <div key={p.n}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-charcoal-slate">{p.n}</span>
                <span className="font-semibold text-charcoal-slate">
                  {p.v}/{p.max}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ice-blue-base">
                <div
                  className="h-full rounded-full bg-ignio-purple"
                  style={{ width: `${p.max > 0 ? Math.max(0, (p.v / p.max) * 100) : 0}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-charcoal-slate/60">{p.d}</p>
            </div>
          ))}
        </div>
      </div>

      {conf.pens.length > 0 && (
        <div className="rounded-xl border border-ignio-amber/40 bg-ignio-amber/10 p-5">
          <h4 className="text-sm font-bold text-charcoal-slate">Penalizaciones</h4>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-charcoal-slate/80">
            {conf.pens.map((p, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{p.n}</span>
                <span className="font-semibold">{p.v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
        <h4 className="text-sm font-bold text-charcoal-slate">Testigos de consistencia interna</h4>
        <ul className="mt-3 flex flex-col gap-3">
          {checks.map((c) => (
            <li key={c.id} className="flex items-start gap-3">
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_STYLE[c.status]}`} />
              <div>
                <p className="text-sm font-semibold text-charcoal-slate">
                  {c.n} <span className="font-normal text-charcoal-slate/50">({STATUS_LABEL[c.status]})</span>
                </p>
                <p className="text-xs text-charcoal-slate/60">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
