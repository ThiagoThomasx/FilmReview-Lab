import type { ReviewEntry, ReviewStatus } from "../types";
import { STATUS_LABELS, ALL_STATUSES, countWords } from "../domain/reviews";
import { TEMPERATURE_LABELS } from "../domain/reviewAnalyzer";

type Props = {
  review: ReviewEntry;
  onEdit: (id: string) => void;
  onStatusChange: (id: string, status: ReviewStatus) => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
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

export function ReviewPipelineCard({ review, onEdit, onStatusChange }: Props) {
  const words = countWords(review.text);

  return (
    <div
      style={{
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-cards)",
        padding: "var(--spacing-16)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-8)",
      }}
    >
      {/* Título */}
      <span
        style={{
          fontFamily: "var(--font-louize-display)",
          fontSize: "var(--text-body)",
          fontWeight: "var(--font-weight-regular)",
          color: "var(--color-headline-ink)",
          lineHeight: 1.3,
        }}
      >
        {review.movie.title}
        {review.movie.year && (
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-midstone)",
              marginLeft: "var(--spacing-8)",
            }}
          >
            {review.movie.year}
          </span>
        )}
      </span>

      {/* Metadados */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--spacing-8)",
          alignItems: "center",
        }}
      >
        {review.analysis && (
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
                padding: "2px 8px",
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
          </>
        )}

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
          {words}p · {formatDate(review.updatedAt)}
        </span>
      </div>

      {/* Ações */}
      <div style={{ display: "flex", gap: "var(--spacing-12)", alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" onClick={() => onEdit(review.id)} style={actionBtn}>
          Editar
        </button>

        <select
          value={review.status}
          onChange={(e) => onStatusChange(review.id, e.target.value as ReviewStatus)}
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--color-midstone)",
            padding: 0,
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            appearance: "none",
          }}
          aria-label="Mudar status"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
