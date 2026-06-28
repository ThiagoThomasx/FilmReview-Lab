import type { MovieInfo } from "../types";
import { loadFromStorage, saveToStorage } from "./storage";

const CACHE_KEY = "review-heat:search-cache";
const MAX_ENTRIES = 8;

export type SearchCacheEntry = {
  query: string;
  results: MovieInfo[];
  searchedAt: string;
};

export function loadSearchCache(): SearchCacheEntry[] {
  return loadFromStorage<SearchCacheEntry[]>(CACHE_KEY, []);
}

export function saveSearch(query: string, results: MovieInfo[]): void {
  const trimmed = query.trim();
  if (!trimmed) return;

  const existing = loadSearchCache();

  // Remove entrada anterior com a mesma query (case-insensitive)
  const filtered = existing.filter(
    (e) => e.query.toLowerCase() !== trimmed.toLowerCase(),
  );

  const entry: SearchCacheEntry = {
    query: trimmed,
    results,
    searchedAt: new Date().toISOString(),
  };

  // Mais recente primeiro, limitado a MAX_ENTRIES
  const updated = [entry, ...filtered].slice(0, MAX_ENTRIES);
  saveToStorage(CACHE_KEY, updated);
}

export function clearSearchCache(): void {
  saveToStorage(CACHE_KEY, []);
}

export function getRecentQueries(): string[] {
  return loadSearchCache().map((e) => e.query);
}

export function findCachedSearch(query: string): SearchCacheEntry | undefined {
  const trimmed = query.trim().toLowerCase();
  return loadSearchCache().find((e) => e.query.toLowerCase() === trimmed);
}
