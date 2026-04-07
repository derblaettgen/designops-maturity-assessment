import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { formatCompact, formatNumber } from '../../lib/format';
import { projectRoi } from '../../lib/roi';

interface RoiChartProps {
  annualSaving: number;
}

const ROI_OPTIONS: ChartOptions<'line'> = {
  responsive: true,
  scales: {
    y: {
      ticks: { color: '#718096', callback: value => formatCompact(Number(value)) },
      grid: { color: 'rgba(203,213,224,.2)' },
    },
    x: {
      ticks: { color: '#4A5568', font: { weight: 600 } },
      grid: { display: false },
    },
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#4A5568', usePointStyle: true },
    },
    tooltip: {
      callbacks: {
        label: tooltipItem =>
          `${tooltipItem.dataset.label}: ${formatNumber(Math.round(Number(tooltipItem.raw)))} €`,
      },
    },
  },
};

export function RoiChart({ annualSaving }: RoiChartProps) {
  const data = useMemo<ChartData<'line'>>(() => {
    const projection = projectRoi(annualSaving);
    return {
      labels: projection.yearLabels,
      datasets: [
        {
          label: 'Kum. Investment',
          data: projection.cumulativeInvestment,
          borderColor: '#E53E3E',
          backgroundColor: 'rgba(229,62,62,.07)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
        },
        {
          label: 'Kum. Einsparung',
          data: projection.cumulativeSaving,
          borderColor: '#16A34A',
          backgroundColor: 'rgba(22,163,74,.07)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
        },
        {
          label: 'Netto-ROI',
          data: projection.cumulativeNet,
          borderColor: '#004C93',
          borderWidth: 3,
          tension: 0.3,
          pointBackgroundColor: projection.cumulativeNet.map(value => (value >= 0 ? '#16A34A' : '#E53E3E')),
          pointRadius: 5,
        },
      ],
    };
  }, [annualSaving]);

  return <Line data={data} options={ROI_OPTIONS} />;
}
