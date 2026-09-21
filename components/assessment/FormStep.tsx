import type { AnswerValue, Question, ResourceState } from '@/lib/assessment/types';
import { groupByCapability } from './assessmentUtils';
import { CapabilityGroup } from './CapabilityGroup';
import { QuestionMulti } from './QuestionMulti';
import { QuestionOpen } from './QuestionOpen';
import { QuestionResources } from './QuestionResources';
import { QuestionSingle } from './QuestionSingle';

export function FormStep({
  questions,
  answers,
  resources,
  onSingle,
  onMulti,
  onOpen,
  onResource,
}: {
  questions: Question[];
  answers: Record<string, AnswerValue>;
  resources: ResourceState;
  onSingle: (id: string, index: number) => void;
  onMulti: (id: string, indices: number[]) => void;
  onOpen: (id: string, text: string) => void;
  onResource: (field: 'r1' | 'r2' | 'r3' | 'use', value: string) => void;
}) {
  const groups = groupByCapability(questions);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((g, gi) => (
        <CapabilityGroup key={gi} capHead={g.capHead} capDesc={g.capDesc}>
          {g.questions.map((q) => {
            if (q.type === 'single') {
              return (
                <QuestionSingle
                  key={q.id}
                  question={q}
                  value={answers[q.id] as number | undefined}
                  onChange={(i) => onSingle(q.id, i)}
                />
              );
            }
            if (q.type === 'multi') {
              return (
                <QuestionMulti
                  key={q.id}
                  question={q}
                  value={answers[q.id] as number[] | undefined}
                  onChange={(idx) => onMulti(q.id, idx)}
                />
              );
            }
            if (q.type === 'open') {
              return (
                <QuestionOpen
                  key={q.id}
                  question={q}
                  value={answers[q.id] as string | undefined}
                  onChange={(t) => onOpen(q.id, t)}
                />
              );
            }
            if (q.type === 'resources') {
              return <QuestionResources key={q.id} question={q} values={resources} onChange={onResource} />;
            }
            return null;
          })}
        </CapabilityGroup>
      ))}
    </div>
  );
}
