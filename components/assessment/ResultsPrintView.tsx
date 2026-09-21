import type { RefObject } from 'react';
import type { ComputeResult } from '@/lib/assessment/types';
import { ResultsCapabilities } from './ResultsCapabilities';
import { ResultsConfidence } from './ResultsConfidence';
import { ResultsDiagnosis } from './ResultsDiagnosis';
import { ResultsPath } from './ResultsPath';
import { ResultsSignals } from './ResultsSignals';

const SECTIONS = [
  { key: 'capabilities', label: 'Capacidades', Comp: ResultsCapabilities },
  { key: 'signals', label: 'Señales psicosociales', Comp: ResultsSignals },
  { key: 'confidence', label: 'Confianza y testigos', Comp: ResultsConfidence },
  { key: 'diagnosis', label: 'Diagnóstico', Comp: ResultsDiagnosis },
  { key: 'path', label: 'Ruta recomendada', Comp: ResultsPath },
] as const;

/**
 * Off-screen, always-fully-rendered version of the results dashboard (all
 * five sections stacked, not tabbed) used purely as the capture source for
 * PDF export. The on-screen ResultsTabs only ever mounts the active tab, so
 * it can't be captured directly — this gives html2canvas something
 * complete to snapshot. Kept at a fixed width so the exported PDF looks the
 * same regardless of the viewer's actual screen size.
 */
export function ResultsPrintView({
  result,
  innerRef,
}: {
  result: ComputeResult;
  innerRef: RefObject<HTMLDivElement>;
}) {
  const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="pointer-events-none fixed left-[-9999px] top-0" aria-hidden="true">
      <div ref={innerRef} className="w-[820px] bg-white p-10 text-charcoal-slate">
        <div className="mb-8 flex items-center justify-between border-b border-charcoal-slate/10 pb-6">
          {/* Plain <img>, not next/image — html2canvas can't reliably capture
              Next's optimized/lazy image pipeline. */}
          <img src="/brand/logo-full.png" alt="Ignio" width={140} height={65} />
          <div className="text-right">
            <p className="text-sm font-semibold text-charcoal-slate">Resultados del diagnóstico</p>
            <p className="text-xs text-charcoal-slate/60">{today}</p>
          </div>
        </div>

        <p className="mb-8 text-xs text-charcoal-slate/50">
          Diagnóstico de preparación emprendedora · Documento generado automáticamente a partir de tus
          respuestas.
        </p>

        <div className="flex flex-col gap-12">
          {SECTIONS.map(({ key, label, Comp }) => (
            <div key={key}>
              <h2 className="mb-4 border-b border-charcoal-slate/10 pb-2 text-lg font-bold text-ignio-purple">
                {label}
              </h2>
              <Comp result={result} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
