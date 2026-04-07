import type { AnswerValue, CostDefaults, SurveyConfig } from '../types/survey';
import type { DimensionWithScore } from './scoring';
import { getAllDimensions } from './scoring';
import { LIKERT_MAX, LIKERT_MIN, LIKERT_SCALE, TARGET_MATURITY_LEVEL } from './constants';

export interface Costs {
  designerRate: number;
  developerRate: number;
  pmRate: number;
  designerCount: number;
  developerCount: number;
  pmCount: number;
  hoursPerYear: number;
}

export type CostKey = keyof CostDefaults;

export function costAnswerKey(field: CostKey): string {
  return `cost_${field}`;
}

export function pickNumber(value: AnswerValue | undefined, fallback: number): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function readCost(answers: Record<string, AnswerValue>, field: CostKey, fallback: number): number {
  return pickNumber(answers[costAnswerKey(field)], fallback);
}

export function extractCosts(
  defaults: CostDefaults,
  answers: Record<string, AnswerValue>
): Costs {
  return {
    designerRate:   readCost(answers, 'designer',     defaults.designer),
    developerRate:  readCost(answers, 'developer',    defaults.developer),
    pmRate:         readCost(answers, 'pm',           defaults.pm),
    designerCount:  readCost(answers, 'numDesigners', defaults.numDesigners),
    developerCount: readCost(answers, 'numDevs',      defaults.numDevs),
    pmCount:        readCost(answers, 'numPMs',       defaults.numPMs),
    hoursPerYear:   readCost(answers, 'hoursYear',    defaults.hoursYear),
  };
}

export function wasteMultiplier(maturityLevel: number): number {
  const range = LIKERT_MAX - LIKERT_MIN;
  return Math.max(0.05, 1 - ((maturityLevel - LIKERT_MIN) / range) * 0.95);
}

function dimensionAnnualBase(
  waste: { design: number; validation: number; production: number },
  costs: Costs
): number {
  return (
    (waste.design * costs.designerCount * costs.designerRate +
      waste.validation * costs.developerCount * costs.developerRate +
      waste.production * costs.pmCount * costs.pmRate) *
    costs.hoursPerYear
  );
}

export interface WasteResult {
  currentWaste: number;
  targetWaste: number;
  annualSaving: number;
}

export function calculateWaste(
  dimensionScores: DimensionWithScore[],
  costs: Costs
): WasteResult {
  let currentWaste = 0;
  let targetWaste = 0;

  dimensionScores.forEach(dimension => {
    const annualBase = dimensionAnnualBase(dimension.waste, costs);
    currentWaste += annualBase * wasteMultiplier(dimension.score);
    targetWaste += annualBase * wasteMultiplier(TARGET_MATURITY_LEVEL);
  });

  return { currentWaste, targetWaste, annualSaving: currentWaste - targetWaste };
}

export function wasteByMaturityLevel(
  config: SurveyConfig,
  costs: Costs
): number[] {
  const dimensions = getAllDimensions(config);
  return LIKERT_SCALE.map(level =>
    dimensions.reduce(
      (total, dimension) => total + dimensionAnnualBase(dimension.waste, costs) * wasteMultiplier(level),
      0
    )
  );
}
