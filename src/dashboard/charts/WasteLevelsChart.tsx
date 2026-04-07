import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import type { Costs } from '../../lib/waste';
import { wasteByMaturityLevel } from '../../lib/waste';
import { formatCompact, formatNumber } from '../../lib/format';
import { LIKERT_SCALE } from '../../lib/constants';
import { maturityLabel } from '../../lib/maturity';
import { useSurveyStore } from '../../store/useSurveyStore';

interface WasteLevelsChartProps {
  costs: Costs;
}

const LEVEL_LABELS = LIKERT_SCALE.map(level => `Stufe ${level}\n${maturityLabel(level)}`);

const WASTE_OPTIONS: ChartOptions<'bar'> = {
  responsive: true,
  indexAxis: 'y',
  scales: {
    x: {
      ticks: { color: '#718096', callback: value => formatCompact(Number(value)) },
      grid: { color: 'rgba(203,213,224,.2)' },
    },
    y: {
      ticks: { color: '#4A5568', font: { weight: 600 } },
      grid: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: tooltipItem => formatNumber(Number(tooltipItem.raw)) + ' € / Jahr',
      },
    },
  },
};

export function WasteLevelsChart({ costs }: WasteLevelsChartProps) {
  const config = useSurveyStore(state => state.config);

  const data = useMemo<ChartData<'bar'>>(() => ({
    labels: LEVEL_LABELS,
    datasets: [
      {
        label: 'Verschwendung / Jahr',
        data: wasteByMaturityLevel(config, costs),
        backgroundColor: ['#FECACA', '#FDE68A', '#FDE68A', '#BBF7D0', '#BFDBFE'],
        borderColor: ['#E53E3E', '#D97706', '#D97706', '#16A34A', '#2563EB'],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }), [config, costs]);

  return <Bar data={data} options={WASTE_OPTIONS} />;
}
