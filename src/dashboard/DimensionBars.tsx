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
              className="dimension-bar__market-marker"
              role="img"
              aria-label={`Marktdurchschnitt: ${formatScore(dimension.marketAvg)}`}
              style={{ left: `${asPercent(dimension.marketAvg)}%` }}
            />
            <div
              className="dimension-bar__top-marker"
              role="img"
              aria-label={`Top-Performer: ${formatScore(dimension.topPerformer)}`}
              style={{ left: `${asPercent(dimension.topPerformer)}%` }}
            />
          </div>
          <span className="dimension-bar__value">{formatScore(dimension.score)}</span>
        </div>
      ))}

      <div className="dimension-legend" role="list" aria-label="Legende">
        <span role="listitem">
          <span className="dimension-legend__swatch dimension-legend__swatch--fill" /> Ihr Wert
        </span>
        <span role="listitem">
          <span className="dimension-legend__swatch dimension-legend__swatch--market" /> Marktdurchschnitt
        </span>
        <span role="listitem">
          <span className="dimension-legend__swatch dimension-legend__swatch--top" /> Top-Performer
        </span>
      </div>
    </div>
  );
}
