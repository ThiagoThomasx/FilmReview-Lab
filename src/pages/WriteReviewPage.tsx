import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { MovieInfo, ReviewEntry } from "../types";
import { searchMovies } from "../lib/tmdb";
import {
  saveSearch,
  getRecentQueries,
  clearSearchCache,
} from "../domain/movieSearchCache";
import { getReviewById } from "../domain/reviews";
import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";
import { MovieSearchForm } from "../components/MovieSearchForm";
import { MovieResultList } from "../components/MovieResultList";
import { SelectedMoviePanel } from "../components/SelectedMoviePanel";
import { RecentSearches } from "../components/RecentSearches";
import { ReviewEditor } from "../components/ReviewEditor";

type SearchStatus = "idle" | "loading" | "error" | "success" | "no-api-key";

export function WriteReviewPage() {
  const { reviewId } = useParams<{ reviewId?: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<MovieInfo[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<MovieInfo | null>(null);
  const [existingReview, setExistingReview] = useState<ReviewEntry | undefined>(undefined);
  const [recentQueries, setRecentQueries] = useState<string[]>(() =>
    getRecentQueries(),
  );

  useEffect(() => {
    if (!reviewId) return;
    const review = getReviewById(reviewId);
    if (review) {
      setExistingReview(review);
      setSelectedMovie(review.movie);
    }
  }, [reviewId]);

  const handleSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setStatus("loading");
    setResults([]);
    setErrorMessage("");
    setSelectedMovie(null);
    setExistingReview(undefined);

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
    setExistingReview(undefined);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedMovie(null);
    setExistingReview(undefined);
    if (reviewId) navigate("/escrever", { replace: true });
  }, [reviewId, navigate]);

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

  const handleSaved = useCallback(
    (review: ReviewEntry) => {
      setExistingReview(review);
      if (!reviewId) {
        navigate(`/escrever/${review.id}`, { replace: true });
      }
    },
    [reviewId, navigate],
  );

  const isEditing = Boolean(existingReview);

  return (
    <>
      <EditorialSection paddingY="var(--spacing-80)">
        <PageHeading eyebrow={isEditing ? "Editando crítica" : "Novo registro"}>
          {isEditing ? (
            <>
              Editar
              <br />
              <em>crítica.</em>
            </>
          ) : (
            <>
              Busque
              <br />
              <em>o filme.</em>
            </>
          )}
        </PageHeading>
      </EditorialSection>

      <Rule />

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
            {isEditing ? "Fluxo — Editando" : "Fluxo — Passo 1 de 3"}
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
            {isEditing
              ? "Refine sua crítica. Atualize texto, status e tags quando quiser."
              : "Encontre o filme. Depois escreva a crítica e salve no seu arquivo pessoal."}
          </p>
        </div>
      </InvertedSection>

      <Rule />

      {/* Seleção de filme */}
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

      {/* Formulário de escrita */}
      {selectedMovie && (
        <>
          <Rule />
          <EditorialSection paddingY="var(--spacing-64)">
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
              {isEditing ? "Editar crítica" : "Escrever crítica"}
            </div>
            <ReviewEditor
              movie={selectedMovie}
              existingReview={existingReview}
              onSaved={handleSaved}
            />
          </EditorialSection>
        </>
      )}
    </>
  );
}
