import { FORM_STEPS, type StepKey } from './assessmentUtils';

export function StepIndicator({
  current,
  visited,
  progressPct,
  onJump,
}: {
  current: StepKey;
  visited: Set<StepKey>;
  progressPct: number;
  onJump: (step: StepKey) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {FORM_STEPS.map((step, i) => {
          const isCurrent = step.key === current;
          const isVisited = visited.has(step.key);
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onJump(step.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                isCurrent
                  ? 'bg-ignio-purple text-white'
                  : isVisited
                    ? 'bg-ice-blue-base text-charcoal-slate hover:bg-ice-blue-base/70'
                    : 'border border-charcoal-slate/20 text-charcoal-slate/50 hover:bg-ice-blue-base/40'
              }`}
            >
              {i + 1}. {step.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ice-blue-base">
          <div
            className="h-full rounded-full bg-ignio-purple transition-all"
            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-medium text-charcoal-slate/60">{Math.round(progressPct)}%</span>
      </div>
    </div>
  );
}
