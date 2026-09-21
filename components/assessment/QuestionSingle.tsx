import type { Question } from '@/lib/assessment/types';
import { QuestionCard, RadioRow } from './QuestionCard';

export function QuestionSingle({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: number | undefined;
  onChange: (index: number) => void;
}) {
  return (
    <QuestionCard text={question.text} hint={question.hint}>
      <div className="flex flex-col gap-2">
        {question.options?.map((opt, i) => (
          <RadioRow
            key={opt.k || i}
            name={question.id}
            checked={value === i}
            onChange={() => onChange(i)}
            label={opt.t}
          />
        ))}
      </div>
    </QuestionCard>
  );
}
