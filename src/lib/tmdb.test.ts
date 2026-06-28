import { describe, it, expect, vi, beforeEach } from "vitest";
import { mapTmdbMovie, buildPosterUrl, buildBackdropUrl, searchMovies } from "./tmdb";

// Minimal raw TMDb movie fixture
const rawMovie = {
  id: 497,
  title: "A Baleia",
  original_title: "The Whale",
  release_date: "2022-12-09",
  poster_path: "/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg",
  backdrop_path: "/vsgCMgrJMJjNMsGGlTsS1OuoJOh.jpg",
  overview: "Um professor recluso com obesidade severa tenta se reconectar com a filha.",
  vote_average: 7.7,
  genre_ids: [18],
};

describe("mapTmdbMovie", () => {
  it("mapeia id para tmdbId", () => {
    const movie = mapTmdbMovie(rawMovie);
    expect(movie.tmdbId).toBe(497);
  });

  it("mapeia title corretamente", () => {
    const movie = mapTmdbMovie(rawMovie);
    expect(movie.title).toBe("A Baleia");
  });

  it("inclui originalTitle quando diferente do title", () => {
    const movie = mapTmdbMovie(rawMovie);
    expect(movie.originalTitle).toBe("The Whale");
  });

  it("omite originalTitle quando igual ao title", () => {
    const movie = mapTmdbMovie({ ...rawMovie, original_title: "A Baleia" });
    expect(movie.originalTitle).toBeUndefined();
  });

  it("extrai year a partir de release_date", () => {
    const movie = mapTmdbMovie(rawMovie);
    expect(movie.year).toBe("2022");
  });

  it("year é undefined quando release_date está vazio", () => {
    const movie = mapTmdbMovie({ ...rawMovie, release_date: "" });
    expect(movie.year).toBeUndefined();
  });

  it("mapeia posterPath corretamente", () => {
    const movie = mapTmdbMovie(rawMovie);
    expect(movie.posterPath).toBe("/jQ0gylJMxWSL490sy0RrPj1Lj7e.jpg");
  });

  it("posterPath é undefined quando poster_path é null", () => {
    const movie = mapTmdbMovie({ ...rawMovie, poster_path: null });
    expect(movie.posterPath).toBeUndefined();
  });

  it("mapeia backdropPath corretamente", () => {
    const movie = mapTmdbMovie(rawMovie);
    expect(movie.backdropPath).toBe("/vsgCMgrJMJjNMsGGlTsS1OuoJOh.jpg");
  });

  it("mapeia overview corretamente", () => {
    const movie = mapTmdbMovie(rawMovie);
    expect(movie.overview).toContain("professor");
  });

  it("overview é undefined quando vazio", () => {
    const movie = mapTmdbMovie({ ...rawMovie, overview: "" });
    expect(movie.overview).toBeUndefined();
  });

  it("mapeia voteAverage corretamente", () => {
    const movie = mapTmdbMovie(rawMovie);
    expect(movie.voteAverage).toBe(7.7);
  });

  it("voteAverage é undefined quando zero", () => {
    const movie = mapTmdbMovie({ ...rawMovie, vote_average: 0 });
    expect(movie.voteAverage).toBeUndefined();
  });
});

describe("buildPosterUrl", () => {
  it("retorna URL completa com tamanho padrão", () => {
    const url = buildPosterUrl("/abc.jpg");
    expect(url).toBe("https://image.tmdb.org/t/p/w342/abc.jpg");
  });

  it("retorna URL com tamanho customizado", () => {
    const url = buildPosterUrl("/abc.jpg", "w500");
    expect(url).toBe("https://image.tmdb.org/t/p/w500/abc.jpg");
  });

  it("retorna undefined quando posterPath é null", () => {
    expect(buildPosterUrl(null)).toBeUndefined();
  });

  it("retorna undefined quando posterPath é undefined", () => {
    expect(buildPosterUrl(undefined)).toBeUndefined();
  });

  it("retorna undefined quando posterPath é string vazia", () => {
    expect(buildPosterUrl("")).toBeUndefined();
  });
});

describe("buildBackdropUrl", () => {
  it("retorna URL completa com tamanho padrão", () => {
    const url = buildBackdropUrl("/backdrop.jpg");
    expect(url).toBe("https://image.tmdb.org/t/p/w780/backdrop.jpg");
  });

  it("retorna undefined quando backdropPath é null", () => {
    expect(buildBackdropUrl(null)).toBeUndefined();
  });
});

describe("searchMovies", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna array vazio para query vazia", async () => {
    const result = await searchMovies("");
    expect(result).toEqual([]);
  });

  it("retorna array vazio para query só com espaços", async () => {
    const result = await searchMovies("   ");
    expect(result).toEqual([]);
  });

  it("lança erro descritivo quando API key está ausente", async () => {
    vi.stubEnv("VITE_TMDB_API_KEY", "");
    await expect(searchMovies("mulholland")).rejects.toThrow(
      "TMDb API key não configurada",
    );
  });

  it("mapeia resultados corretamente quando fetch retorna sucesso", async () => {
    vi.stubEnv("VITE_TMDB_API_KEY", "test-key");
    const mockResponse = {
      page: 1,
      results: [rawMovie],
      total_pages: 1,
      total_results: 1,
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      }),
    );

    const results = await searchMovies("baleia");
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("A Baleia");
    expect(results[0].tmdbId).toBe(497);
  });

  it("lança erro quando resposta HTTP não é ok", async () => {
    vi.stubEnv("VITE_TMDB_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      }),
    );

    await expect(searchMovies("test")).rejects.toThrow("401");
  });

  it("retorna array vazio quando results não é array", async () => {
    vi.stubEnv("VITE_TMDB_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ page: 1, results: null }),
      }),
    );

    const results = await searchMovies("test");
    expect(results).toEqual([]);
  });
});
