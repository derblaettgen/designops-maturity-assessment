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
        <div className="dim-row" key={dimension.key}>
          <span className="dim-lbl">{dimension.name}</span>
          <div className="dim-track">
            <div
              className="dim-fill"
              data-level={maturityLevelKey(dimension.score)}
              style={{ width: `${asPercent(dimension.score)}%` }}
            />
            <div
              className="dim-bench"
              title="Top-Performer"
              style={{ left: `${asPercent(dimension.topPerformer)}%` }}
            />
            <div
              className="dim-bench-avg"
              title="Marktdurchschnitt"
              style={{ left: `${asPercent(dimension.marketAvg)}%` }}
            />
          </div>
          <span className="dim-val">{formatScore(dimension.score)}</span>
        </div>
      ))}
    </div>
  );
}
