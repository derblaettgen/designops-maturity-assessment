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
    <div className="cb">
      <span className="cb-label">Fortschritt</span>
      <div className="cb-track">
        <div className="cb-fill" style={{ width: `${percentComplete}%` }} />
      </div>
      <span className="cb-pct">{percentComplete}%</span>
    </div>
  );
}
