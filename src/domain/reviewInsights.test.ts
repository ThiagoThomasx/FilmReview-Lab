import { describe, it, expect } from "vitest";
import type { ReviewEntry, ReviewAnalysis } from "../types";
import {
  getReviewInsights,
  getAverageScore,
  getTemperatureDistribution,
  getStatusDistribution,
  getAverageDimensionScores,
  getTopReviews,
  getWeakestReviews,
  getMostUsedTags,
  getReviewsByMonth,
} from "./reviewInsights";
import { simpleHash } from "../lib/analysisCopy";

function makeAnalysis(overrides: Partial<ReviewAnalysis> = {}): ReviewAnalysis {
  return {
    overallScore: 60,
    temperature: "warm",
    depthScore: 60,
    specificityScore: 55,
    argumentScore: 65,
    styleScore: 50,
    technicalScore: 45,
    publishabilityScore: 40,
    wordCount: 150,
    strengths: ["Boa leitura"],
    weaknesses: ["Falta especificidade"],
    suggestions: [],
    detectedTerms: [],
    vagueTerms: [],
    ...overrides,
  };
}

function makeReview(overrides: Partial<ReviewEntry> = {}): ReviewEntry {
  return {
    id: "r1",
    movie: { title: "Blade Runner", year: "1982" },
    text: "Uma crítica sobre o filme.",
    status: "draft",
    tags: [],
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
    ...overrides,
  };
}

describe("getReviewInsights — empty list", () => {
  it("returns zeroed metrics for empty list", () => {
    const insights = getReviewInsights([]);
    expect(insights.totalReviews).toBe(0);
    expect(insights.analyzedReviews).toBe(0);
    expect(insights.unanalyzedReviews).toBe(0);
    expect(insights.staleReviews).toBe(0);
    expect(insights.publishedReviews).toBe(0);
    expect(insights.readyReviews).toBe(0);
    expect(insights.needsRevisionReviews).toBe(0);
    expect(insights.averageOverallScore).toBeNull();
    expect(insights.averageWordCount).toBe(0);
    expect(insights.totalWordCount).toBe(0);
    expect(insights.topReviews).toHaveLength(0);
    expect(insights.weakestReviews).toHaveLength(0);
    expect(insights.staleList).toHaveLength(0);
    expect(insights.mostUsedTags).toHaveLength(0);
    expect(insights.reviewsByMonth).toHaveLength(0);
    expect(insights.strongestDimension).toBeNull();
    expect(insights.weakestDimension).toBeNull();
  });

  it("returns zeroed temperature distribution for empty list", () => {
    const insights = getReviewInsights([]);
    expect(insights.temperatureDistribution.hot).toBe(0);
    expect(insights.temperatureDistribution.warm).toBe(0);
    expect(insights.temperatureDistribution.cold).toBe(0);
    expect(insights.temperatureDistribution.frozen).toBe(0);
    expect(insights.temperatureDistribution.cool).toBe(0);
  });

  it("returns zeroed status distribution for empty list", () => {
    const insights = getReviewInsights([]);
    expect(insights.statusDistribution.draft).toBe(0);
    expect(insights.statusDistribution.published).toBe(0);
  });
});

describe("getReviewInsights — total counts", () => {
  it("counts total reviews correctly", () => {
    const reviews = [makeReview({ id: "r1" }), makeReview({ id: "r2" })];
    expect(getReviewInsights(reviews).totalReviews).toBe(2);
  });

  it("counts analyzed and unanalyzed reviews", () => {
    const reviews = [
      makeReview({ id: "r1", analysis: makeAnalysis() }),
      makeReview({ id: "r2" }),
      makeReview({ id: "r3" }),
    ];
    const insights = getReviewInsights(reviews);
    expect(insights.analyzedReviews).toBe(1);
    expect(insights.unanalyzedReviews).toBe(2);
  });

  it("counts stale reviews correctly", () => {
    const text = "Texto original do review.";
    const hash = simpleHash(text);
    const staleReview = makeReview({
      id: "r1",
      text,
      analysis: makeAnalysis(),
      analysisTextHash: "hash-desatualizado",
    });
    const freshReview = makeReview({
      id: "r2",
      text,
      analysis: makeAnalysis(),
      analysisTextHash: hash,
    });
    const noHashReview = makeReview({
      id: "r3",
      text,
      analysis: makeAnalysis(),
    });
    const insights = getReviewInsights([staleReview, freshReview, noHashReview]);
    expect(insights.staleReviews).toBe(1);
    expect(insights.staleList).toHaveLength(1);
    expect(insights.staleList[0].id).toBe("r1");
  });

  it("counts published, ready and needs_revision reviews", () => {
    const reviews = [
      makeReview({ id: "r1", status: "published" }),
      makeReview({ id: "r2", status: "ready" }),
      makeReview({ id: "r3", status: "needs_revision" }),
      makeReview({ id: "r4", status: "draft" }),
    ];
    const insights = getReviewInsights(reviews);
    expect(insights.publishedReviews).toBe(1);
    expect(insights.readyReviews).toBe(1);
    expect(insights.needsRevisionReviews).toBe(1);
  });
});

describe("getAverageScore", () => {
  it("returns null when no reviews have analysis", () => {
    expect(getAverageScore([makeReview()])).toBeNull();
  });

  it("calculates average score correctly", () => {
    const reviews = [
      makeReview({ analysis: makeAnalysis({ overallScore: 80 }) }),
      makeReview({ analysis: makeAnalysis({ overallScore: 60 }) }),
    ];
    expect(getAverageScore(reviews)).toBe(70);
  });

  it("ignores reviews without analysis", () => {
    const reviews = [
      makeReview({ id: "r1", analysis: makeAnalysis({ overallScore: 90 }) }),
      makeReview({ id: "r2" }),
    ];
    expect(getAverageScore(reviews)).toBe(90);
  });
});

describe("word count metrics", () => {
  it("calculates total word count across all reviews", () => {
    const reviews = [
      makeReview({ id: "r1", text: "um dois três" }),
      makeReview({ id: "r2", text: "quatro cinco" }),
    ];
    const insights = getReviewInsights(reviews);
    expect(insights.totalWordCount).toBe(5);
  });

  it("calculates average word count", () => {
    const reviews = [
      makeReview({ id: "r1", text: "um dois três quatro" }),
      makeReview({ id: "r2", text: "um dois" }),
    ];
    const insights = getReviewInsights(reviews);
    expect(insights.averageWordCount).toBe(3);
  });

  it("handles reviews with no words", () => {
    const reviews = [makeReview({ text: "" })];
    const insights = getReviewInsights(reviews);
    expect(insights.totalWordCount).toBe(0);
    expect(insights.averageWordCount).toBe(0);
  });
});

describe("getTemperatureDistribution", () => {
  it("counts temperatures from analyzed reviews", () => {
    const reviews = [
      makeReview({ analysis: makeAnalysis({ temperature: "hot" }) }),
      makeReview({ analysis: makeAnalysis({ temperature: "hot" }) }),
      makeReview({ analysis: makeAnalysis({ temperature: "cold" }) }),
      makeReview(),
    ];
    const dist = getTemperatureDistribution(reviews);
    expect(dist.hot).toBe(2);
    expect(dist.cold).toBe(1);
    expect(dist.warm).toBe(0);
    expect(dist.cool).toBe(0);
    expect(dist.frozen).toBe(0);
  });
});

describe("getStatusDistribution", () => {
  it("counts statuses correctly", () => {
    const reviews = [
      makeReview({ status: "draft" }),
      makeReview({ status: "draft" }),
      makeReview({ status: "published" }),
    ];
    const dist = getStatusDistribution(reviews);
    expect(dist.draft).toBe(2);
    expect(dist.published).toBe(1);
    expect(dist.analyzed).toBe(0);
  });
});

describe("getAverageDimensionScores", () => {
  it("returns null for all dimensions when no analysis", () => {
    const scores = getAverageDimensionScores([makeReview()]);
    expect(scores.depthScore).toBeNull();
    expect(scores.styleScore).toBeNull();
  });

  it("calculates average dimension scores correctly", () => {
    const reviews = [
      makeReview({ analysis: makeAnalysis({ depthScore: 80, styleScore: 60 }) }),
      makeReview({ analysis: makeAnalysis({ depthScore: 60, styleScore: 40 }) }),
    ];
    const scores = getAverageDimensionScores(reviews);
    expect(scores.depthScore).toBe(70);
    expect(scores.styleScore).toBe(50);
  });

  it("ignores reviews without analysis when averaging", () => {
    const reviews = [
      makeReview({ id: "r1", analysis: makeAnalysis({ depthScore: 80 }) }),
      makeReview({ id: "r2" }),
    ];
    const scores = getAverageDimensionScores(reviews);
    expect(scores.depthScore).toBe(80);
  });
});

describe("strongest and weakest dimension", () => {
  it("identifies the strongest dimension", () => {
    const reviews = [
      makeReview({
        analysis: makeAnalysis({
          depthScore: 90,
          specificityScore: 50,
          argumentScore: 60,
          styleScore: 55,
          technicalScore: 45,
          publishabilityScore: 40,
        }),
      }),
    ];
    const insights = getReviewInsights(reviews);
    expect(insights.strongestDimension).toBe("depthScore");
  });

  it("identifies the weakest dimension", () => {
    const reviews = [
      makeReview({
        analysis: makeAnalysis({
          depthScore: 80,
          specificityScore: 70,
          argumentScore: 75,
          styleScore: 65,
          technicalScore: 60,
          publishabilityScore: 20,
        }),
      }),
    ];
    const insights = getReviewInsights(reviews);
    expect(insights.weakestDimension).toBe("publishabilityScore");
  });

  it("returns null for both when no analysis exists", () => {
    const insights = getReviewInsights([makeReview()]);
    expect(insights.strongestDimension).toBeNull();
    expect(insights.weakestDimension).toBeNull();
  });
});

describe("getTopReviews", () => {
  it("returns top reviews by overall score", () => {
    const reviews = [
      makeReview({ id: "r1", analysis: makeAnalysis({ overallScore: 50 }) }),
      makeReview({ id: "r2", analysis: makeAnalysis({ overallScore: 90 }) }),
      makeReview({ id: "r3", analysis: makeAnalysis({ overallScore: 70 }) }),
    ];
    const top = getTopReviews(reviews, 2);
    expect(top[0].id).toBe("r2");
    expect(top[1].id).toBe("r3");
  });

  it("excludes reviews without analysis", () => {
    const reviews = [makeReview({ id: "r1" }), makeReview({ id: "r2", analysis: makeAnalysis({ overallScore: 80 }) })];
    const top = getTopReviews(reviews);
    expect(top).toHaveLength(1);
    expect(top[0].id).toBe("r2");
  });

  it("returns at most limit reviews", () => {
    const reviews = Array.from({ length: 10 }, (_, i) =>
      makeReview({ id: `r${i}`, analysis: makeAnalysis({ overallScore: i * 10 }) }),
    );
    expect(getTopReviews(reviews, 5)).toHaveLength(5);
  });
});

describe("getWeakestReviews", () => {
  it("returns weakest reviews by overall score", () => {
    const reviews = [
      makeReview({ id: "r1", analysis: makeAnalysis({ overallScore: 80 }) }),
      makeReview({ id: "r2", analysis: makeAnalysis({ overallScore: 20 }) }),
      makeReview({ id: "r3", analysis: makeAnalysis({ overallScore: 50 }) }),
    ];
    const weakest = getWeakestReviews(reviews, 2);
    expect(weakest[0].id).toBe("r2");
    expect(weakest[1].id).toBe("r3");
  });

  it("includes reviews with needs_revision status", () => {
    const reviews = [
      makeReview({ id: "r1", status: "needs_revision" }),
      makeReview({ id: "r2", status: "draft" }),
    ];
    const weakest = getWeakestReviews(reviews);
    expect(weakest.some((r) => r.id === "r1")).toBe(true);
    expect(weakest.some((r) => r.id === "r2")).toBe(false);
  });
});

describe("getMostUsedTags", () => {
  it("returns tags sorted by frequency", () => {
    const reviews = [
      makeReview({ id: "r1", tags: ["drama", "noir"] }),
      makeReview({ id: "r2", tags: ["drama", "scifi"] }),
      makeReview({ id: "r3", tags: ["drama"] }),
    ];
    const tags = getMostUsedTags(reviews);
    expect(tags[0].tag).toBe("drama");
    expect(tags[0].count).toBe(3);
  });

  it("normalizes tags to lowercase", () => {
    const reviews = [
      makeReview({ tags: ["Drama", "DRAMA"] }),
    ];
    const tags = getMostUsedTags(reviews);
    expect(tags[0].tag).toBe("drama");
    expect(tags[0].count).toBe(2);
  });

  it("returns empty array for reviews without tags", () => {
    expect(getMostUsedTags([makeReview()])).toHaveLength(0);
  });

  it("respects the limit parameter", () => {
    const reviews = [
      makeReview({ tags: ["a", "b", "c", "d", "e", "f"] }),
    ];
    expect(getMostUsedTags(reviews, 3)).toHaveLength(3);
  });
});

describe("getReviewsByMonth", () => {
  it("groups reviews by month", () => {
    const reviews = [
      makeReview({ id: "r1", createdAt: "2024-01-10T00:00:00.000Z" }),
      makeReview({ id: "r2", createdAt: "2024-01-20T00:00:00.000Z" }),
      makeReview({ id: "r3", createdAt: "2024-02-05T00:00:00.000Z" }),
    ];
    const byMonth = getReviewsByMonth(reviews);
    expect(byMonth).toHaveLength(2);
    expect(byMonth[0].month).toBe("2024-01");
    expect(byMonth[0].count).toBe(2);
    expect(byMonth[1].month).toBe("2024-02");
    expect(byMonth[1].count).toBe(1);
  });

  it("calculates average score per month", () => {
    const reviews = [
      makeReview({ id: "r1", createdAt: "2024-01-10T00:00:00.000Z", analysis: makeAnalysis({ overallScore: 80 }) }),
      makeReview({ id: "r2", createdAt: "2024-01-20T00:00:00.000Z", analysis: makeAnalysis({ overallScore: 60 }) }),
    ];
    const byMonth = getReviewsByMonth(reviews);
    expect(byMonth[0].averageScore).toBe(70);
  });

  it("returns null averageScore when month has no analyzed reviews", () => {
    const reviews = [makeReview({ createdAt: "2024-03-01T00:00:00.000Z" })];
    const byMonth = getReviewsByMonth(reviews);
    expect(byMonth[0].averageScore).toBeNull();
  });

  it("returns sorted months in ascending order", () => {
    const reviews = [
      makeReview({ id: "r1", createdAt: "2024-03-01T00:00:00.000Z" }),
      makeReview({ id: "r2", createdAt: "2024-01-01T00:00:00.000Z" }),
    ];
    const byMonth = getReviewsByMonth(reviews);
    expect(byMonth[0].month).toBe("2024-01");
    expect(byMonth[1].month).toBe("2024-03");
  });
});

describe("getReviewInsights — handles mixed data", () => {
  it("handles reviews without analysis without throwing", () => {
    const reviews = [makeReview({ id: "r1" }), makeReview({ id: "r2" })];
    expect(() => getReviewInsights(reviews)).not.toThrow();
  });

  it("handles reviews with missing score fields without throwing", () => {
    const partialAnalysis = { overallScore: 60, temperature: "warm" } as any;
    const reviews = [makeReview({ analysis: partialAnalysis })];
    expect(() => getReviewInsights(reviews)).not.toThrow();
  });
});
