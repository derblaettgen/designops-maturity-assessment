import type { MaturityLevel } from '../lib/maturity';
import './KpiCard.css';

export type KpiLevel = MaturityLevel | 'market' | 'top' | 'positive' | 'negative' | 'waste' | 'saving';

interface KpiCardProps {
  level: KpiLevel;
  value: string;
  label: string;
  badge?: string | null;
}

export function KpiCard({ level, value, label, badge }: KpiCardProps) {
  return (
    <div className="dash-kpi" data-level={level}>
      <div className="dash-kpi__value">{value}</div>
      <div className="dash-kpi__label">{label}</div>
      {badge && <div className="dash-kpi__sublabel">{badge}</div>}
    </div>
  );
}
