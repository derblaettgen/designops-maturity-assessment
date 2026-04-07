export type MaturityLevel = 'critical' | 'low' | 'mid' | 'good' | 'excellent';

export type GapBadgeClass = 'badge-red' | 'badge-orange' | 'badge-yellow' | 'badge-green' | 'badge-blue';

interface MaturityTier {
  minScore: number;
  level: MaturityLevel;
  label: string;
  badgeClass: GapBadgeClass;
}

const MATURITY_TIERS: readonly MaturityTier[] = [
  { minScore: 4.5, level: 'excellent', label: 'Optimiert',    badgeClass: 'badge-blue'   },
  { minScore: 3.5, level: 'good',      label: 'Skaliert',     badgeClass: 'badge-green'  },
  { minScore: 2.5, level: 'mid',       label: 'Strukturiert', badgeClass: 'badge-yellow' },
  { minScore: 2.0, level: 'low',       label: 'Emerging',     badgeClass: 'badge-orange' },
  { minScore: 0.0, level: 'critical',  label: 'Ad-hoc',       badgeClass: 'badge-red'    },
];

function tierForScore(score: number): MaturityTier {
  return MATURITY_TIERS.find(tier => score >= tier.minScore) ?? MATURITY_TIERS[MATURITY_TIERS.length - 1];
}

export function maturityLevelKey(score: number): MaturityLevel {
  return tierForScore(score).level;
}

export function maturityLabel(score: number): string {
  return tierForScore(score).label;
}

export function scoreBadgeClass(score: number): GapBadgeClass {
  return tierForScore(score).badgeClass;
}

interface GapPriorityTier {
  minGap: number;
  badgeClass: GapBadgeClass;
  label: string;
}

const GAP_PRIORITY_TIERS: readonly GapPriorityTier[] = [
  { minGap: 2.5, badgeClass: 'badge-red',    label: 'Kritisch' },
  { minGap: 1.5, badgeClass: 'badge-orange', label: 'Hoch'     },
  { minGap: 0.8, badgeClass: 'badge-yellow', label: 'Mittel'   },
  { minGap: 0.3, badgeClass: 'badge-green',  label: 'Niedrig'  },
  { minGap: 0,   badgeClass: 'badge-blue',   label: 'Gut'      },
];

export interface GapPriority {
  badgeClass: GapBadgeClass;
  label: string;
}

export function gapPriorityInfo(gapSize: number): GapPriority {
  const tier = GAP_PRIORITY_TIERS.find(candidate => gapSize >= candidate.minGap)
    ?? GAP_PRIORITY_TIERS[GAP_PRIORITY_TIERS.length - 1];
  return { badgeClass: tier.badgeClass, label: tier.label };
}
