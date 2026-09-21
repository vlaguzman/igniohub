import { CAPN } from '@/lib/assessment/data/capabilities';
import type { ComputeResult } from '@/lib/assessment/types';

export function ResultsPath({ result }: { result: ComputeResult }) {
  const showLegalWarning =
    result.path.some((item) => item.legal) && result.restr.some((r) => r.kind === 'critico');

  return (
    <div className="flex flex-col gap-6">
      {showLegalWarning && (
        <div className="rounded-xl border border-ignio-amber/40 bg-ignio-amber/10 p-5 text-sm text-charcoal-slate">
          Tu situación legal debe aclararse antes de cualquier ejecución empresarial formal. Prioriza el recurso de
          orientación legal antes de avanzar con el resto de la ruta.
        </div>
      )}

      {result.path.length === 0 ? (
        <div className="rounded-xl border border-charcoal-slate/10 bg-white p-6 text-sm text-charcoal-slate/70">
          Completa más del instrumento para generar recomendaciones de ruta.
        </div>
      ) : (
        <ol className="flex flex-col gap-4">
          {result.path.map((item, i) => (
            <li key={item.n} className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ignio-purple text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-charcoal-slate">{item.n}</h4>
                  <p className="mt-1 text-xs text-charcoal-slate/60">
                    {item.fmt} · {item.dur} · {item.lvl} · {CAPN[item.cap]}
                    {item.cap2 ? ` + ${CAPN[item.cap2]}` : ''}
                  </p>
                  <ul className="mt-3 flex flex-col gap-1 text-sm text-charcoal-slate/80">
                    {item.why.map((w, j) => (
                      <li key={j}>• {w}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-charcoal-slate">
                    <span className="font-semibold">Resultado esperado:</span> {item.out}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
