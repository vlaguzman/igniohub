import { CAPN, STAGES } from '@/lib/assessment/data/capabilities';
import { levelOf } from '@/lib/assessment/engine';
import type { CapabilityKey, ComputeResult, SourceKey } from '@/lib/assessment/types';
import { RadarChart } from './RadarChart';
import { StatHeader } from './StatHeader';

const CAP_ORDER: CapabilityKey[] = ['SE', 'RE', 'OM', 'CT', 'EA', 'SA', 'LI', 'EIR'];

const SOURCE_COLOR: Record<SourceKey, string> = {
  capability: 'bg-ignio-purple',
  scenarios: 'bg-ignio-amber',
  context: 'bg-charcoal-slate/40',
};

const SOURCE_LABEL: Record<SourceKey, string> = {
  capability: 'Autopercepción',
  scenarios: 'Escenarios',
  context: 'Contexto/conducta',
};

export function ResultsCapabilities({ result }: { result: ComputeResult }) {
  const dominant = result.archs[0];
  const secondary = result.archs[1];
  const readinessLevel = levelOf(result.readiness);

  return (
    <div className="flex flex-col gap-8">
      <StatHeader
        label="Entrepreneurial Readiness Score"
        value={result.readiness === null ? '—' : `${result.readiness}/100`}
        sublabel={readinessLevel.n}
        caption={`Etapa: ${STAGES[result.stage].n} · Arquetipo dominante: ${dominant.k} · Confianza del diagnóstico: ${result.conf.level} (${result.conf.total}/100)`}
      />

      <div className="rounded-2xl border border-charcoal-slate/10 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal-slate">Mapa de capacidades</h3>
        <RadarChart
          data={CAP_ORDER.map((k) => ({ key: k, label: CAPN[k], score: result.capScore[k] }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CAP_ORDER.map((cap) => {
          const score = result.capScore[cap];
          const level = result.capLevel[cap];
          const contrib = result.contrib[cap] || {};
          return (
            <div key={cap} className="rounded-xl border border-charcoal-slate/10 bg-white p-4 shadow-sm">
              <div className="flex items-baseline justify-between">
                <h4 className="text-sm font-bold text-charcoal-slate">{CAPN[cap]}</h4>
                <span className="text-sm font-bold text-ignio-purple">{score ?? '—'}</span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-charcoal-slate/50">
                {level.n}
              </p>
              <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-ice-blue-base">
                {(['capability', 'scenarios', 'context'] as SourceKey[]).map((src) => {
                  const part = contrib[src];
                  if (!part) return null;
                  return (
                    <div
                      key={src}
                      className={SOURCE_COLOR[src]}
                      style={{ width: `${part.w}%` }}
                      title={`${SOURCE_LABEL[src]}: ${part.w}%`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
          <h4 className="text-sm font-bold text-charcoal-slate">Fortalezas principales</h4>
          <ol className="mt-3 flex flex-col gap-2 text-sm text-charcoal-slate">
            {result.strengths.length === 0 && <li className="text-charcoal-slate/50">Sin datos suficientes.</li>}
            {result.strengths.map((cap, i) => (
              <li key={cap}>
                {i + 1}. {CAPN[cap]} — {result.capScore[cap] ?? '—'}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
          <h4 className="text-sm font-bold text-charcoal-slate">Prioridades de desarrollo</h4>
          <ol className="mt-3 flex flex-col gap-2 text-sm text-charcoal-slate">
            {result.gapsTop.length === 0 && <li className="text-charcoal-slate/50">Sin datos suficientes.</li>}
            {result.gapsTop.map((cap, i) => (
              <li key={cap}>
                {i + 1}. {CAPN[cap]} — {result.capScore[cap] ?? '—'}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
        <h4 className="text-sm font-bold text-charcoal-slate">Arquetipo</h4>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ignio-purple">Dominante · {dominant.k}</p>
            <p className="mt-1 text-sm text-charcoal-slate/80">{dominant.d}</p>
          </div>
          {secondary && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-slate/50">
                Secundario · {secondary.k}
              </p>
              <p className="mt-1 text-sm text-charcoal-slate/80">{secondary.d}</p>
            </div>
          )}
        </div>
      </div>

      {result.restr.length > 0 && (
        <div className="rounded-xl border border-ignio-amber/40 bg-ignio-amber/10 p-5">
          <h4 className="text-sm font-bold text-charcoal-slate">Restricciones activas</h4>
          <ul className="mt-2 flex flex-col gap-2 text-sm text-charcoal-slate/80">
            {result.restr.map((r) => (
              <li key={r.id}>
                <span className="font-semibold">{r.label}.</span> {r.note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
