export interface RoiProjection {
  yearLabels: string[];
  cumulativeInvestment: number[];
  cumulativeSaving: number[];
  cumulativeNet: number[];
}

const PROJECTION_YEARS = 3;
const INVESTMENT_RATIO = 0.4;
const REALIZATION_FACTOR = 0.75;
const REALIZATION_RAMP = [0.3, 0.7, 1] as const;

function realizationRateForYear(yearOffset: number): number {
  return REALIZATION_RAMP[Math.min(yearOffset, REALIZATION_RAMP.length - 1)];
}

export function projectRoi(annualSaving: number): RoiProjection {
  const annualInvestment = annualSaving * INVESTMENT_RATIO;
  const yearIndices = Array.from({ length: PROJECTION_YEARS + 1 }, (_, index) => index);

  const cumulativeInvestment = yearIndices.map(year => -annualInvestment * year);
  const cumulativeSaving = yearIndices.map(year => {
    let total = 0;
    for (let pastYear = 0; pastYear < year; pastYear++) {
      total += annualSaving * REALIZATION_FACTOR * realizationRateForYear(pastYear);
    }
    return total;
  });
  const cumulativeNet = yearIndices.map((_, index) => cumulativeSaving[index] + cumulativeInvestment[index]);

  return {
    yearLabels: ['Start', 'Jahr 1', 'Jahr 2', 'Jahr 3'],
    cumulativeInvestment,
    cumulativeSaving,
    cumulativeNet,
  };
}
