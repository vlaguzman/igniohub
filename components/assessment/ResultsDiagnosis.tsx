import { CAPN, STAGES } from '@/lib/assessment/data/capabilities';
import type { CapabilityKey, ComputeResult } from '@/lib/assessment/types';

function priorityLabel(cap: CapabilityKey, result: ComputeResult): string {
  if (result.critical.includes(cap)) return 'Brecha crítica';
  if (result.strategic.includes(cap)) return 'Prioridad estratégica en tu etapa';
  return 'Oportunidad de refuerzo';
}

export function ResultsDiagnosis({ result }: { result: ComputeResult }) {
  const { strengths, gapsTop } = result;
  const hasData = strengths.length > 0 && result.readiness !== null;

  const summary = hasData
    ? `Estás en la etapa "${STAGES[result.stage].n}". Tu capacidad más fuerte hoy es ${CAPN[strengths[0]]} (${result.capScore[strengths[0]]}), y tu principal prioridad de desarrollo es ${CAPN[gapsTop[0]]} (${result.capScore[gapsTop[0]] ?? '—'}). ${result.conf.msg}`
    : 'Todavía no hay suficientes respuestas para generar un diagnóstico. Completa más preguntas de los bloques anteriores para obtener una síntesis.';

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-charcoal-slate/10 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal-slate">Síntesis</h3>
        <p className="mt-3 text-sm leading-relaxed text-charcoal-slate/80">{summary}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
          <h4 className="text-sm font-bold text-charcoal-slate">Fortalezas</h4>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-charcoal-slate">
            {strengths.length === 0 && <li className="text-charcoal-slate/50">Sin datos suficientes.</li>}
            {strengths.map((cap) => (
              <li key={cap}>
                <span className="font-semibold">{CAPN[cap]}</span> — {result.capScore[cap] ?? '—'}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
          <h4 className="text-sm font-bold text-charcoal-slate">Desarrollo prioritario</h4>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-charcoal-slate">
            {gapsTop.length === 0 && <li className="text-charcoal-slate/50">Sin datos suficientes.</li>}
            {gapsTop.map((cap) => (
              <li key={cap}>
                <span className="font-semibold">{CAPN[cap]}</span> — {result.capScore[cap] ?? '—'}
                <span className="ml-2 text-xs uppercase tracking-wide text-charcoal-slate/50">
                  {priorityLabel(cap, result)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
