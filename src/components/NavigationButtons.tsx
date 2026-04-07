import { useSurveyStore } from '../store/useSurveyStore';
import './NavigationButtons.css';

interface NavigationButtonsProps {
  onSubmit: () => void;
}

export function NavigationButtons({ onSubmit }: NavigationButtonsProps) {
  const currentStep = useSurveyStore(state => state.currentStep);
  const totalSteps = useSurveyStore(state => state.config.sections.length);
  const goNext = useSurveyStore(state => state.goNext);
  const goPrev = useSurveyStore(state => state.goPrev);
  const submit = useSurveyStore(state => state.submit);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const scrollToFirstError = (failedIds: string[]) => {
    const firstErrorCard = document.getElementById('question-card-' + failedIds[0]);
    firstErrorCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleNext = () => {
    const result = goNext();
    if (!result.valid) scrollToFirstError(result.failedIds);
  };

  const handleSubmit = () => {
    const result = submit();
    if (!result.valid) {
      scrollToFirstError(result.failedIds);
      return;
    }
    onSubmit();
  };

  return (
    <div className="nav-buttons">
      {isFirstStep ? (
        <div />
      ) : (
        <button className="btn btn-ghost" type="button" onClick={() => goPrev()}>
          ← Zurück
        </button>
      )}
      <span className="nav-buttons__center">
        {currentStep + 1} / {totalSteps}
      </span>
      {isLastStep ? (
        <button className="btn btn-cta" type="button" onClick={handleSubmit}>
          📊 Ergebnis anzeigen
        </button>
      ) : (
        <button className="btn btn-primary" type="button" onClick={handleNext}>
          Weiter →
        </button>
      )}
    </div>
  );
}
