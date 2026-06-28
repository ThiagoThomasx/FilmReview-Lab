import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { ReviewEntry } from "../types";
import { getReviews, deleteReview, countWords, STATUS_LABELS } from "../domain/reviews";
import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PosterThumb({ posterPath, title }: { posterPath?: string; title: string }) {
  if (!posterPath) return null;
  const src = `https://image.tmdb.org/t/p/w92${posterPath}`;
  return (
    <img
      src={src}
      alt={title}
      width={40}
      height={60}
      style={{
        objectFit: "cover",
        borderRadius: "4px",
        border: "1px solid var(--color-hairline)",
        flexShrink: 0,
      }}
    />
  );
}

function ReviewRow({
  review,
  onEdit,
  onDelete,
}: {
  review: ReviewEntry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const words = countWords(review.text);

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
      <PosterThumb
        posterPath={review.movie.posterPath}
        title={review.movie.title}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Cabeçalho */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--spacing-12)", flexWrap: "wrap", marginBottom: "var(--spacing-8)" }}>
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
            marginBottom: review.tags.length > 0 ? "var(--spacing-8)" : 0,
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-8)", marginBottom: "var(--spacing-8)" }}>
            {review.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-midstone)",
                  border: "1px solid var(--color-hairline)",
                  borderRadius: "var(--radius-tags)",
                  padding: "2px 8px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Ações */}
        <div style={{ display: "flex", gap: "var(--spacing-16)", marginTop: "var(--spacing-12)" }}>
          <button
            type="button"
            onClick={() => onEdit(review.id)}
            style={actionButtonStyle}
          >
            Editar
          </button>

          {confirming ? (
            <>
              <span style={{ fontFamily: "var(--font-neue-montreal)", fontSize: "var(--text-caption)", color: "var(--color-ash)" }}>
                Confirmar exclusão?
              </span>
              <button
                type="button"
                onClick={() => { onDelete(review.id); setConfirming(false); }}
                style={{ ...actionButtonStyle, color: "var(--color-headline-ink)" }}
              >
                Sim, excluir
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                style={actionButtonStyle}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              style={actionButtonStyle}
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LibraryPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewEntry[]>(() => getReviews());

  const handleEdit = useCallback((id: string) => {
    navigate(`/escrever/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id: string) => {
    deleteReview(id);
    setReviews(getReviews());
  }, []);

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
            Arquivo pessoal — {reviews.length} {reviews.length === 1 ? "crítica" : "críticas"}
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
        {reviews.length === 0 ? (
          <div
            style={{
              border: "1px dashed var(--color-midstone)",
              borderRadius: "var(--radius-cards)",
              padding: "var(--spacing-64)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                letterSpacing: "var(--tracking-caption)",
                textTransform: "uppercase",
                color: "var(--color-pebble)",
                marginBottom: "var(--spacing-16)",
              }}
            >
              Nenhuma crítica ainda
            </p>
            <button
              type="button"
              onClick={() => navigate("/escrever")}
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                fontWeight: "var(--font-weight-bold)",
                letterSpacing: "var(--tracking-caption)",
                textTransform: "uppercase",
                border: "1px solid var(--color-headline-ink)",
                borderRadius: "var(--radius-buttons)",
                padding: "10px 28px",
                background: "transparent",
                color: "var(--color-headline-ink)",
                cursor: "pointer",
              }}
            >
              Escrever a primeira
            </button>
          </div>
        ) : (
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
              <ReviewRow
                key={review.id}
                review={review}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </EditorialSection>
    </>
  );
}

const actionButtonStyle: React.CSSProperties = {
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
