import type { Scenario, ScenarioAnswer } from '@/lib/assessment/types';
import { ScenarioCard } from './ScenarioCard';

export function ScenariosStep({
  scenarios,
  scn,
  onMost,
  onLeast,
  onWhy,
}: {
  scenarios: Scenario[];
  scn: Record<string, ScenarioAnswer>;
  onMost: (scenarioId: string, key: string) => void;
  onLeast: (scenarioId: string, key: string) => void;
  onWhy: (scenarioId: string, text: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-charcoal-slate/70">
        Para cada situación, marca la opción que más se parece a lo que harías (más probable) y la que menos se
        parece (menos probable).
      </p>
      {scenarios.map((sc) => (
        <ScenarioCard
          key={sc.id}
          scenario={sc}
          most={scn[sc.id]?.most}
          least={scn[sc.id]?.least}
          why={scn[sc.id]?.why || ''}
          onMost={(k) => onMost(sc.id, k)}
          onLeast={(k) => onLeast(sc.id, k)}
          onWhy={(t) => onWhy(sc.id, t)}
        />
      ))}
    </div>
  );
}
