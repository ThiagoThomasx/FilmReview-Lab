import type { ReviewEntry, ReviewStatus, MovieInfo } from "../types";
import { loadFromStorage, saveToStorage } from "./storage";

const STORAGE_KEY = "review-heat:reviews:v1";

export type CreateReviewInput = {
  movie: MovieInfo;
  text: string;
  title?: string;
  personalRating?: number;
  status?: ReviewStatus;
  tags?: string[];
  letterboxdUrl?: string;
};

export type UpdateReviewInput = Partial<
  Omit<ReviewEntry, "id" | "createdAt" | "updatedAt">
>;

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const t = tag.trim();
    if (!t) continue;
    const lower = t.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    result.push(t);
  }
  return result;
}

function now(): string {
  return new Date().toISOString();
}

function load(): ReviewEntry[] {
  return loadFromStorage<ReviewEntry[]>(STORAGE_KEY, []);
}

function persist(entries: ReviewEntry[]): void {
  saveToStorage(STORAGE_KEY, entries);
}

export function getReviews(): ReviewEntry[] {
  return load().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getReviewById(id: string): ReviewEntry | undefined {
  return load().find((r) => r.id === id);
}

export function createReview(input: CreateReviewInput): ReviewEntry {
  if (!input.movie) {
    throw new Error("Uma review deve ter um filme associado.");
  }
  if (!input.text.trim()) {
    throw new Error("O texto da review não pode estar vazio.");
  }

  const entry: ReviewEntry = {
    id: generateId(),
    movie: input.movie,
    text: input.text,
    title: input.title,
    personalRating: input.personalRating,
    status: input.status ?? "draft",
    tags: normalizeTags(input.tags ?? []),
    letterboxdUrl: input.letterboxdUrl,
    createdAt: now(),
    updatedAt: now(),
  };

  const entries = load();
  persist([...entries, entry]);
  return entry;
}

export function updateReview(
  id: string,
  patch: UpdateReviewInput,
): ReviewEntry | undefined {
  const entries = load();
  const index = entries.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  const existing = entries[index];
  const updated: ReviewEntry = {
    ...existing,
    ...patch,
    tags: patch.tags !== undefined ? normalizeTags(patch.tags) : existing.tags,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: now(),
  };

  const next = [...entries];
  next[index] = updated;
  persist(next);
  return updated;
}

export function deleteReview(id: string): boolean {
  const entries = load();
  const next = entries.filter((r) => r.id !== id);
  if (next.length === entries.length) return false;
  persist(next);
  return true;
}

export function clearReviews(): void {
  persist([]);
}

export function replaceReviews(reviews: ReviewEntry[]): void {
  if (!Array.isArray(reviews)) {
    throw new Error("replaceReviews: esperado um array de reviews.");
  }
  persist(reviews);
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export const STATUS_LABELS: Record<ReviewStatus, string> = {
  idea: "Ideia",
  draft: "Rascunho",
  analyzed: "Analisada",
  needs_revision: "Revisar",
  ready: "Pronta",
  published: "Publicada",
  archived: "Arquivada",
};

export const ALL_STATUSES: ReviewStatus[] = [
  "idea",
  "draft",
  "analyzed",
  "needs_revision",
  "ready",
  "published",
  "archived",
];
