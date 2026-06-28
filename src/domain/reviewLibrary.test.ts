import { describe, it, expect } from "vitest";
import type { ReviewEntry } from "../types";
import {
  filterReviews,
  sortReviews,
  getAvailableTags,
  groupReviewsByStatus,
  getLibraryStats,
  isReviewAnalyzed,
  isReviewAnalysisStale,
  getReviewWordCount,
  DEFAULT_FILTERS,
} from "./reviewLibrary";
import { simpleHash } from "../lib/analysisCopy";

function makeReview(overrides: Partial<ReviewEntry> = {}): ReviewEntry {
  return {
    id: "r1",
    movie: { title: "Blade Runner", year: "1982" },
    text: "Uma crítica sobre o filme.",
    status: "draft",
    tags: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const baseFilters = { ...DEFAULT_FILTERS };

describe("isReviewAnalyzed", () => {
  it("returns false when no analysis", () => {
    expect(isReviewAnalyzed(makeReview())).toBe(false);
  });

  it("returns true when analysis exists", () => {
    const r = makeReview({ analysis: { overallScore: 70, temperature: "warm" } as any });
    expect(isReviewAnalyzed(r)).toBe(true);
  });
});

describe("isReviewAnalysisStale", () => {
  it("returns false when no analysis", () => {
    expect(isReviewAnalysisStale(makeReview())).toBe(false);
  });

  it("returns false when no analysisTextHash", () => {
    const r = makeReview({ analysis: { overallScore: 70, temperature: "warm" } as any });
    expect(isReviewAnalysisStale(r)).toBe(false);
  });

  it("returns false when hash matches current text", () => {
    const text = "Uma crítica sobre o filme.";
    const r = makeReview({
      text,
      analysis: { overallScore: 70, temperature: "warm" } as any,
      analysisTextHash: simpleHash(text),
    });
    expect(isReviewAnalysisStale(r)).toBe(false);
  });

  it("returns true when hash does not match current text", () => {
    const r = makeReview({
      text: "Texto alterado depois da análise.",
      analysis: { overallScore: 70, temperature: "warm" } as any,
      analysisTextHash: simpleHash("Texto original antes da análise."),
    });
    expect(isReviewAnalysisStale(r)).toBe(true);
  });
});

describe("getReviewWordCount", () => {
  it("counts words in review text", () => {
    const r = makeReview({ text: "Um dois três quatro" });
    expect(getReviewWordCount(r)).toBe(4);
  });

  it("returns 0 for empty text", () => {
    const r = makeReview({ text: "" });
    expect(getReviewWordCount(r)).toBe(0);
  });
});

describe("filterReviews — busca textual", () => {
  const reviews = [
    makeReview({ id: "1", movie: { title: "Blade Runner", year: "1982" } }),
    makeReview({ id: "2", movie: { title: "2001: A Space Odyssey", year: "1968" } }),
    makeReview({ id: "3", movie: { title: "Stalker", year: "1979" }, title: "Viagem ao interior" }),
  ];

  it("busca por título do filme", () => {
    const result = filterReviews(reviews, { ...baseFilters, query: "blade" });
    expect(result.map((r) => r.id)).toEqual(["1"]);
  });

  it("busca por ano", () => {
    const result = filterReviews(reviews, { ...baseFilters, query: "1968" });
    expect(result.map((r) => r.id)).toEqual(["2"]);
  });

  it("busca por título da review", () => {
    const result = filterReviews(reviews, { ...baseFilters, query: "interior" });
    expect(result.map((r) => r.id)).toEqual(["3"]);
  });

  it("busca por texto da review", () => {
    const r = makeReview({ id: "x", text: "Fotografia impressionante e direção magistral" });
    const result = filterReviews([r], { ...baseFilters, query: "magistral" });
    expect(result).toHaveLength(1);
  });

  it("busca por tag", () => {
    const r = makeReview({ id: "t", tags: ["sci-fi", "cult"] });
    const other = makeReview({ id: "o" });
    const result = filterReviews([r, other], { ...baseFilters, query: "sci-fi" });
    expect(result.map((r) => r.id)).toEqual(["t"]);
  });

  it("retorna todos quando query vazia", () => {
    const result = filterReviews(reviews, { ...baseFilters, query: "" });
    expect(result).toHaveLength(3);
  });

  it("retorna vazio quando nada bate", () => {
    const result = filterReviews(reviews, { ...baseFilters, query: "xyz-nao-existe" });
    expect(result).toHaveLength(0);
  });
});

describe("filterReviews — filtro por status", () => {
  const reviews = [
    makeReview({ id: "1", status: "draft" }),
    makeReview({ id: "2", status: "ready" }),
    makeReview({ id: "3", status: "published" }),
  ];

  it("filtra por status específico", () => {
    const result = filterReviews(reviews, { ...baseFilters, status: "ready" });
    expect(result.map((r) => r.id)).toEqual(["2"]);
  });

  it("retorna todos com status 'all'", () => {
    const result = filterReviews(reviews, { ...baseFilters, status: "all" });
    expect(result).toHaveLength(3);
  });
});

describe("filterReviews — filtro por temperatura", () => {
  const reviews = [
    makeReview({ id: "1", analysis: { temperature: "hot", overallScore: 90 } as any }),
    makeReview({ id: "2", analysis: { temperature: "cool", overallScore: 55 } as any }),
    makeReview({ id: "3" }),
  ];

  it("filtra por temperatura específica", () => {
    const result = filterReviews(reviews, { ...baseFilters, temperature: "hot" });
    expect(result.map((r) => r.id)).toEqual(["1"]);
  });

  it("retorna todas com temperatura 'all'", () => {
    const result = filterReviews(reviews, { ...baseFilters, temperature: "all" });
    expect(result).toHaveLength(3);
  });

  it("exclui sem análise quando filtra por temperatura", () => {
    const result = filterReviews(reviews, { ...baseFilters, temperature: "cool" });
    expect(result.map((r) => r.id)).toEqual(["2"]);
  });
});

describe("filterReviews — filtro por análise", () => {
  const text = "Texto original.";
  const analyzed = makeReview({ id: "a", text, analysis: { overallScore: 70, temperature: "warm" } as any, analysisTextHash: simpleHash(text) });
  const staleReview = makeReview({ id: "s", text: "Texto alterado.", analysis: { overallScore: 70, temperature: "warm" } as any, analysisTextHash: simpleHash("Texto antigo.") });
  const notAnalyzed = makeReview({ id: "n" });
  const reviews = [analyzed, staleReview, notAnalyzed];

  it("filtra apenas analisadas", () => {
    const result = filterReviews(reviews, { ...baseFilters, analysis: "analyzed" });
    expect(result.map((r) => r.id)).toEqual(["a", "s"]);
  });

  it("filtra apenas não analisadas", () => {
    const result = filterReviews(reviews, { ...baseFilters, analysis: "not-analyzed" });
    expect(result.map((r) => r.id)).toEqual(["n"]);
  });

  it("filtra apenas parecer desatualizado", () => {
    const result = filterReviews(reviews, { ...baseFilters, analysis: "stale" });
    expect(result.map((r) => r.id)).toEqual(["s"]);
  });

  it("retorna todas com análise 'all'", () => {
    const result = filterReviews(reviews, { ...baseFilters, analysis: "all" });
    expect(result).toHaveLength(3);
  });
});

describe("filterReviews — filtro por tag", () => {
  const reviews = [
    makeReview({ id: "1", tags: ["sci-fi", "cult"] }),
    makeReview({ id: "2", tags: ["drama"] }),
    makeReview({ id: "3", tags: [] }),
  ];

  it("filtra por tag específica", () => {
    const result = filterReviews(reviews, { ...baseFilters, tag: "cult" });
    expect(result.map((r) => r.id)).toEqual(["1"]);
  });

  it("filtra case-insensitive", () => {
    const result = filterReviews(reviews, { ...baseFilters, tag: "SCI-FI" });
    expect(result.map((r) => r.id)).toEqual(["1"]);
  });

  it("retorna todos com tag 'all'", () => {
    const result = filterReviews(reviews, { ...baseFilters, tag: "all" });
    expect(result).toHaveLength(3);
  });
});

describe("sortReviews", () => {
  const reviews = [
    makeReview({ id: "a", movie: { title: "Zardoz" }, updatedAt: "2024-01-01T00:00:00.000Z", analysis: { overallScore: 80 } as any, personalRating: 7 }),
    makeReview({ id: "b", movie: { title: "Alien" }, updatedAt: "2024-03-01T00:00:00.000Z", analysis: { overallScore: 60 } as any, personalRating: 9 }),
    makeReview({ id: "c", movie: { title: "Moon" }, updatedAt: "2024-02-01T00:00:00.000Z", personalRating: 5 }),
  ];

  it("ordena por updated-desc (padrão)", () => {
    const result = sortReviews(reviews, "updated-desc");
    expect(result.map((r) => r.id)).toEqual(["b", "c", "a"]);
  });

  it("ordena por updated-asc", () => {
    const result = sortReviews(reviews, "updated-asc");
    expect(result.map((r) => r.id)).toEqual(["a", "c", "b"]);
  });

  it("ordena por título A-Z", () => {
    const result = sortReviews(reviews, "title-asc");
    expect(result.map((r) => r.id)).toEqual(["b", "c", "a"]);
  });

  it("ordena por título Z-A", () => {
    const result = sortReviews(reviews, "title-desc");
    expect(result.map((r) => r.id)).toEqual(["a", "c", "b"]);
  });

  it("ordena por score desc", () => {
    const result = sortReviews(reviews, "score-desc");
    expect(result.map((r) => r.id)).toEqual(["a", "b", "c"]);
  });

  it("ordena por score asc (sem score vai ao final)", () => {
    const result = sortReviews(reviews, "score-asc");
    expect(result.map((r) => r.id)).toEqual(["b", "a", "c"]);
  });

  it("ordena por nota pessoal desc", () => {
    const result = sortReviews(reviews, "rating-desc");
    expect(result.map((r) => r.id)).toEqual(["b", "a", "c"]);
  });

  it("ordena por nota pessoal asc", () => {
    const result = sortReviews(reviews, "rating-asc");
    expect(result.map((r) => r.id)).toEqual(["c", "a", "b"]);
  });

  it("não muta o array original", () => {
    const original = [...reviews];
    sortReviews(reviews, "title-asc");
    expect(reviews.map((r) => r.id)).toEqual(original.map((r) => r.id));
  });
});

describe("getAvailableTags", () => {
  it("extrai tags únicas de todas as reviews", () => {
    const reviews = [
      makeReview({ tags: ["sci-fi", "cult"] }),
      makeReview({ tags: ["drama", "sci-fi"] }),
    ];
    const tags = getAvailableTags(reviews);
    expect(tags).toEqual(["cult", "drama", "sci-fi"]);
  });

  it("normaliza case para minúsculas", () => {
    const reviews = [makeReview({ tags: ["Sci-Fi"] }), makeReview({ tags: ["sci-fi"] })];
    const tags = getAvailableTags(reviews);
    expect(tags).toEqual(["sci-fi"]);
  });

  it("retorna array vazio para reviews sem tags", () => {
    expect(getAvailableTags([makeReview()])).toEqual([]);
  });

  it("retorna array vazio para lista vazia", () => {
    expect(getAvailableTags([])).toEqual([]);
  });
});

describe("groupReviewsByStatus", () => {
  it("agrupa reviews por status", () => {
    const reviews = [
      makeReview({ id: "1", status: "draft" }),
      makeReview({ id: "2", status: "ready" }),
      makeReview({ id: "3", status: "draft" }),
    ];
    const groups = groupReviewsByStatus(reviews);
    expect(groups.draft.map((r) => r.id)).toEqual(["1", "3"]);
    expect(groups.ready.map((r) => r.id)).toEqual(["2"]);
    expect(groups.published).toHaveLength(0);
  });

  it("retorna grupos vazios para lista vazia", () => {
    const groups = groupReviewsByStatus([]);
    expect(groups.draft).toHaveLength(0);
    expect(groups.idea).toHaveLength(0);
  });
});

describe("getLibraryStats", () => {
  const text = "Texto da review.";
  const reviews = [
    makeReview({ id: "1", status: "ready", analysis: { overallScore: 80, temperature: "hot" } as any, analysisTextHash: simpleHash(text), text }),
    makeReview({ id: "2", status: "published", analysis: { overallScore: 70, temperature: "warm" } as any, analysisTextHash: simpleHash(text), text }),
    makeReview({ id: "3", status: "needs_revision" }),
    makeReview({ id: "4", status: "draft" }),
    makeReview({ id: "5", status: "draft", text: "Texto alterado.", analysis: { overallScore: 60, temperature: "cool" } as any, analysisTextHash: simpleHash("Texto antigo.") }),
  ];

  it("calcula total correto", () => {
    expect(getLibraryStats(reviews).total).toBe(5);
  });

  it("calcula analisadas", () => {
    expect(getLibraryStats(reviews).analyzed).toBe(3);
  });

  it("calcula não analisadas", () => {
    expect(getLibraryStats(reviews).notAnalyzed).toBe(2);
  });

  it("calcula prontas", () => {
    expect(getLibraryStats(reviews).ready).toBe(1);
  });

  it("calcula publicadas", () => {
    expect(getLibraryStats(reviews).published).toBe(1);
  });

  it("calcula precisam revisão", () => {
    expect(getLibraryStats(reviews).needsRevision).toBe(1);
  });

  it("calcula stale", () => {
    expect(getLibraryStats(reviews).stale).toBe(1);
  });

  it("retorna zeros para lista vazia", () => {
    const stats = getLibraryStats([]);
    expect(stats.total).toBe(0);
    expect(stats.analyzed).toBe(0);
    expect(stats.stale).toBe(0);
  });
});
