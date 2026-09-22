'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { createAssessmentEngine } from '@/lib/assessment/engine';
import {
  FORM_STEPS,
  activeScenarios,
  countableStepQuestions,
  isQuestionAnswered,
  questionsForStep,
  stageOf,
  type StepKey,
} from './assessmentUtils';
import { FormStep } from './FormStep';
import { ResultsTabs } from './ResultsTabs';
import { ScenariosStep } from './ScenariosStep';
import { StepIndicator } from './StepIndicator';
import { WitnessStep, type Respondent, type SubmitState } from './WitnessStep';

export function AssessmentApp({ locale }: { locale: string }) {
  const engineRef = useRef(createAssessmentEngine());
  const [tick, setTick] = useState(0);
  const [step, setStep] = useState<StepKey>('b1a');
  const [visited, setVisited] = useState<Set<StepKey>>(new Set<StepKey>(['b1a']));
  const [showResults, setShowResults] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [respondent, setRespondent] = useState<Respondent>({ fullName: '', email: '' });
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  // Order is load-bearing (D3/D4): the local compute() result must render
  // BEFORE the network call is even attempted, so a DB outage never traps
  // the respondent at the last step. The POST is fire-and-await off the
  // render path — its outcome only adds a share link or an inline retry.
  const handleCalculate = async (info: Respondent) => {
    setRespondent(info);
    setShowResults(true);
    setSavedId(null);
    setSubmitState('pending');

    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: info.fullName,
          email: info.email,
          state: engineRef.current.getState(),
        }),
      });
      if (!res.ok) throw new Error('submit_failed');
      const data = (await res.json()) as { id: string };
      setSavedId(data.id);
      setSubmitState('idle');
    } catch {
      setSubmitState('error');
    }
  };

  const shareHref = savedId ? `/${locale}/assessment/results/${savedId}` : null;

  const handleCopyLink = async () => {
    if (!shareHref) return;
    const url = `${window.location.origin}${shareHref}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the link text
      // is still visible/selectable in the affordance below.
    }
  };

  const engine = engineRef.current;
  const state = engine.getState();
  const bump = () => setTick((t) => t + 1);

  const stage = stageOf(state);
  const scenarios = useMemo(() => activeScenarios(stage), [stage]);

  const stepIndex = FORM_STEPS.findIndex((s) => s.key === step);

  const goToStep = (s: StepKey) => {
    setStep(s);
    setVisited((v) => new Set(v).add(s));
  };
  const goNext = () => {
    const next = FORM_STEPS[stepIndex + 1];
    if (next) goToStep(next.key);
  };
  const goPrev = () => {
    const prev = FORM_STEPS[stepIndex - 1];
    if (prev) goToStep(prev.key);
  };

  const countable = countableStepQuestions();
  const total = countable.length + scenarios.length;
  const answeredCount =
    countable.filter((q) => isQuestionAnswered(q, state)).length +
    scenarios.filter((sc) => !!state.scn[sc.id]?.most).length;
  const progressPct = total > 0 ? (answeredCount / total) * 100 : 0;

  // Only computed when the results view is actually shown — recomputes on
  // every subsequent tick while results are visible, which is fine given
  // the small data size, but never computed and discarded on step-only
  // views.
  const result = useMemo(() => (showResults ? engineRef.current.compute() : null), [showResults, tick]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-charcoal-slate/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center px-4 py-3 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="flex shrink-0 items-center">
            <Image
              src="/brand/logo-full.png"
              alt="Ignio"
              width={663}
              height={310}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {locale === 'en' && !bannerDismissed && (
        <div className="mb-6 flex items-start justify-between gap-3 rounded-lg border border-ignio-amber/40 bg-ignio-amber/10 p-4 text-sm text-charcoal-slate">
          <p>This assessment is currently available in Spanish only. An English version is coming soon.</p>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss"
            className="shrink-0 text-lg leading-none text-charcoal-slate/50 hover:text-charcoal-slate"
          >
            ×
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold text-charcoal-slate sm:text-3xl">Diagnóstico de preparación emprendedora</h1>

      {!showResults && (
        <>
          <div className="mt-6">
            <StepIndicator current={step} visited={visited} progressPct={progressPct} onJump={goToStep} />
          </div>

          {step !== 'b3' && step !== 'wit' && (
            <FormStep
              questions={questionsForStep(step)}
              answers={state.answers}
              resources={state.res}
              onSingle={(id, i) => {
                engine.setAnswer(id, i);
                bump();
              }}
              onMulti={(id, idx) => {
                engine.setAnswer(id, idx);
                bump();
              }}
              onOpen={(id, t) => {
                engine.setAnswer(id, t);
                bump();
              }}
              onResource={(f, v) => {
                engine.setResource(f, v);
                bump();
              }}
            />
          )}

          {step === 'b3' && (
            <ScenariosStep
              scenarios={scenarios}
              scn={state.scn}
              onMost={(id, k) => {
                const current = state.scn[id];
                engine.setScenario(id, { most: k, least: current?.least === k ? undefined : current?.least });
                bump();
              }}
              onLeast={(id, k) => {
                const current = state.scn[id];
                engine.setScenario(id, { least: k, most: current?.most === k ? undefined : current?.most });
                bump();
              }}
              onWhy={(id, t) => {
                engine.setScenario(id, { why: t });
                bump();
              }}
            />
          )}

          {step === 'wit' && (
            <WitnessStep
              questions={questionsForStep('wit')}
              answers={state.answers}
              onSingle={(id, i) => {
                engine.setAnswer(id, i);
                bump();
              }}
              onOpen={(id, t) => {
                engine.setAnswer(id, t);
                bump();
              }}
              respondent={respondent}
              onRespondentChange={(patch) => setRespondent((r) => ({ ...r, ...patch }))}
              submitState={submitState}
              onCalculate={handleCalculate}
            />
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrev}
              disabled={stepIndex === 0}
              className="rounded-full border border-charcoal-slate/20 px-6 py-2.5 text-sm font-semibold text-charcoal-slate transition hover:bg-ice-blue-base/40 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Anterior
            </button>
            {step !== 'wit' && (
              <button
                type="button"
                onClick={goNext}
                className="rounded-full bg-ignio-purple px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Siguiente
              </button>
            )}
          </div>
        </>
      )}

      {showResults && result && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowResults(false)}
            className="mb-6 text-sm font-semibold text-ignio-purple hover:underline"
          >
            ← Volver a editar respuestas
          </button>

          {submitState === 'error' && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ignio-amber/40 bg-ignio-amber/10 p-4 text-sm text-charcoal-slate">
              <p>No pudimos guardar tu diagnóstico, pero tus resultados están listos abajo.</p>
              <button
                type="button"
                onClick={() => handleCalculate(respondent)}
                className="shrink-0 rounded-full bg-ignio-purple px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Reintentar
              </button>
            </div>
          )}

          {savedId && shareHref && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-charcoal-slate/10 bg-ice-blue-base/30 p-4 text-sm text-charcoal-slate">
              <p className="break-all">
                Guarda este enlace para volver a ver tu diagnóstico:{' '}
                <span className="font-mono">{shareHref}</span>
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 rounded-full border border-charcoal-slate/20 px-4 py-2 text-sm font-semibold text-charcoal-slate transition hover:bg-ice-blue-base/50"
              >
                {copyState === 'copied' ? 'Copiado ✓' : 'Copiar enlace'}
              </button>
            </div>
          )}

          <ResultsTabs result={result} />
        </div>
      )}
      </main>
    </div>
  );
}
