import type { Question } from '@/lib/assessment/types';
import { CheckboxRow, QuestionCard } from './QuestionCard';

export function QuestionMulti({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: number[] | undefined;
  onChange: (indices: number[]) => void;
}) {
  const selected = value || [];
  const exclusiveIndex = question.exclusive
    ? question.options?.findIndex((o) => o.t === question.exclusive)
    : undefined;

  const toggle = (i: number) => {
    const isSelected = selected.includes(i);
    if (exclusiveIndex !== undefined && exclusiveIndex >= 0) {
      if (i === exclusiveIndex) {
        onChange(isSelected ? [] : [exclusiveIndex]);
        return;
      }
      const withoutExclusive = selected.filter((s) => s !== exclusiveIndex);
      onChange(isSelected ? withoutExclusive.filter((s) => s !== i) : [...withoutExclusive, i]);
      return;
    }
    onChange(isSelected ? selected.filter((s) => s !== i) : [...selected, i]);
  };

  return (
    <QuestionCard text={question.text} hint={question.hint}>
      <div className="flex flex-col gap-2">
        {question.options?.map((opt, i) => (
          <CheckboxRow
            key={opt.k || i}
            checked={selected.includes(i)}
            onChange={() => toggle(i)}
            label={opt.t}
          />
        ))}
      </div>
    </QuestionCard>
  );
}
