import { DS_SCALE } from '@/lib/assessment/data/capabilities';
import type { Question } from '@/lib/assessment/types';
import { QuestionCard, RadioRow } from './QuestionCard';

export function QuestionLikert({
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
        {DS_SCALE.map((label, i) => (
          <RadioRow key={label} name={question.id} checked={value === i} onChange={() => onChange(i)} label={label} />
        ))}
      </div>
    </QuestionCard>
  );
}
