import { useSurveyStore } from '../../store/useSurveyStore';
import type { SelectQuestion } from '../../types/survey';
import './SelectInput.css';

interface SelectInputProps {
  question: SelectQuestion;
}

export function SelectInput({ question }: SelectInputProps) {
  const currentAnswer = useSurveyStore(state => state.answers[question.id]);
  const setAnswer = useSurveyStore(state => state.setAnswer);

  const value = typeof currentAnswer === 'string' ? currentAnswer : '';

  return (
    <div className="select-input">
      <select
        id={`select-input-${question.id}`}
        className={value ? 'select-input--filled' : ''}
        value={value}
        onChange={event => setAnswer(question.id, event.target.value)}
      >
        <option value="">Bitte wählen…</option>
        {question.options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
