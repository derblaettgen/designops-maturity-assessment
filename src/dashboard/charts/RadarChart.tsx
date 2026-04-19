import { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';
import type { DimensionWithScore } from '../../lib/scoring';
import { LIKERT_MAX } from '../../lib/constants';

interface RadarChartProps {
  dimensionScores: DimensionWithScore[];
}

const isMobile = () => window.innerWidth <= 700;

function buildRadarOptions(): ChartOptions<'radar'> {
  const mobile = isMobile();
  return {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: LIKERT_MAX,
        ticks: { stepSize: 1, color: '#718096', backdropColor: 'transparent', font: { size: mobile ? 8 : 10 } },
        grid: { color: 'rgba(203,213,224,.4)' },
        angleLines: { color: 'rgba(203,213,224,.3)' },
        pointLabels: { color: '#4A5568', font: { size: mobile ? 9 : 11, weight: 600 } },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#4A5568', padding: mobile ? 10 : 14, usePointStyle: true, font: { size: mobile ? 10 : 12 } },
      },
    },
  };
}

export function RadarChart({ dimensionScores }: RadarChartProps) {
  const options = useMemo(buildRadarOptions, []);

  const data = useMemo<ChartData<'radar'>>(() => ({
    labels: dimensionScores.map(dimension => dimension.name),
    datasets: [
      {
        label: 'Ihr Ergebnis',
        data: dimensionScores.map(dimension => dimension.score),
        backgroundColor: 'rgba(0,76,147,.15)',
        borderColor: '#004C93',
        borderWidth: 2,
        pointBackgroundColor: '#004C93',
        pointRadius: isMobile() ? 3 : 5,
      },
      {
        label: 'Marktdurchschnitt',
        data: dimensionScores.map(dimension => dimension.marketAvg),
        backgroundColor: 'rgba(160,174,192,.08)',
        borderColor: '#A0AEC0',
        borderWidth: 1,
        borderDash: [4, 4],
        pointRadius: 0,
      },
      {
        label: 'Top-Performer',
        data: dimensionScores.map(dimension => dimension.topPerformer),
        backgroundColor: 'rgba(0,180,160,.08)',
        borderColor: '#00B4A0',
        borderWidth: 2,
        borderDash: [6, 3],
        pointBackgroundColor: '#00B4A0',
        pointRadius: isMobile() ? 2 : 3,
      },
    ],
  }), [dimensionScores]);

  return <Radar data={data} options={options} />;
}
