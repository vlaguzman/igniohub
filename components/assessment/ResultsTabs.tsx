'use client';

import { useRef, useState } from 'react';
import type { ComputeResult } from '@/lib/assessment/types';
import { DownloadPdfButton } from './DownloadPdfButton';
import { ResultsCapabilities } from './ResultsCapabilities';
import { ResultsConfidence } from './ResultsConfidence';
import { ResultsDiagnosis } from './ResultsDiagnosis';
import { ResultsPath } from './ResultsPath';
import { ResultsPrintView } from './ResultsPrintView';
import { ResultsSignals } from './ResultsSignals';

const TABS = [
  { key: 'capabilities', label: 'Capacidades' },
  { key: 'signals', label: 'Señales' },
  { key: 'confidence', label: 'Confianza' },
  { key: 'diagnosis', label: 'Diagnóstico' },
  { key: 'path', label: 'Ruta' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export function ResultsTabs({ result }: { result: ComputeResult }) {
  const [tab, setTab] = useState<TabKey>('capabilities');
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-slate/10 pb-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.key
                  ? 'bg-ignio-purple text-white'
                  : 'border border-charcoal-slate/20 text-charcoal-slate hover:bg-ice-blue-base/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <DownloadPdfButton targetRef={printRef} />
      </div>

      {tab === 'capabilities' && <ResultsCapabilities result={result} />}
      {tab === 'signals' && <ResultsSignals result={result} />}
      {tab === 'confidence' && <ResultsConfidence result={result} />}
      {tab === 'diagnosis' && <ResultsDiagnosis result={result} />}
      {tab === 'path' && <ResultsPath result={result} />}

      <ResultsPrintView result={result} innerRef={printRef} />
    </div>
  );
}
