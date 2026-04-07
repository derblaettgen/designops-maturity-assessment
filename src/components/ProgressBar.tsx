import { useEffect, useState } from 'react';
import { useSurveyStore } from '../store/useSurveyStore';
import { countAnsweredQuestions } from '../lib/scoring';
import './ProgressBar.css';

const MINUTES_PER_REMAINING_STEP = 1.3;
const PROGRESS_HEAD_START_PERCENT = 10;

export function ProgressBar() {
  const sections = useSurveyStore(state => state.config.sections);
  const currentStep = useSurveyStore(state => state.currentStep);
  const answeredCount = useSurveyStore(state => countAnsweredQuestions(state.config, state.answers));
  const goToStep = useSurveyStore(state => state.goToStep);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const totalSteps = sections.length;
  if (totalSteps === 0) return null;

  const progressPercent = Math.min(
    Math.round((currentStep / totalSteps) * 100) + PROGRESS_HEAD_START_PERCENT,
    100
  );
  const sectionName = sections[currentStep]?.name ?? '';
  const remainingMinutes = Math.max(1, Math.round((totalSteps - currentStep) * MINUTES_PER_REMAINING_STEP));

  return (
    <div className={`progress-bar${isScrolled ? ' progress-bar--scrolled' : ''}`}>
      <div className="progress-bar__inner">
        <div className="progress-bar__row">
          <span className="progress-bar__section">
            Abschnitt {currentStep + 1} von {totalSteps} — {sectionName}
          </span>
          <div className="progress-bar__meta">
            <span>{answeredCount} beantwortet</span>
            <span className="progress-bar__separator">·</span>
            <span>~{remainingMinutes} Min.</span>
          </div>
        </div>
        <div className="progress-bar__track">
          <div className="progress-bar__fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="progress-bar__dots">
          {sections.map((section, index) => {
            const stateModifier =
              index < currentStep
                ? ' progress-bar__dot--done'
                : index === currentStep
                  ? ' progress-bar__dot--active'
                  : '';
            return (
              <div
                key={section.id}
                className={`progress-bar__dot${stateModifier}`}
                onClick={() => goToStep(index)}
                role="button"
                tabIndex={0}
                aria-label={`Zu Abschnitt ${index + 1}: ${section.name}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
