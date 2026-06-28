import type { MovieInfo } from "../types";
import { buildPosterUrl, buildBackdropUrl } from "../lib/tmdb";
import { Rule } from "./Rule";

type Props = {
  movie: MovieInfo;
  onClear: () => void;
};

export function SelectedMoviePanel({ movie, onClear }: Props) {
  const posterUrl = buildPosterUrl(movie.posterPath, "w342");
  const backdropUrl = buildBackdropUrl(movie.backdropPath, "w780");

  return (
    <div>
      {/* Backdrop como faixa de topo, sóbrio */}
      {backdropUrl && (
        <div
          style={{
            width: "100%",
            height: "180px",
            overflow: "hidden",
            marginBottom: "var(--spacing-32)",
          }}
        >
          <img
            src={backdropUrl}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(60%) contrast(1.1)",
              display: "block",
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: posterUrl ? "120px 1fr" : "1fr",
          gap: "var(--spacing-24)",
          alignItems: "start",
        }}
      >
        {posterUrl && (
          <div
            style={{
              border: "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-cards)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={posterUrl}
              alt={`Pôster de ${movie.title}`}
              width={120}
              style={{
                width: "100%",
                display: "block",
                filter: "grayscale(15%)",
              }}
            />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-louize-display)",
                fontSize: "clamp(32px, 5vw, var(--text-heading-lg))",
                fontWeight: "var(--font-weight-regular)",
                lineHeight: 0.95,
                color: "var(--color-headline-ink)",
                margin: 0,
              }}
            >
              {movie.title}
            </h2>
            {movie.year && (
              <p
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "var(--tracking-caption)",
                  textTransform: "uppercase",
                  color: "var(--color-ash)",
                  margin: "var(--spacing-8) 0 0",
                }}
              >
                {movie.year}
                {movie.originalTitle && ` — ${movie.originalTitle}`}
              </p>
            )}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div style={{ display: "flex", gap: "var(--spacing-8)", flexWrap: "wrap" }}>
              {movie.genres.map((g) => (
                <span
                  key={g}
                  style={{
                    fontFamily: "var(--font-neue-montreal)",
                    fontSize: "var(--text-caption)",
                    letterSpacing: "var(--tracking-caption)",
                    textTransform: "uppercase",
                    color: "var(--color-headline-ink)",
                    border: "1px solid var(--color-midstone)",
                    borderRadius: "var(--radius-tags)",
                    padding: "3px 10px",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {movie.voteAverage !== undefined && movie.voteAverage > 0 && (
            <span
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                letterSpacing: "var(--tracking-caption)",
                textTransform: "uppercase",
                color: "var(--color-pebble)",
              }}
            >
              TMDb {movie.voteAverage.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {movie.overview && (
        <>
          <Rule style={{ margin: "var(--spacing-24) 0" }} />
          <p
            style={{
              fontFamily: "var(--font-louize)",
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-body)",
              color: "var(--color-sepia)",
              margin: 0,
              maxWidth: "640px",
            }}
          >
            {movie.overview}
          </p>
        </>
      )}

      <Rule style={{ margin: "var(--spacing-32) 0" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--spacing-24)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: "var(--color-ash)",
            margin: 0,
          }}
        >
          Na próxima sprint, esta seleção será usada para escrever e salvar a review.
        </p>
        <button
          onClick={onClear}
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: "var(--color-headline-ink)",
            backgroundColor: "transparent",
            border: "1px solid var(--color-midstone)",
            borderRadius: "var(--radius-buttons)",
            padding: "6px 16px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Trocar filme
        </button>
      </div>
    </div>
  );
}
