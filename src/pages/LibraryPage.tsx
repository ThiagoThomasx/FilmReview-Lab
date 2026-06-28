import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ReviewEntry, ReviewStatus } from "../types";
import { getReviews, deleteReview, updateReview } from "../domain/reviews";
import {
  filterReviews,
  sortReviews,
  getAvailableTags,
  getLibraryStats,
  DEFAULT_FILTERS,
  type LibraryViewMode,
  type ReviewLibraryFilters,
} from "../domain/reviewLibrary";
import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";
import { LibraryStats } from "../components/LibraryStats";
import { LibraryToolbar } from "../components/LibraryToolbar";
import { ReviewArchiveList } from "../components/ReviewArchiveList";
import { ReviewPipeline } from "../components/ReviewPipeline";

function hasActiveFilters(filters: ReviewLibraryFilters): boolean {
  return (
    filters.query !== "" ||
    filters.status !== "all" ||
    filters.temperature !== "all" ||
    filters.analysis !== "all" ||
    filters.tag !== "all"
  );
}

export function LibraryPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewEntry[]>(() => getReviews());
  const [filters, setFilters] = useState<ReviewLibraryFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<LibraryViewMode>("archive");

  const reload = useCallback(() => setReviews(getReviews()), []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/escrever/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id: string) => {
    deleteReview(id);
    reload();
  }, [reload]);

  const handleStatusChange = useCallback((id: string, status: ReviewStatus) => {
    updateReview(id, { status });
    reload();
  }, [reload]);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const availableTags = useMemo(() => getAvailableTags(reviews), [reviews]);
  const stats = useMemo(() => getLibraryStats(reviews), [reviews]);

  const displayedReviews = useMemo(() => {
    const filtered = filterReviews(reviews, filters);
    return sortReviews(filtered, filters.sort);
  }, [reviews, filters]);

  const isFiltered = hasActiveFilters(filters);

  return (
    <>
      <EditorialSection paddingY="var(--spacing-80)">
        <PageHeading eyebrow="Arquivo pessoal">
          Sua biblioteca
          <br />
          <em>de críticas.</em>
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
            Arquivo pessoal — {reviews.length}{" "}
            {reviews.length === 1 ? "crítica" : "críticas"}
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
            Cada crítica percorre um ciclo de vida. Da ideia à publicação, o
            sistema rastreia onde cada texto está e o que ele precisa.
          </p>
        </div>
      </InvertedSection>

      <Rule />

      <EditorialSection paddingY="var(--spacing-80)">
        {reviews.length > 0 && (
          <>
            <LibraryStats stats={stats} />
            <LibraryToolbar
              filters={filters}
              viewMode={viewMode}
              availableTags={availableTags}
              onFiltersChange={setFilters}
              onViewModeChange={setViewMode}
              onClear={handleClearFilters}
            />
          </>
        )}

        {viewMode === "archive" || reviews.length === 0 ? (
          <ReviewArchiveList
            reviews={displayedReviews}
            hasFilters={isFiltered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <ReviewPipeline
            reviews={displayedReviews}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
          />
        )}
      </EditorialSection>
    </>
  );
}
