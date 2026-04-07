import type { DimensionWithScore } from '../lib/scoring';
import { maturityLevelKey } from '../lib/maturity';
import { LIKERT_MAX } from '../lib/constants';
import { formatScore } from '../lib/format';
import './DimensionBars.css';

interface DimensionBarsProps {
  dimensionScores: DimensionWithScore[];
}

function asPercent(score: number): number {
  return (score / LIKERT_MAX) * 100;
}

export function DimensionBars({ dimensionScores }: DimensionBarsProps) {
  return (
    <div>
      {dimensionScores.map(dimension => (
        <div className="dimension-bar" key={dimension.key}>
          <span className="dimension-bar__label">{dimension.name}</span>
          <div className="dimension-bar__track">
            <div
              className="dimension-bar__fill"
              data-level={maturityLevelKey(dimension.score)}
              style={{ width: `${asPercent(dimension.score)}%` }}
            />
            <div
              className="dimension-bar__top-marker"
              title="Top-Performer"
              style={{ left: `${asPercent(dimension.topPerformer)}%` }}
            />
            <div
              className="dimension-bar__market-marker"
              title="Marktdurchschnitt"
              style={{ left: `${asPercent(dimension.marketAvg)}%` }}
            />
          </div>
          <span className="dimension-bar__value">{formatScore(dimension.score)}</span>
        </div>
      ))}
    </div>
  );
}
