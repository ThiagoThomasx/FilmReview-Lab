import type { ReviewEntry, ReviewStatus, ReviewTemperature } from "../types";
import { isReviewAnalyzed, isReviewAnalysisStale, getReviewWordCount } from "./reviewLibrary";

export type ScoreDimension =
  | "depthScore"
  | "specificityScore"
  | "argumentScore"
  | "styleScore"
  | "technicalScore"
  | "publishabilityScore";

export const DIMENSION_LABELS: Record<ScoreDimension, string> = {
  depthScore: "Profundidade",
  specificityScore: "Especificidade",
  argumentScore: "Argumento",
  styleScore: "Estilo",
  technicalScore: "Técnica",
  publishabilityScore: "Publicabilidade",
};

export type ReviewInsights = {
  totalReviews: number;
  analyzedReviews: number;
  unanalyzedReviews: number;
  staleReviews: number;
  publishedReviews: number;
  readyReviews: number;
  needsRevisionReviews: number;

  averageOverallScore: number | null;
  averageWordCount: number;
  totalWordCount: number;

  temperatureDistribution: Record<ReviewTemperature, number>;
  statusDistribution: Record<ReviewStatus, number>;

  averageDimensionScores: Record<ScoreDimension, number | null>;

  topReviews: ReviewEntry[];
  weakestReviews: ReviewEntry[];
  staleList: ReviewEntry[];

  mostUsedTags: Array<{ tag: string; count: number }>;
  reviewsByMonth: Array<{ month: string; count: number; averageScore: number | null }>;

  strongestDimension: ScoreDimension | null;
  weakestDimension: ScoreDimension | null;
};

const EMPTY_TEMPERATURE_DISTRIBUTION: Record<ReviewTemperature, number> = {
  hot: 0,
  warm: 0,
  cool: 0,
  cold: 0,
  frozen: 0,
};

const EMPTY_STATUS_DISTRIBUTION: Record<ReviewStatus, number> = {
  idea: 0,
  draft: 0,
  analyzed: 0,
  needs_revision: 0,
  ready: 0,
  published: 0,
  archived: 0,
};

const DIMENSIONS: ScoreDimension[] = [
  "depthScore",
  "specificityScore",
  "argumentScore",
  "styleScore",
  "technicalScore",
  "publishabilityScore",
];

export function getAverageScore(reviews: ReviewEntry[]): number | null {
  const withScore = reviews.filter((r) => r.analysis !== undefined);
  if (withScore.length === 0) return null;
  const sum = withScore.reduce((acc, r) => acc + (r.analysis?.overallScore ?? 0), 0);
  return Math.round(sum / withScore.length);
}

export function getTemperatureDistribution(
  reviews: ReviewEntry[],
): Record<ReviewTemperature, number> {
  const dist = { ...EMPTY_TEMPERATURE_DISTRIBUTION };
  for (const r of reviews) {
    if (r.analysis) {
      dist[r.analysis.temperature]++;
    }
  }
  return dist;
}

export function getStatusDistribution(
  reviews: ReviewEntry[],
): Record<ReviewStatus, number> {
  const dist = { ...EMPTY_STATUS_DISTRIBUTION };
  for (const r of reviews) {
    dist[r.status]++;
  }
  return dist;
}

export function getAverageDimensionScores(
  reviews: ReviewEntry[],
): Record<ScoreDimension, number | null> {
  const result = {} as Record<ScoreDimension, number | null>;
  const withAnalysis = reviews.filter((r) => r.analysis !== undefined);

  for (const dim of DIMENSIONS) {
    if (withAnalysis.length === 0) {
      result[dim] = null;
    } else {
      const sum = withAnalysis.reduce((acc, r) => acc + (r.analysis?.[dim] ?? 0), 0);
      result[dim] = Math.round(sum / withAnalysis.length);
    }
  }
  return result;
}

export function getTopReviews(reviews: ReviewEntry[], limit = 5): ReviewEntry[] {
  return reviews
    .filter((r) => r.analysis !== undefined)
    .sort((a, b) => (b.analysis?.overallScore ?? 0) - (a.analysis?.overallScore ?? 0))
    .slice(0, limit);
}

export function getWeakestReviews(reviews: ReviewEntry[], limit = 5): ReviewEntry[] {
  const withAnalysisOrRevision = reviews.filter(
    (r) => r.analysis !== undefined || r.status === "needs_revision",
  );
  return withAnalysisOrRevision
    .sort((a, b) => (a.analysis?.overallScore ?? 0) - (b.analysis?.overallScore ?? 0))
    .slice(0, limit);
}

export function getMostUsedTags(
  reviews: ReviewEntry[],
  limit = 10,
): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const r of reviews) {
    for (const tag of r.tags) {
      const key = tag.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "pt-BR"))
    .slice(0, limit);
}

export function getReviewsByMonth(
  reviews: ReviewEntry[],
): Array<{ month: string; count: number; averageScore: number | null }> {
  const monthMap = new Map<string, { count: number; scores: number[] }>();

  for (const r of reviews) {
    const date = new Date(r.createdAt);
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    const existing = monthMap.get(key) ?? { count: 0, scores: [] };
    existing.count++;
    if (r.analysis !== undefined) {
      existing.scores.push(r.analysis.overallScore);
    }
    monthMap.set(key, existing);
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { count, scores }]) => ({
      month,
      count,
      averageScore:
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null,
    }));
}

function findStrongestDimension(
  scores: Record<ScoreDimension, number | null>,
): ScoreDimension | null {
  let best: ScoreDimension | null = null;
  let bestScore = -1;
  for (const dim of DIMENSIONS) {
    const s = scores[dim];
    if (s !== null && s > bestScore) {
      bestScore = s;
      best = dim;
    }
  }
  return best;
}

function findWeakestDimension(
  scores: Record<ScoreDimension, number | null>,
): ScoreDimension | null {
  let worst: ScoreDimension | null = null;
  let worstScore = Infinity;
  for (const dim of DIMENSIONS) {
    const s = scores[dim];
    if (s !== null && s < worstScore) {
      worstScore = s;
      worst = dim;
    }
  }
  return worst;
}

export function getReviewInsights(reviews: ReviewEntry[]): ReviewInsights {
  const totalWordCount = reviews.reduce((acc, r) => acc + getReviewWordCount(r), 0);
  const averageWordCount =
    reviews.length > 0 ? Math.round(totalWordCount / reviews.length) : 0;

  const analyzedReviews = reviews.filter(isReviewAnalyzed).length;
  const staleList = reviews.filter(isReviewAnalysisStale);

  const averageDimensionScores = getAverageDimensionScores(reviews);

  return {
    totalReviews: reviews.length,
    analyzedReviews,
    unanalyzedReviews: reviews.length - analyzedReviews,
    staleReviews: staleList.length,
    publishedReviews: reviews.filter((r) => r.status === "published").length,
    readyReviews: reviews.filter((r) => r.status === "ready").length,
    needsRevisionReviews: reviews.filter((r) => r.status === "needs_revision").length,

    averageOverallScore: getAverageScore(reviews),
    averageWordCount,
    totalWordCount,

    temperatureDistribution: getTemperatureDistribution(reviews),
    statusDistribution: getStatusDistribution(reviews),

    averageDimensionScores,

    topReviews: getTopReviews(reviews),
    weakestReviews: getWeakestReviews(reviews),
    staleList,

    mostUsedTags: getMostUsedTags(reviews),
    reviewsByMonth: getReviewsByMonth(reviews),

    strongestDimension: findStrongestDimension(averageDimensionScores),
    weakestDimension: findWeakestDimension(averageDimensionScores),
  };
}
