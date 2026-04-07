import { useMemo } from 'react';
import { useSurveyStore } from '../store/useSurveyStore';
import { getAllDimensionScores, getOverallScore } from '../lib/scoring';
import { extractCosts, calculateWaste } from '../lib/waste';
import { maturityLabel, maturityLevelKey } from '../lib/maturity';
import { formatCompact, formatScore, formatSignedDelta } from '../lib/format';
import { KpiCard, type KpiLevel } from './KpiCard';
import { DashCard } from './DashCard';
import { DimensionBars } from './DimensionBars';
import { RankingTable } from './RankingTable';
import { GapAnalysisTable } from './GapAnalysisTable';
import { RoiHighlight } from './RoiHighlight';
import { RadarChart } from './charts/RadarChart';
import { WasteLevelsChart } from './charts/WasteLevelsChart';
import { RoiChart } from './charts/RoiChart';
import './DashboardView.css';

interface KpiCardData {
  level: KpiLevel;
  value: string;
  label: string;
  badge?: string;
}

export function DashboardView() {
  const config = useSurveyStore(state => state.config);
  const answers = useSurveyStore(state => state.answers);

  const { dimensionScores, overallScore, costs, currentWaste, annualSaving } = useMemo(() => {
    const computedDimensionScores = getAllDimensionScores(config, answers);
    const computedOverallScore = getOverallScore(computedDimensionScores);
    const computedCosts = extractCosts(config.costDefaults, answers);
    const wasteResult = calculateWaste(computedDimensionScores, computedCosts);
    return {
      dimensionScores: computedDimensionScores,
      overallScore: computedOverallScore,
      costs: computedCosts,
      currentWaste: wasteResult.currentWaste,
      annualSaving: wasteResult.annualSaving,
    };
  }, [config, answers]);

  const overall = config.benchmarks.overall;
  const marketDelta = overallScore - overall.marketAvg;
  const isAboveAverage = marketDelta >= 0;

  const kpiCards: KpiCardData[] = [
    {
      level: maturityLevelKey(overallScore),
      value: formatScore(overallScore),
      label: 'Ihr Gesamt-Reifegrad',
      badge: maturityLabel(overallScore),
    },
    {
      level: 'market',
      value: formatScore(overall.marketAvg),
      label: 'Marktdurchschnitt DACH',
      badge: maturityLabel(overall.marketAvg),
    },
    {
      level: 'top',
      value: formatScore(overall.topPerformer),
      label: 'Top-Performer',
      badge: maturityLabel(overall.topPerformer),
    },
    {
      level: isAboveAverage ? 'positive' : 'negative',
      value: formatSignedDelta(marketDelta),
      label: 'vs. Markt',
      badge: isAboveAverage ? 'Überdurchschnittlich' : 'Unter Durchschnitt',
    },
    {
      level: 'waste',
      value: formatCompact(currentWaste),
      label: 'Verschwendung / Jahr (aktuell)',
    },
    {
      level: 'saving',
      value: formatCompact(annualSaving),
      label: 'Einsparpotenzial / Jahr',
      badge: 'bei Reifegrad 4.0',
    },
  ];

  return (
    <div className="dashboard active">
      <div className="dash-hero">
        <h2>📊 Ihr DesignOps-Ergebnis</h2>
        <p>
          Individuelle Auswertung mit Benchmark-Vergleich gegen Marktdurchschnitt und
          Top-Performer (DACH 2026)
        </p>
      </div>

      <div className="dash-kpis">
        {kpiCards.map(card => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      <div className="dash-grid">
        <DashCard title="🕸️ Radar: Sie vs. Markt vs. Top-Performer">
          <RadarChart dimensionScores={dimensionScores} />
        </DashCard>
        <DashCard title="📊 Dimensionen im Detail">
          <DimensionBars dimensionScores={dimensionScores} />
          <div className="bench-legend">
            <span><span className="dot dot--user" /> Ihr Wert</span>
            <span><span className="dot dot--market" /> Marktdurchschnitt</span>
            <span><span className="line" /> Top-Performer</span>
          </div>
        </DashCard>
      </div>

      <RankingTable />
      <GapAnalysisTable dimensionScores={dimensionScores} />

      <RoiHighlight annualSaving={annualSaving} costs={costs} />

      <div className="dash-grid">
        <DashCard title="💰 Einsparung pro Reifegrad-Stufe">
          <WasteLevelsChart costs={costs} />
        </DashCard>
        <DashCard title="📈 ROI über 3 Jahre (realistisches Szenario)">
          <RoiChart annualSaving={annualSaving} />
        </DashCard>
      </div>

      <div className="dash-card dash-card--cta">
        <h3>🚀 Nächste Schritte</h3>
        <p>
          Die vollständigen Studienergebnisse mit allen Branchen-Benchmarks erscheinen im{' '}
          <strong>Q3 2026</strong> auf adesso.de. Nutzen Sie Ihre individuelle Auswertung als
          Basis für Ihren DesignOps Business Case.
        </p>
        <a href="https://www.adesso.de" target="_blank" rel="noreferrer" className="btn btn-primary">
          Mehr erfahren auf adesso.de →
        </a>
      </div>
    </div>
  );
}
