import type { AnswerValue, Question } from '@/lib/assessment/types';
import { QuestionLikert } from './QuestionLikert';
import { QuestionOpen } from './QuestionOpen';

export function WitnessStep({
  questions,
  answers,
  onSingle,
  onOpen,
  onCalculate,
}: {
  questions: Question[];
  answers: Record<string, AnswerValue>;
  onSingle: (id: string, index: number) => void;
  onOpen: (id: string, text: string) => void;
  onCalculate: () => void;
}) {
  const likert = questions.filter((q) => q.ds);
  const evidence = questions.filter((q) => q.evidence);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-charcoal-slate/70">
        Estas preguntas no puntúan capacidades directamente. Sirven para calcular qué tan confiable es el
        diagnóstico.
      </p>

      <div className="flex flex-col gap-4">
        {likert.map((q) => (
          <QuestionLikert
            key={q.id}
            question={q}
            value={answers[q.id] as number | undefined}
            onChange={(i) => onSingle(q.id, i)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {evidence.map((q) => (
          <QuestionOpen
            key={q.id}
            question={q}
            value={answers[q.id] as string | undefined}
            onChange={(t) => onOpen(q.id, t)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onCalculate}
        className="mt-2 rounded-full bg-ignio-purple px-8 py-4 text-base font-semibold text-white transition hover:opacity-90"
      >
        Calcular diagnóstico
      </button>
    </div>
  );
}
