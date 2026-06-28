import type { ReviewEntry, ReviewStatus } from "../types";
import { ReviewPipelineCard } from "./ReviewPipelineCard";

type Props = {
  status: ReviewStatus;
  label: string;
  reviews: ReviewEntry[];
  onEdit: (id: string) => void;
  onStatusChange: (id: string, status: ReviewStatus) => void;
};

export function ReviewPipelineColumn({ status: _status, label, reviews, onEdit, onStatusChange }: Props) {
  return (
    <div
      style={{
        minWidth: "240px",
        flex: "1 1 240px",
        maxWidth: "320px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-12)",
      }}
    >
      {/* Cabeçalho da coluna */}
      <div
        style={{
          borderBottom: "1px solid var(--color-headline-ink)",
          paddingBottom: "var(--spacing-8)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: "var(--color-headline-ink)",
            fontWeight: "var(--font-weight-bold)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            color: "var(--color-pebble)",
          }}
        >
          {reviews.length}
        </span>
      </div>

      {/* Cards */}
      {reviews.length === 0 ? (
        <div
          style={{
            border: "1px dashed var(--color-hairline)",
            borderRadius: "var(--radius-cards)",
            padding: "var(--spacing-24)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-pebble)",
              fontStyle: "italic",
            }}
          >
            Vazio
          </span>
        </div>
      ) : (
        reviews.map((review) => (
          <ReviewPipelineCard
            key={review.id}
            review={review}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
          />
        ))
      )}
    </div>
  );
}
