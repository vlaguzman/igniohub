import type { Question } from '@/lib/assessment/types';
import { QuestionCard } from './QuestionCard';

export function QuestionOpen({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | undefined;
  onChange: (text: string) => void;
}) {
  return (
    <QuestionCard text={question.text} hint={question.hint}>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-charcoal-slate/20 p-3 text-sm text-charcoal-slate outline-none focus:border-ignio-purple"
        placeholder="Escribe tu respuesta…"
      />
    </QuestionCard>
  );
}
