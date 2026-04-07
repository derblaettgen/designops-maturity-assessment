import { useSurveyStore } from '../store/useSurveyStore';
import { isAnswered } from '../lib/scoring';
import type { Question } from '../types/survey';
import './QuestionCard.css';
import { LikertScale } from './inputs/LikertScale';
import { SelectInput } from './inputs/SelectInput';
import { MultiSelect } from './inputs/MultiSelect';
import { TextareaInput } from './inputs/TextareaInput';
import { CostBlock } from './inputs/CostBlock';

interface QuestionCardProps {
  question: Question;
}

function renderInput(question: Question) {
  switch (question.type) {
    case 'likert':   return <LikertScale question={question} />;
    case 'select':   return <SelectInput question={question} />;
    case 'multi':    return <MultiSelect question={question} />;
    case 'textarea': return <TextareaInput question={question} />;
    case 'cost':     return <CostBlock />;
    default: {
      const exhaustiveCheck: never = question;
      return exhaustiveCheck;
    }
  }
}

export function QuestionCard({ question }: QuestionCardProps) {
  const answer = useSurveyStore(state => state.answers[question.id]);
  const hasError = useSurveyStore(state => state.failedIds.includes(question.id));

  const className = ['qcard', isAnswered(answer) ? 'answered' : '', hasError ? 'error' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} id={`qc-${question.id}`}>
      <div className="check-mark">✓</div>
      <div className="q-id">
        {question.id.toUpperCase()}
        {question.req && <span className="q-req"> *</span>}
      </div>
      <div className="q-text">{question.text}</div>
      {question.hint && <div className="q-hint">{question.hint}</div>}
      {renderInput(question)}
    </div>
  );
}
