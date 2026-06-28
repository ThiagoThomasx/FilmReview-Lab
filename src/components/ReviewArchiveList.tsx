import type { ReviewEntry, ReviewStatus } from "../types";
import { ReviewArchiveItem } from "./ReviewArchiveItem";
import { LibraryEmptyState } from "./LibraryEmptyState";

type Props = {
  reviews: ReviewEntry[];
  hasFilters: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ReviewStatus) => void;
  onClearFilters: () => void;
};

export function ReviewArchiveList({
  reviews,
  hasFilters,
  onEdit,
  onDelete,
  onStatusChange,
  onClearFilters,
}: Props) {
  if (reviews.length === 0) {
    if (hasFilters) {
      return <LibraryEmptyState variant="filtered" onClear={onClearFilters} />;
    }
    return <LibraryEmptyState variant="empty" />;
  }

  return (
    <div>
      <div
        style={{
          borderBottom: "1px solid var(--color-headline-ink)",
          paddingBottom: "var(--spacing-12)",
          marginBottom: 0,
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
            color: "var(--color-ash)",
          }}
        >
          Críticas salvas
        </span>
        <span
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            color: "var(--color-midstone)",
          }}
        >
          {reviews.length} {reviews.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      {reviews.map((review) => (
        <ReviewArchiveItem
          key={review.id}
          review={review}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
