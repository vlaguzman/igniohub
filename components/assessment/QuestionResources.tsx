import type { Question } from '@/lib/assessment/types';
import { QuestionCard } from './QuestionCard';

export function QuestionResources({
  question,
  values,
  onChange,
}: {
  question: Question;
  values: { r1: string; r2: string; r3: string; use: string };
  onChange: (field: 'r1' | 'r2' | 'r3' | 'use', value: string) => void;
}) {
  return (
    <QuestionCard text={question.text} hint={question.hint}>
      <div className="flex flex-col gap-3">
        {(['r1', 'r2', 'r3'] as const).map((field, i) => (
          <input
            key={field}
            value={values[field]}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={`Recurso ${i + 1}`}
            className="w-full rounded-lg border border-charcoal-slate/20 p-3 text-sm text-charcoal-slate outline-none focus:border-ignio-purple"
          />
        ))}
        <textarea
          value={values.use}
          onChange={(e) => onChange('use', e.target.value)}
          rows={3}
          placeholder="¿Cómo los usarías?"
          className="w-full rounded-lg border border-charcoal-slate/20 p-3 text-sm text-charcoal-slate outline-none focus:border-ignio-purple"
        />
      </div>
    </QuestionCard>
  );
}
