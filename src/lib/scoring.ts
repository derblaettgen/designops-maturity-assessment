import type { AnswerValue, Dimension, SurveyConfig } from '../types/survey';

export interface DimensionWithScore extends Dimension {
  score: number;
}

export interface DimensionGap extends DimensionWithScore {
  gapToTop: number;
}

export function isAnswered(value: AnswerValue | undefined): boolean {
  if (value === undefined || value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

export function calculateDimensionScore(
  questionIds: string[],
  answers: Record<string, AnswerValue>
): number {
  const scores = questionIds
    .map(id => Number(answers[id]) || 0)
    .filter(score => score > 0);
  return scores.length
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : 0;
}

export function getAllDimensions(config: SurveyConfig): Dimension[] {
  return config.sections.flatMap(section => section.dimensions ?? []);
}

const dimensionQuestionIdsCache = new WeakMap<SurveyConfig, Record<string, string[]>>();

function buildDimensionQuestionIds(config: SurveyConfig): Record<string, string[]> {
  const buckets: Record<string, string[]> = {};
  config.sections.forEach(section => {
    section.questions.forEach(question => {
      if (question.type !== 'likert') return;
      const dimensionKey = question.id.split('_')[0];
      (buckets[dimensionKey] ??= []).push(question.id);
    });
  });
  return buckets;
}

function dimensionQuestionIds(config: SurveyConfig): Record<string, string[]> {
  let cached = dimensionQuestionIdsCache.get(config);
  if (!cached) {
    cached = buildDimensionQuestionIds(config);
    dimensionQuestionIdsCache.set(config, cached);
  }
  return cached;
}

export function getAllDimensionScores(
  config: SurveyConfig,
  answers: Record<string, AnswerValue>
): DimensionWithScore[] {
  const idsByDimension = dimensionQuestionIds(config);
  return getAllDimensions(config).map(dimension => ({
    ...dimension,
    score: calculateDimensionScore(idsByDimension[dimension.key] ?? [], answers),
  }));
}

export function getOverallScore(dimensionScores: DimensionWithScore[]): number {
  if (!dimensionScores.length) return 0;
  return dimensionScores.reduce((sum, dimension) => sum + dimension.score, 0) / dimensionScores.length;
}

const surveyQuestionIdsCache = new WeakMap<SurveyConfig, string[]>();

function surveyQuestionIds(config: SurveyConfig): string[] {
  let cached = surveyQuestionIdsCache.get(config);
  if (!cached) {
    cached = config.sections.flatMap(section => section.questions.map(question => question.id));
    surveyQuestionIdsCache.set(config, cached);
  }
  return cached;
}

export function countAnsweredQuestions(
  config: SurveyConfig,
  answers: Record<string, AnswerValue>
): number {
  return surveyQuestionIds(config).reduce(
    (count, questionId) => count + (isAnswered(answers[questionId]) ? 1 : 0),
    0
  );
}

export function getDimensionGaps(dimensionScores: DimensionWithScore[]): DimensionGap[] {
  return dimensionScores
    .map(dimension => ({ ...dimension, gapToTop: dimension.topPerformer - dimension.score }))
    .sort((left, right) => right.gapToTop - left.gapToTop);
}
