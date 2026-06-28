import type { MovieInfo } from "../types";
import { buildPosterUrl } from "../lib/tmdb";

type Props = {
  movie: MovieInfo;
  onSelect: (movie: MovieInfo) => void;
};

export function MovieResultItem({ movie, onSelect }: Props) {
  const posterUrl = buildPosterUrl(movie.posterPath, "w185");

  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: posterUrl ? "80px 1fr auto" : "1fr auto",
        gap: "var(--spacing-16)",
        alignItems: "start",
        paddingTop: "var(--spacing-20)",
        paddingBottom: "var(--spacing-20)",
        borderBottom: "1px solid var(--color-hairline)",
      }}
    >
      {posterUrl && (
        <div
          style={{
            width: "80px",
            aspectRatio: "2/3",
            overflow: "hidden",
            borderRadius: "var(--radius-cards)",
            flexShrink: 0,
            border: "1px solid var(--color-hairline)",
          }}
        >
          <img
            src={posterUrl}
            alt={`Pôster de ${movie.title}`}
            width={80}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: "grayscale(20%)",
            }}
          />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-louize-display)",
              fontSize: "var(--text-heading-sm)",
              fontWeight: "var(--font-weight-regular)",
              lineHeight: "var(--leading-heading-sm)",
              color: "var(--color-headline-ink)",
              margin: 0,
            }}
          >
            {movie.title}
            {movie.year && (
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  fontWeight: "var(--font-weight-regular)",
                  color: "var(--color-ash)",
                  marginLeft: "var(--spacing-12)",
                  verticalAlign: "middle",
                }}
              >
                {movie.year}
              </span>
            )}
          </h3>
          {movie.originalTitle && (
            <p
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                letterSpacing: "var(--tracking-caption)",
                color: "var(--color-ash)",
                margin: "4px 0 0",
                textTransform: "uppercase",
              }}
            >
              {movie.originalTitle}
            </p>
          )}
        </div>

        {movie.overview && (
          <p
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              lineHeight: 1.5,
              color: "var(--color-sepia)",
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {movie.overview}
          </p>
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

      <button
        onClick={() => onSelect(movie)}
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          fontWeight: "var(--font-weight-bold)",
          letterSpacing: "var(--tracking-caption)",
          textTransform: "uppercase",
          color: "var(--color-headline-ink)",
          backgroundColor: "transparent",
          border: "1px solid var(--color-headline-ink)",
          borderRadius: "var(--radius-buttons)",
          padding: "6px 16px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          alignSelf: "center",
        }}
      >
        Selecionar
      </button>
    </article>
  );
}
