import type { AnswerValue, Question } from '@/lib/assessment/types';
import { QuestionLikert } from './QuestionLikert';
import { QuestionOpen } from './QuestionOpen';
import { EMAIL_RE, RespondentForm } from './RespondentForm';

export type Respondent = { fullName: string; email: string };
export type SubmitState = 'idle' | 'pending' | 'error';

export function WitnessStep({
  questions,
  answers,
  onSingle,
  onOpen,
  respondent,
  onRespondentChange,
  submitState,
  onCalculate,
}: {
  questions: Question[];
  answers: Record<string, AnswerValue>;
  onSingle: (id: string, index: number) => void;
  onOpen: (id: string, text: string) => void;
  respondent: Respondent;
  onRespondentChange: (patch: Partial<Respondent>) => void;
  submitState: SubmitState;
  onCalculate: (respondent: Respondent) => void;
}) {
  const likert = questions.filter((q) => q.ds);
  const evidence = questions.filter((q) => q.evidence);
  const canSubmit =
    respondent.fullName.trim().length > 0 &&
    EMAIL_RE.test(respondent.email.trim()) &&
    submitState !== 'pending';

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

      <RespondentForm
        fullName={respondent.fullName}
        email={respondent.email}
        onFullNameChange={(v) => onRespondentChange({ fullName: v })}
        onEmailChange={(v) => onRespondentChange({ email: v })}
      />

      <button
        type="button"
        onClick={() => onCalculate(respondent)}
        disabled={!canSubmit}
        className="mt-2 rounded-full bg-ignio-purple px-8 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Calcular diagnóstico
      </button>
    </div>
  );
}
