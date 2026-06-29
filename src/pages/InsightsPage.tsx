import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReviewEntry, ReviewTemperature, ReviewStatus } from "../types";
import { getReviews } from "../domain/reviews";
import { STATUS_LABELS } from "../domain/reviews";
import { TEMPERATURE_LABELS } from "../domain/reviewAnalyzer";
import {
  getReviewInsights,
  DIMENSION_LABELS,
  type ReviewInsights,
  type ScoreDimension,
} from "../domain/reviewInsights";
import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";

const TEMPERATURES_ORDER: ReviewTemperature[] = ["hot", "warm", "cool", "cold", "frozen"];
const STATUSES_ORDER: ReviewStatus[] = [
  "published",
  "ready",
  "analyzed",
  "draft",
  "needs_revision",
  "idea",
  "archived",
];

function labelStyle(inverted = false) {
  return {
    fontFamily: "var(--font-neue-montreal)",
    fontSize: "var(--text-caption)",
    fontWeight: "700" as const,
    letterSpacing: "var(--tracking-caption)",
    textTransform: "uppercase" as const,
    color: inverted ? "var(--color-paper)" : "var(--color-headline-ink)",
    opacity: 0.6,
  };
}

function valueStyle(inverted = false) {
  return {
    fontFamily: "var(--font-louize-display)",
    fontSize: "clamp(40px, 5vw, 64px)",
    fontWeight: "400" as const,
    lineHeight: 1,
    color: inverted ? "var(--color-paper)" : "var(--color-headline-ink)",
  };
}

function captionStyle(inverted = false) {
  return {
    fontFamily: "var(--font-neue-montreal)",
    fontSize: "var(--text-caption)",
    color: inverted ? "var(--color-paper)" : "var(--color-ash)",
    opacity: 0.7,
  };
}

function SectionTitle({
  children,
  inverted = false,
}: {
  children: React.ReactNode;
  inverted?: boolean;
}) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-neue-montreal)",
        fontSize: "var(--text-caption)",
        fontWeight: "700",
        letterSpacing: "var(--tracking-caption)",
        textTransform: "uppercase",
        color: inverted ? "var(--color-paper)" : "var(--color-headline-ink)",
        opacity: 0.5,
        marginBottom: "var(--spacing-24)",
      }}
    >
      {children}
    </h2>
  );
}

function StatCard({
  label,
  value,
  sub,
  inverted = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  inverted?: boolean;
}) {
  const borderColor = inverted ? "rgba(255,255,255,0.15)" : "var(--color-hairline)";
  return (
    <div
      style={{
        borderTop: `1px solid ${borderColor}`,
        paddingTop: "var(--spacing-20)",
        paddingBottom: "var(--spacing-20)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-8)",
      }}
    >
      <span style={labelStyle(inverted)}>{label}</span>
      <span style={valueStyle(inverted)}>{value}</span>
      {sub && <span style={captionStyle(inverted)}>{sub}</span>}
    </div>
  );
}

function HorizontalBar({
  label,
  count,
  total,
  inverted = false,
}: {
  label: string;
  count: number;
  total: number;
  inverted?: boolean;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const barBg = inverted ? "rgba(255,255,255,0.12)" : "var(--color-hairline)";
  const barFill = inverted ? "var(--color-paper)" : "var(--color-headline-ink)";
  return (
    <div
      className="grid-insights-bar"
      style={{
        borderBottom: `1px solid ${inverted ? "rgba(255,255,255,0.1)" : "var(--color-hairline)"}`,
        paddingTop: "var(--spacing-12)",
        paddingBottom: "var(--spacing-12)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          color: inverted ? "var(--color-paper)" : "var(--color-headline-ink)",
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-caption)",
        }}
      >
        {label}
      </span>
      <div
        style={{
          height: "4px",
          backgroundColor: barBg,
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: barFill,
            borderRadius: "2px",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          color: inverted ? "var(--color-paper)" : "var(--color-headline-ink)",
          textAlign: "right",
          opacity: 0.7,
        }}
      >
        {count}
      </span>
    </div>
  );
}

function DimensionRow({
  dim,
  score,
  isStrongest,
  isWeakest,
}: {
  dim: ScoreDimension;
  score: number | null;
  isStrongest: boolean;
  isWeakest: boolean;
}) {
  const pct = score !== null ? score : 0;
  return (
    <div
      className="grid-insights-dim"
      style={{
        borderBottom: "1px solid var(--color-hairline)",
        paddingTop: "var(--spacing-16)",
        paddingBottom: "var(--spacing-16)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          fontWeight: "700",
          letterSpacing: "var(--tracking-caption)",
          textTransform: "uppercase",
          color: "var(--color-headline-ink)",
        }}
      >
        {DIMENSION_LABELS[dim]}
      </span>
      <div
        style={{
          height: "4px",
          backgroundColor: "var(--color-hairline)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: "var(--color-headline-ink)",
            borderRadius: "2px",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-louize-display)",
          fontSize: "var(--text-body)",
          color: "var(--color-headline-ink)",
          textAlign: "right",
        }}
      >
        {score !== null ? score : "—"}
      </span>
      <span
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "10px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-ash)",
          textAlign: "right",
        }}
      >
        <span className="dim-label-extra">
          {isStrongest ? "↑ mais forte" : isWeakest ? "↓ mais fraca" : ""}
        </span>
      </span>
    </div>
  );
}

function ReviewRow({
  review,
  onEdit,
  showWeakness = false,
}: {
  review: ReviewEntry;
  onEdit: (id: string) => void;
  showWeakness?: boolean;
}) {
  const weakness = review.analysis?.weaknesses?.[0];
  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-hairline)",
        paddingTop: "var(--spacing-16)",
        paddingBottom: "var(--spacing-16)",
        display: "flex",
        alignItems: "baseline",
        gap: "var(--spacing-20)",
        justifyContent: "space-between",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-body)",
            fontWeight: "700",
            color: "var(--color-headline-ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {review.movie.title}
          {review.movie.year ? (
            <span
              style={{
                fontWeight: "400",
                color: "var(--color-ash)",
                marginLeft: "var(--spacing-8)",
                fontSize: "var(--text-caption)",
              }}
            >
              {review.movie.year}
            </span>
          ) : null}
        </div>
        {showWeakness && weakness && (
          <div
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-ash)",
              marginTop: "var(--spacing-4)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {weakness}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          gap: "var(--spacing-16)",
          alignItems: "baseline",
          flexShrink: 0,
        }}
      >
        {review.analysis && (
          <span
            style={{
              fontFamily: "var(--font-louize-display)",
              fontSize: "var(--text-body)",
              color: "var(--color-headline-ink)",
            }}
          >
            {review.analysis.overallScore}
          </span>
        )}
        <span
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-ash)",
          }}
        >
          {review.analysis
            ? TEMPERATURE_LABELS[review.analysis.temperature]
            : STATUS_LABELS[review.status]}
        </span>
        <button
          onClick={() => onEdit(review.id)}
          style={{
            background: "none",
            border: "1px solid var(--color-hairline)",
            borderRadius: "12px",
            padding: "4px 12px",
            cursor: "pointer",
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-headline-ink)",
          }}
        >
          Editar
        </button>
      </div>
    </div>
  );
}

function MonthTable({
  data,
}: {
  data: Array<{ month: string; count: number; averageScore: number | null }>;
}) {
  if (data.length === 0) return null;
  const maxCount = Math.max(...data.map((d) => d.count));
  return (
    <div>
      {data.map(({ month, count, averageScore }) => {
        const [year, m] = month.split("-");
        const label = `${m}/${year}`;
        return (
          <div
            key={month}
            className="grid-insights-month"
            style={{
              borderBottom: "1px solid var(--color-hairline)",
              paddingTop: "var(--spacing-12)",
              paddingBottom: "var(--spacing-12)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                color: "var(--color-ash)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-caption)",
              }}
            >
              {label}
            </span>
            <div
              style={{
                height: "4px",
                backgroundColor: "var(--color-hairline)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round((count / maxCount) * 100)}%`,
                  height: "100%",
                  backgroundColor: "var(--color-headline-ink)",
                  borderRadius: "2px",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                color: "var(--color-ash)",
                textAlign: "right",
              }}
            >
              {count} {count === 1 ? "review" : "reviews"}
            </span>
            <span
              className="month-score"
              style={{
                fontFamily: "var(--font-louize-display)",
                fontSize: "var(--text-body)",
                color: "var(--color-headline-ink)",
                textAlign: "right",
              }}
            >
              {averageScore !== null ? averageScore : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function EmptyInsights() {
  return (
    <InvertedSection paddingY="var(--spacing-80)">
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-20)",
        }}
      >
        <span style={labelStyle(true)}>Arquivo vazio</span>
        <p
          style={{
            fontFamily: "var(--font-louize-display)",
            fontSize: "var(--text-heading)",
            fontWeight: "400",
            lineHeight: "var(--leading-heading)",
            color: "var(--color-paper)",
          }}
        >
          Ainda não há material suficiente para medir sua evolução crítica.
        </p>
        <span style={captionStyle(true)}>
          Escreva e analise algumas reviews para começar a formar o arquivo.
        </span>
      </div>
    </InvertedSection>
  );
}

function NoAnalysisNote() {
  return (
    <EditorialSection paddingY="var(--spacing-32)">
      <p
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          color: "var(--color-ash)",
          textAlign: "center",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Você já tem textos salvos, mas ainda falta gerar pareceres críticos para medir temperatura e
        qualidade.
      </p>
    </EditorialSection>
  );
}

function InsightsDashboard({
  insights,
  onEdit,
}: {
  insights: ReviewInsights;
  onEdit: (id: string) => void;
}) {
  const DIMENSIONS_ORDER: ScoreDimension[] = [
    "depthScore",
    "specificityScore",
    "argumentScore",
    "styleScore",
    "technicalScore",
    "publishabilityScore",
  ];

  const tempTotal = insights.analyzedReviews;
  const statusTotal = insights.totalReviews;

  return (
    <>
      {/* Panorama geral */}
      <EditorialSection paddingY="var(--spacing-64)">
        <SectionTitle>Panorama geral</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "0 var(--spacing-32)",
          }}
        >
          <StatCard label="Total" value={insights.totalReviews} />
          <StatCard label="Analisadas" value={insights.analyzedReviews} />
          <StatCard label="Sem parecer" value={insights.unanalyzedReviews} />
          <StatCard label="Desatualizadas" value={insights.staleReviews} />
          <StatCard label="Publicadas" value={insights.publishedReviews} />
          <StatCard label="Prontas" value={insights.readyReviews} />
          <StatCard label="Para revisar" value={insights.needsRevisionReviews} />
        </div>
      </EditorialSection>

      <Rule />

      {/* Qualidade média */}
      <InvertedSection paddingY="var(--spacing-64)">
        <SectionTitle inverted>Qualidade média</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0 var(--spacing-32)",
          }}
        >
          <StatCard
            inverted
            label="Score médio"
            value={insights.averageOverallScore !== null ? insights.averageOverallScore : "—"}
            sub="de 0 a 100"
          />
          <StatCard
            inverted
            label="Média de palavras"
            value={insights.averageWordCount}
            sub="por review"
          />
          <StatCard
            inverted
            label="Total de palavras"
            value={insights.totalWordCount.toLocaleString("pt-BR")}
            sub="escritas"
          />
        </div>
      </InvertedSection>

      <Rule />

      {/* Dimensões da escrita */}
      <EditorialSection paddingY="var(--spacing-64)">
        <SectionTitle>Dimensões da escrita</SectionTitle>
        <div
          style={{
            borderTop: "1px solid var(--color-hairline)",
          }}
        >
          {DIMENSIONS_ORDER.map((dim) => (
            <DimensionRow
              key={dim}
              dim={dim}
              score={insights.averageDimensionScores[dim]}
              isStrongest={insights.strongestDimension === dim}
              isWeakest={insights.weakestDimension === dim}
            />
          ))}
        </div>
      </EditorialSection>

      <Rule />

      {/* Temperatura e Status */}
      <EditorialSection paddingY="var(--spacing-64)">
        <div className="grid-temp-status">
          <div>
            <SectionTitle>Temperatura</SectionTitle>
            {TEMPERATURES_ORDER.map((t) => (
              <HorizontalBar
                key={t}
                label={TEMPERATURE_LABELS[t]}
                count={insights.temperatureDistribution[t]}
                total={tempTotal}
              />
            ))}
          </div>
          <div>
            <SectionTitle>Status</SectionTitle>
            {STATUSES_ORDER.map((s) => (
              <HorizontalBar
                key={s}
                label={STATUS_LABELS[s]}
                count={insights.statusDistribution[s]}
                total={statusTotal}
              />
            ))}
          </div>
        </div>
      </EditorialSection>

      <Rule />

      {/* Produção por mês */}
      {insights.reviewsByMonth.length > 0 && (
        <>
          <EditorialSection paddingY="var(--spacing-64)">
            <SectionTitle>Produção por mês</SectionTitle>
            <div
              style={{
                borderTop: "1px solid var(--color-hairline)",
                marginBottom: "var(--spacing-8)",
              }}
            >
              <div
                className="grid-insights-month"
                style={{
                  paddingTop: "var(--spacing-8)",
                  paddingBottom: "var(--spacing-8)",
                  borderBottom: "1px solid var(--color-hairline)",
                }}
              >
                {["Mês", "", "Qtd.", "Score"].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontFamily: "var(--font-neue-montreal)",
                      fontSize: "10px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-ash)",
                      textAlign: h === "Score" || h === "Qtd." ? "right" : "left",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <MonthTable data={insights.reviewsByMonth} />
          </EditorialSection>
          <Rule />
        </>
      )}

      {/* Top reviews */}
      {insights.topReviews.length > 0 && (
        <>
          <InvertedSection paddingY="var(--spacing-64)">
            <SectionTitle inverted>Melhores críticas</SectionTitle>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
              {insights.topReviews.map((r) => (
                <div
                  key={r.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    paddingTop: "var(--spacing-16)",
                    paddingBottom: "var(--spacing-16)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "var(--spacing-20)",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-neue-montreal)",
                        fontSize: "var(--text-body)",
                        fontWeight: "700",
                        color: "var(--color-paper)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {r.movie.title}
                      {r.movie.year ? (
                        <span
                          style={{
                            fontWeight: "400",
                            color: "rgba(255,255,255,0.5)",
                            marginLeft: "var(--spacing-8)",
                            fontSize: "var(--text-caption)",
                          }}
                        >
                          {r.movie.year}
                        </span>
                      ) : null}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--spacing-16)",
                      alignItems: "baseline",
                      flexShrink: 0,
                    }}
                  >
                    {r.analysis && (
                      <span
                        style={{
                          fontFamily: "var(--font-louize-display)",
                          fontSize: "var(--text-body)",
                          color: "var(--color-paper)",
                        }}
                      >
                        {r.analysis.overallScore}
                      </span>
                    )}
                    {r.analysis && (
                      <span
                        style={{
                          fontFamily: "var(--font-neue-montreal)",
                          fontSize: "10px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        {TEMPERATURE_LABELS[r.analysis.temperature]}
                      </span>
                    )}
                    <button
                      onClick={() => onEdit(r.id)}
                      style={{
                        background: "none",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: "12px",
                        padding: "4px 12px",
                        cursor: "pointer",
                        fontFamily: "var(--font-neue-montreal)",
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-paper)",
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </InvertedSection>
          <Rule />
        </>
      )}

      {/* Reescritas prioritárias */}
      {insights.weakestReviews.length > 0 && (
        <>
          <EditorialSection paddingY="var(--spacing-64)">
            <SectionTitle>Reescritas prioritárias</SectionTitle>
            <div style={{ borderTop: "1px solid var(--color-hairline)" }}>
              {insights.weakestReviews.map((r) => (
                <ReviewRow key={r.id} review={r} onEdit={onEdit} showWeakness />
              ))}
            </div>
          </EditorialSection>
          <Rule />
        </>
      )}

      {/* Tags mais usadas */}
      {insights.mostUsedTags.length > 0 && (
        <EditorialSection paddingY="var(--spacing-64)">
          <SectionTitle>Tags mais usadas</SectionTitle>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--spacing-8)",
              borderTop: "1px solid var(--color-hairline)",
              paddingTop: "var(--spacing-20)",
            }}
          >
            {insights.mostUsedTags.map(({ tag, count }) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "var(--tracking-caption)",
                  textTransform: "uppercase",
                  color: "var(--color-headline-ink)",
                  border: "1px solid var(--color-hairline)",
                  borderRadius: "12px",
                  padding: "4px 14px",
                  display: "inline-flex",
                  gap: "var(--spacing-8)",
                  alignItems: "center",
                }}
              >
                {tag}
                <span style={{ opacity: 0.4, fontWeight: "700" }}>{count}</span>
              </span>
            ))}
          </div>
        </EditorialSection>
      )}
    </>
  );
}

export function InsightsPage() {
  const navigate = useNavigate();
  const [reviews] = useState<ReviewEntry[]>(() => getReviews());

  const insights = getReviewInsights(reviews);
  const hasReviews = reviews.length > 0;
  const hasAnalysis = insights.analyzedReviews > 0;

  const handleEdit = (id: string) => navigate(`/escrever/${id}`);

  return (
    <>
      <EditorialSection paddingY="var(--spacing-80)">
        <PageHeading eyebrow="Relatório crítico pessoal">
          Insights
          <br />
          <em>críticos.</em>
        </PageHeading>
      </EditorialSection>

      <Rule />

      {!hasReviews && <EmptyInsights />}

      {hasReviews && !hasAnalysis && (
        <>
          <NoAnalysisNote />
          <Rule />
          <EditorialSection paddingY="var(--spacing-64)">
            <SectionTitle>Panorama geral</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "0 var(--spacing-32)",
              }}
            >
              <StatCard label="Total" value={insights.totalReviews} />
              <StatCard label="Analisadas" value={insights.analyzedReviews} />
              <StatCard label="Sem parecer" value={insights.unanalyzedReviews} />
            </div>
          </EditorialSection>
        </>
      )}

      {hasReviews && hasAnalysis && (
        <InsightsDashboard insights={insights} onEdit={handleEdit} />
      )}
    </>
  );
}
