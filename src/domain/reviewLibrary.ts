import type { ReviewEntry, ReviewStatus, ReviewTemperature } from "../types";
import { simpleHash } from "../lib/analysisCopy";
import { STATUS_LABELS, countWords } from "./reviews";
import { TEMPERATURE_LABELS } from "./reviewAnalyzer";

export type LibraryViewMode = "archive" | "pipeline";

export type ReviewSortOption =
  | "updated-desc"
  | "updated-asc"
  | "title-asc"
  | "title-desc"
  | "score-desc"
  | "score-asc"
  | "rating-desc"
  | "rating-asc";

export type ReviewAnalysisFilter = "all" | "analyzed" | "not-analyzed" | "stale";

export type ReviewLibraryFilters = {
  query: string;
  status: ReviewStatus | "all";
  temperature: ReviewTemperature | "all";
  analysis: ReviewAnalysisFilter;
  tag: string | "all";
  sort: ReviewSortOption;
};

export const DEFAULT_FILTERS: ReviewLibraryFilters = {
  query: "",
  status: "all",
  temperature: "all",
  analysis: "all",
  tag: "all",
  sort: "updated-desc",
};

export function isReviewAnalyzed(review: ReviewEntry): boolean {
  return review.analysis !== undefined;
}

export function isReviewAnalysisStale(review: ReviewEntry): boolean {
  if (!review.analysis) return false;
  if (!review.analysisTextHash) return false;
  const currentHash = simpleHash(review.text);
  return currentHash !== review.analysisTextHash;
}

export function getReviewWordCount(review: ReviewEntry): number {
  return countWords(review.text);
}

export function getAvailableTags(reviews: ReviewEntry[]): string[] {
  const seen = new Set<string>();
  for (const r of reviews) {
    for (const tag of r.tags) {
      seen.add(tag.toLowerCase());
    }
  }
  return Array.from(seen).sort();
}

export function groupReviewsByStatus(
  reviews: ReviewEntry[],
): Record<ReviewStatus, ReviewEntry[]> {
  const groups: Record<ReviewStatus, ReviewEntry[]> = {
    idea: [],
    draft: [],
    analyzed: [],
    needs_revision: [],
    ready: [],
    published: [],
    archived: [],
  };
  for (const r of reviews) {
    groups[r.status].push(r);
  }
  return groups;
}

export type LibraryStats = {
  total: number;
  analyzed: number;
  notAnalyzed: number;
  ready: number;
  published: number;
  needsRevision: number;
  stale: number;
};

export function getLibraryStats(reviews: ReviewEntry[]): LibraryStats {
  let analyzed = 0;
  let notAnalyzed = 0;
  let ready = 0;
  let published = 0;
  let needsRevision = 0;
  let stale = 0;

  for (const r of reviews) {
    if (isReviewAnalyzed(r)) {
      analyzed++;
      if (isReviewAnalysisStale(r)) stale++;
    } else {
      notAnalyzed++;
    }
    if (r.status === "ready") ready++;
    if (r.status === "published") published++;
    if (r.status === "needs_revision") needsRevision++;
  }

  return { total: reviews.length, analyzed, notAnalyzed, ready, published, needsRevision, stale };
}

function matchesQuery(review: ReviewEntry, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const fields = [
    review.movie.title,
    review.movie.year ?? "",
    review.title ?? "",
    review.text,
    review.tags.join(" "),
    STATUS_LABELS[review.status],
    review.analysis ? TEMPERATURE_LABELS[review.analysis.temperature] : "",
  ];
  return fields.some((f) => f.toLowerCase().includes(q));
}

export function filterReviews(
  reviews: ReviewEntry[],
  filters: ReviewLibraryFilters,
): ReviewEntry[] {
  return reviews.filter((r) => {
    if (!matchesQuery(r, filters.query)) return false;

    if (filters.status !== "all" && r.status !== filters.status) return false;

    if (filters.temperature !== "all") {
      if (!r.analysis || r.analysis.temperature !== filters.temperature) return false;
    }

    if (filters.analysis === "analyzed" && !isReviewAnalyzed(r)) return false;
    if (filters.analysis === "not-analyzed" && isReviewAnalyzed(r)) return false;
    if (filters.analysis === "stale" && !isReviewAnalysisStale(r)) return false;

    if (filters.tag !== "all") {
      const tagLower = filters.tag.toLowerCase();
      if (!r.tags.some((t) => t.toLowerCase() === tagLower)) return false;
    }

    return true;
  });
}

export function sortReviews(
  reviews: ReviewEntry[],
  sort: ReviewSortOption,
): ReviewEntry[] {
  const copy = [...reviews];

  switch (sort) {
    case "updated-desc":
      return copy.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    case "updated-asc":
      return copy.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    case "title-asc":
      return copy.sort((a, b) => a.movie.title.localeCompare(b.movie.title, "pt-BR"));
    case "title-desc":
      return copy.sort((a, b) => b.movie.title.localeCompare(a.movie.title, "pt-BR"));
    case "score-desc":
      return copy.sort((a, b) => (b.analysis?.overallScore ?? -1) - (a.analysis?.overallScore ?? -1));
    case "score-asc":
      return copy.sort((a, b) => (a.analysis?.overallScore ?? 101) - (b.analysis?.overallScore ?? 101));
    case "rating-desc":
      return copy.sort((a, b) => (b.personalRating ?? -1) - (a.personalRating ?? -1));
    case "rating-asc":
      return copy.sort((a, b) => (a.personalRating ?? 101) - (b.personalRating ?? 101));
  }
}
