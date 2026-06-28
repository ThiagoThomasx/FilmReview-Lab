import { useState, useCallback } from "react";
import type { MovieInfo } from "../types";
import { searchMovies } from "../lib/tmdb";
import {
  saveSearch,
  getRecentQueries,
  clearSearchCache,
} from "../domain/movieSearchCache";
import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";
import { MovieSearchForm } from "../components/MovieSearchForm";
import { MovieResultList } from "../components/MovieResultList";
import { SelectedMoviePanel } from "../components/SelectedMoviePanel";
import { RecentSearches } from "../components/RecentSearches";

type SearchStatus = "idle" | "loading" | "error" | "success" | "no-api-key";

export function WriteReviewPage() {
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<MovieInfo[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<MovieInfo | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>(() =>
    getRecentQueries(),
  );

  const handleSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setStatus("loading");
    setResults([]);
    setErrorMessage("");
    setSelectedMovie(null);

    try {
      const found = await searchMovies(trimmed);
      setResults(found);
      setStatus("success");
      saveSearch(trimmed, found);
      setRecentQueries(getRecentQueries());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido.";
      if (message.includes("API key")) {
        setStatus("no-api-key");
      } else {
        setStatus("error");
        setErrorMessage(message);
      }
    }
  }, []);

  const handleSelectMovie = useCallback((movie: MovieInfo) => {
    setSelectedMovie(movie);
    setResults([]);
    setStatus("idle");
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const handleRecentSearch = useCallback(
    (query: string) => {
      void handleSearch(query);
    },
    [handleSearch],
  );

  const handleClearCache = useCallback(() => {
    clearSearchCache();
    setRecentQueries([]);
  }, []);

  return (
    <>
      {/* Hero editorial */}
      <EditorialSection paddingY="var(--spacing-80)">
        <PageHeading eyebrow="Novo registro">
          Busque
          <br />
          <em>o filme.</em>
        </PageHeading>
      </EditorialSection>

      <Rule />

      {/* Manifesto invertido */}
      <InvertedSection paddingY="var(--spacing-64)">
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-24)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              letterSpacing: "var(--tracking-caption)",
              textTransform: "uppercase",
              color: "var(--color-paper)",
              opacity: 0.6,
            }}
          >
            Fluxo — Passo 1 de 3
          </span>
          <p
            style={{
              fontFamily: "var(--font-louize-display)",
              fontSize: "var(--text-heading)",
              fontWeight: "var(--font-weight-regular)",
              lineHeight: "var(--leading-heading)",
              color: "var(--color-paper)",
            }}
          >
            Encontre o filme. Na próxima sprint, você escreve a crítica e
            recebe a temperatura da sua escrita.
          </p>
        </div>
      </InvertedSection>

      <Rule />

      {/* Área de busca ou ficha do filme selecionado */}
      <EditorialSection paddingY="var(--spacing-64)">
        {selectedMovie ? (
          <>
            <div
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                letterSpacing: "var(--tracking-caption)",
                textTransform: "uppercase",
                color: "var(--color-ash)",
                marginBottom: "var(--spacing-32)",
              }}
            >
              Filme selecionado
            </div>
            <SelectedMoviePanel
              movie={selectedMovie}
              onClear={handleClearSelection}
            />
          </>
        ) : (
          <>
            <div
              style={{
                marginBottom: "var(--spacing-24)",
                fontFamily: "var(--font-louize-display)",
                fontSize: "var(--text-heading)",
                fontWeight: "var(--font-weight-regular)",
                color: "var(--color-headline-ink)",
              }}
            >
              Buscar filme
            </div>

            <MovieSearchForm
              onSearch={handleSearch}
              isLoading={status === "loading"}
            />

            <RecentSearches
              queries={recentQueries}
              onSelect={handleRecentSearch}
              onClear={handleClearCache}
            />

            <MovieResultList
              status={status}
              results={results}
              errorMessage={errorMessage}
              onSelect={handleSelectMovie}
            />
          </>
        )}
      </EditorialSection>
    </>
  );
}
