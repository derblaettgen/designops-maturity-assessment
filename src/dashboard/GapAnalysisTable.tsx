import { getDimensionGaps, type DimensionWithScore } from '../lib/scoring';
import { gapPriorityInfo, maturityLevelKey } from '../lib/maturity';
import { formatScore } from '../lib/format';
import './GapAnalysisTable.css';

interface GapAnalysisTableProps {
  dimensionScores: DimensionWithScore[];
}

const GAP_PRIORITY_ICONS: Record<string, string> = {
  'Kritisch': '🔴',
  'Hoch':     '🟠',
  'Mittel':   '🟡',
  'Niedrig':  '🟢',
  'Gut':      '✅',
};

export function GapAnalysisTable({ dimensionScores }: GapAnalysisTableProps) {
  const dimensionGaps = getDimensionGaps(dimensionScores);

  return (
    <div className="dash-card dash-card--spaced dash-card--scrollable">
      <h3>📋 Gap-Analyse: Ihr Weg zu den Top-Performern</h3>
      <table className="rank-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Dimension</th>
            <th>Ihr Wert</th>
            <th>Top-Performer</th>
            <th>Gap</th>
            <th>Priorität</th>
          </tr>
        </thead>
        <tbody>
          {dimensionGaps.map((gap, position) => {
            const priority = gapPriorityInfo(gap.gapToTop);
            const icon = GAP_PRIORITY_ICONS[priority.label];
            return (
              <tr key={gap.key}>
                <td className="gap-pos">{position + 1}</td>
                <td className="gap-name"><strong>{gap.name}</strong></td>
                <td className="gap-score" data-level={maturityLevelKey(gap.score)}>
                  {formatScore(gap.score)}
                </td>
                <td className="gap-top">{formatScore(gap.topPerformer)}</td>
                <td className="gap-delta">
                  {gap.gapToTop > 0 ? `-${formatScore(gap.gapToTop)}` : '✅'}
                </td>
                <td>
                  <span className={`badge ${priority.badgeClass}`}>
                    {icon} {priority.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
