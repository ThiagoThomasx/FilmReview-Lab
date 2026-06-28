import type { MovieInfo } from "../types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Internal types for raw TMDb API response
type TmdbMovie = {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  genre_ids: number[];
};

type TmdbSearchResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export function getApiKey(): string {
  return import.meta.env.VITE_TMDB_API_KEY ?? "";
}

export function buildPosterUrl(
  posterPath: string | null | undefined,
  size: "w185" | "w342" | "w500" | "original" = "w342",
): string | undefined {
  if (!posterPath) return undefined;
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

export function buildBackdropUrl(
  backdropPath: string | null | undefined,
  size: "w780" | "w1280" | "original" = "w780",
): string | undefined {
  if (!backdropPath) return undefined;
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
}

export function mapTmdbMovie(raw: TmdbMovie): MovieInfo {
  const year = raw.release_date ? raw.release_date.slice(0, 4) : undefined;
  return {
    tmdbId: raw.id,
    title: raw.title,
    originalTitle:
      raw.original_title !== raw.title ? raw.original_title : undefined,
    year,
    releaseDate: raw.release_date || undefined,
    posterPath: raw.poster_path ?? undefined,
    backdropPath: raw.backdrop_path ?? undefined,
    overview: raw.overview || undefined,
    voteAverage: raw.vote_average || undefined,
  };
}

export async function searchMovies(query: string): Promise<MovieInfo[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "TMDb API key não configurada. Crie um arquivo .env.local com VITE_TMDB_API_KEY=sua_chave.",
    );
  }

  const url = new URL(`${TMDB_BASE_URL}/search/movie`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", trimmed);
  url.searchParams.set("language", "pt-BR");
  url.searchParams.set("page", "1");
  url.searchParams.set("include_adult", "false");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Erro ao buscar filmes: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as TmdbSearchResponse;

  if (!Array.isArray(data.results)) return [];

  return data.results.map(mapTmdbMovie);
}
