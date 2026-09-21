import type { Scenario } from '@/lib/assessment/types';

export function ScenarioCard({
  scenario,
  most,
  least,
  why,
  onMost,
  onLeast,
  onWhy,
}: {
  scenario: Scenario;
  most: string | undefined;
  least: string | undefined;
  why: string;
  onMost: (key: string) => void;
  onLeast: (key: string) => void;
  onWhy: (text: string) => void;
}) {
  return (
    <div className="rounded-xl border border-charcoal-slate/10 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-ignio-purple">{scenario.title}</h3>
      <p className="mt-2 text-base font-medium text-charcoal-slate">{scenario.situation}</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-charcoal-slate/50">
              <th className="w-1/2 pb-2 pr-2">Opción</th>
              <th className="pb-2 text-center">Más probable</th>
              <th className="pb-2 text-center">Menos probable</th>
            </tr>
          </thead>
          <tbody>
            {scenario.options.map((opt) => (
              <tr key={opt.k} className="border-t border-charcoal-slate/10">
                <td className="py-2 pr-2 text-charcoal-slate">{opt.t}</td>
                <td className="py-2 text-center">
                  <input
                    type="radio"
                    name={`${scenario.id}-most`}
                    checked={most === opt.k}
                    onChange={() => onMost(opt.k)}
                    disabled={least === opt.k}
                    className="h-4 w-4 accent-ignio-purple disabled:opacity-30"
                  />
                </td>
                <td className="py-2 text-center">
                  <input
                    type="radio"
                    name={`${scenario.id}-least`}
                    checked={least === opt.k}
                    onChange={() => onLeast(opt.k)}
                    disabled={most === opt.k}
                    className="h-4 w-4 accent-ignio-amber disabled:opacity-30"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <label className="text-xs font-medium text-charcoal-slate/60">
          ¿Por qué? (opcional, solo para tu propia reflexión — no afecta el resultado)
        </label>
        <textarea
          value={why}
          onChange={(e) => onWhy(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-charcoal-slate/20 p-3 text-sm text-charcoal-slate outline-none focus:border-ignio-purple"
        />
      </div>
    </div>
  );
}
