import type { ReviewEntry, ReviewStatus } from "../types";
import { STATUS_LABELS, ALL_STATUSES } from "../domain/reviews";
import { groupReviewsByStatus } from "../domain/reviewLibrary";
import { ReviewPipelineColumn } from "./ReviewPipelineColumn";

type Props = {
  reviews: ReviewEntry[];
  onEdit: (id: string) => void;
  onStatusChange: (id: string, status: ReviewStatus) => void;
};

export function ReviewPipeline({ reviews, onEdit, onStatusChange }: Props) {
  const groups = groupReviewsByStatus(reviews);

  return (
    <div
      style={{
        display: "flex",
        gap: "var(--spacing-24)",
        overflowX: "auto",
        paddingBottom: "var(--spacing-16)",
      }}
    >
      {ALL_STATUSES.map((status) => (
        <ReviewPipelineColumn
          key={status}
          status={status}
          label={STATUS_LABELS[status]}
          reviews={groups[status]}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
