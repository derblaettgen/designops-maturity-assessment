import { formatCompact } from '../lib/format';
import type { Costs } from '../lib/waste';
import './RoiHighlight.css';

interface RoiHighlightProps {
  annualSaving: number;
  costs: Costs;
}

function averageHourlyRate(costs: Costs): number {
  return Math.round((costs.designerRate + costs.developerRate + costs.pmRate) / 3);
}

export function RoiHighlight({ annualSaving, costs }: RoiHighlightProps) {
  return (
    <div className="roi-highlight">
      <div className="roi-highlight__caption">💰 Jährliches Einsparpotenzial bei Reifegrad 4.0</div>
      <div className="roi-highlight__amount">{formatCompact(annualSaving)}</div>
      <div className="roi-highlight__caption">
        Basierend auf {costs.designerCount} Designer:innen, {costs.developerCount} Developers,{' '}
        {costs.pmCount} PMs · Stundensätze: Ø {averageHourlyRate(costs)} €
      </div>
    </div>
  );
}
