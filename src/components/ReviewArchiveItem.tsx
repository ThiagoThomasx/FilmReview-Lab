import { useState } from "react";
import type { ReviewEntry, ReviewStatus } from "../types";
import { STATUS_LABELS, ALL_STATUSES, countWords } from "../domain/reviews";
import { TEMPERATURE_LABELS } from "../domain/reviewAnalyzer";
import { getLibraryStatusPhrase } from "../lib/analysisCopy";
import { isReviewAnalysisStale } from "../domain/reviewLibrary";

type Props = {
  review: ReviewEntry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ReviewStatus) => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const actionBtn: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  letterSpacing: "var(--tracking-caption)",
  textTransform: "uppercase",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--color-midstone)",
  padding: 0,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
};

const tagStyle: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  color: "var(--color-midstone)",
  border: "1px solid var(--color-hairline)",
  borderRadius: "var(--radius-tags)",
  padding: "2px 8px",
};

export function ReviewArchiveItem({ review, onEdit, onDelete, onStatusChange }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const words = countWords(review.text);
  const stale = isReviewAnalysisStale(review);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-hairline)",
        padding: "var(--spacing-24) 0",
        display: "flex",
        gap: "var(--spacing-16)",
        alignItems: "flex-start",
      }}
    >
      {/* Poster ou bloco editorial */}
      {review.movie.posterPath ? (
        <img
          src={`https://image.tmdb.org/t/p/w92${review.movie.posterPath}`}
          alt={review.movie.title}
          width={40}
          height={60}
          style={{
            objectFit: "cover",
            borderRadius: "4px",
            border: "1px solid var(--color-hairline)",
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 60,
            border: "1px solid var(--color-hairline)",
            borderRadius: "4px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-louize-display)",
              fontSize: "10px",
              color: "var(--color-pebble)",
              textAlign: "center",
              lineHeight: 1.2,
              padding: "4px",
            }}
          >
            {review.movie.title.slice(0, 3).toUpperCase()}
          </span>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Cabeçalho */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "var(--spacing-12)",
            flexWrap: "wrap",
            marginBottom: "var(--spacing-8)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-louize-display)",
              fontSize: "var(--text-subheading)",
              fontWeight: "var(--font-weight-regular)",
              color: "var(--color-headline-ink)",
              lineHeight: 1.2,
            }}
          >
            {review.movie.title}
          </span>
          {review.movie.year && (
            <span
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                color: "var(--color-midstone)",
                letterSpacing: "var(--tracking-caption)",
              }}
            >
              {review.movie.year}
            </span>
          )}
        </div>

        {/* Título da crítica */}
        {review.title && (
          <p
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-body)",
              color: "var(--color-ash)",
              marginBottom: "var(--spacing-8)",
              fontStyle: "italic",
            }}
          >
            {review.title}
          </p>
        )}

        {/* Metadados */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--spacing-16)",
            alignItems: "center",
            marginBottom: "var(--spacing-8)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              letterSpacing: "var(--tracking-caption)",
              textTransform: "uppercase",
              color: "var(--color-ash)",
              border: "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-tags)",
              padding: "2px 10px",
            }}
          >
            {STATUS_LABELS[review.status]}
          </span>

          {review.personalRating !== undefined && (
            <span
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                color: "var(--color-ash)",
              }}
            >
              Nota: {review.personalRating}
            </span>
          )}

          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-pebble)",
            }}
          >
            {words} {words === 1 ? "palavra" : "palavras"}
          </span>

          {review.analysis ? (
            <>
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "var(--tracking-caption)",
                  textTransform: "uppercase",
                  color: "var(--color-headline-ink)",
                  border: "1px solid var(--color-headline-ink)",
                  borderRadius: "var(--radius-tags)",
                  padding: "2px 10px",
                }}
              >
                {TEMPERATURE_LABELS[review.analysis.temperature]}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-ash)",
                }}
              >
                {review.analysis.overallScore}/100
              </span>
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-midstone)",
                  fontStyle: "italic",
                }}
              >
                {getLibraryStatusPhrase(review.analysis.temperature)}
              </span>
            </>
          ) : (
            <span
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                color: "var(--color-pebble)",
                fontStyle: "italic",
              }}
            >
              Sem parecer crítico
            </span>
          )}

          {stale && (
            <span
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                letterSpacing: "var(--tracking-caption)",
                textTransform: "uppercase",
                color: "var(--color-ash)",
                border: "1px dashed var(--color-midstone)",
                borderRadius: "var(--radius-tags)",
                padding: "2px 8px",
              }}
            >
              Parecer desatualizado
            </span>
          )}

          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-pebble)",
            }}
          >
            {formatDate(review.updatedAt)}
          </span>
        </div>

        {/* Tags */}
        {review.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--spacing-8)",
              marginBottom: "var(--spacing-8)",
            }}
          >
            {review.tags.map((tag) => (
              <span key={tag} style={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Ações */}
        <div style={{ display: "flex", gap: "var(--spacing-16)", marginTop: "var(--spacing-12)", flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" onClick={() => onEdit(review.id)} style={actionBtn}>
            Editar
          </button>

          {changingStatus ? (
            <div style={{ display: "flex", gap: "var(--spacing-8)", alignItems: "center" }}>
              <select
                defaultValue={review.status}
                autoFocus
                onChange={(e) => {
                  onStatusChange(review.id, e.target.value as ReviewStatus);
                  setChangingStatus(false);
                }}
                onBlur={() => setChangingStatus(false)}
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  background: "transparent",
                  border: "1px solid var(--color-hairline)",
                  borderRadius: "var(--radius-buttons)",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
              <button type="button" onClick={() => setChangingStatus(false)} style={actionBtn}>
                Cancelar
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setChangingStatus(true)} style={actionBtn}>
              Status
            </button>
          )}

          {confirming ? (
            <>
              <span style={{ fontFamily: "var(--font-neue-montreal)", fontSize: "var(--text-caption)", color: "var(--color-ash)" }}>
                Confirmar exclusão?
              </span>
              <button
                type="button"
                onClick={() => { onDelete(review.id); setConfirming(false); }}
                style={{ ...actionBtn, color: "var(--color-headline-ink)" }}
              >
                Sim, excluir
              </button>
              <button type="button" onClick={() => setConfirming(false)} style={actionBtn}>
                Cancelar
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} style={actionBtn}>
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
