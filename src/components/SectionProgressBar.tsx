import type { Section } from '../types/survey';
import { useSurveyStore } from '../store/useSurveyStore';
import { isAnswered } from '../lib/scoring';
import './SectionProgressBar.css';

interface SectionProgressBarProps {
  section: Section;
}

export function SectionProgressBar({ section }: SectionProgressBarProps) {
  const likertQuestions = section.questions.filter(question => question.type === 'likert');

  const percentComplete = useSurveyStore(state => {
    if (!likertQuestions.length) return 0;
    const answeredCount = likertQuestions.filter(question => isAnswered(state.answers[question.id])).length;
    return Math.round((answeredCount / likertQuestions.length) * 100);
  });

  if (!likertQuestions.length) return null;

  return (
    <div className="section-progress">
      <span className="section-progress__label">Fortschritt</span>
      <div className="section-progress__track">
        <div className="section-progress__fill" style={{ width: `${percentComplete}%` }} />
      </div>
      <span className="section-progress__percent">{percentComplete}%</span>
    </div>
  );
}
