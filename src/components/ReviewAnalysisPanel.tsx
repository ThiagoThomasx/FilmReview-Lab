import type { ReviewAnalysis } from "../types";
import { TEMPERATURE_LABELS } from "../domain/reviewAnalyzer";

type Props = {
  analysis: ReviewAnalysis;
  isStale?: boolean;
};

type ScoreRowProps = {
  label: string;
  score: number;
};

function ScoreRow({ label, score }: ScoreRowProps) {
  const filled = Math.round(score / 10);
  const blocks = Array.from({ length: 10 }, (_, i) => i < filled);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "var(--spacing-12)",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          letterSpacing: "var(--tracking-caption)",
          textTransform: "uppercase",
          color: "var(--color-ash)",
          minWidth: "140px",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        {blocks.map((on, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              background: on ? "var(--color-headline-ink)" : "var(--color-hairline)",
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          color: "var(--color-midstone)",
          minWidth: "28px",
          textAlign: "right",
        }}
      >
        {score}
      </span>
    </div>
  );
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
      <span
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          letterSpacing: "var(--tracking-caption)",
          textTransform: "uppercase",
          color: "var(--color-ash)",
        }}
      >
        {title}
      </span>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              fontFamily: "var(--font-louize)",
              fontSize: "var(--text-body)",
              color: "var(--color-headline-ink)",
              lineHeight: "var(--leading-body)",
              paddingLeft: "var(--spacing-16)",
              borderLeft: "1px solid var(--color-hairline)",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReviewAnalysisPanel({ analysis, isStale = false }: Props) {
  const temperatureLabel = TEMPERATURE_LABELS[analysis.temperature] ?? analysis.temperature.toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-32)",
        borderTop: "2px solid var(--color-headline-ink)",
        paddingTop: "var(--spacing-32)",
      }}
    >
      {isStale && (
        <p
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            color: "var(--color-midstone)",
            borderBottom: "1px solid var(--color-hairline)",
            paddingBottom: "var(--spacing-12)",
          }}
        >
          O texto foi alterado após a análise. Os resultados podem estar desatualizados.
        </p>
      )}

      {/* Cabeçalho da análise */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "var(--spacing-16)",
          flexWrap: "wrap",
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
          Diagnóstico editorial
        </span>

        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--spacing-16)" }}>
          <span
            style={{
              fontFamily: "var(--font-louize-display)",
              fontSize: "var(--text-heading)",
              fontWeight: "var(--font-weight-regular)",
              color: "var(--color-headline-ink)",
              lineHeight: 1,
            }}
          >
            {temperatureLabel}
          </span>
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-pebble)",
            }}
          >
            {analysis.overallScore}/100
          </span>
        </div>
      </div>

      {/* Scores por dimensão */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-12)",
          borderTop: "1px solid var(--color-hairline)",
          borderBottom: "1px solid var(--color-hairline)",
          paddingTop: "var(--spacing-16)",
          paddingBottom: "var(--spacing-16)",
        }}
      >
        <ScoreRow label="Profundidade" score={analysis.depthScore} />
        <ScoreRow label="Especificidade" score={analysis.specificityScore} />
        <ScoreRow label="Argumento" score={analysis.argumentScore} />
        <ScoreRow label="Estilo" score={analysis.styleScore} />
        <ScoreRow label="Técnica" score={analysis.technicalScore} />
        <ScoreRow label="Publicabilidade" score={analysis.publishabilityScore} />
      </div>

      {/* Metadados */}
      <div
        style={{
          display: "flex",
          gap: "var(--spacing-24)",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            color: "var(--color-pebble)",
          }}
        >
          {analysis.wordCount} {analysis.wordCount === 1 ? "palavra" : "palavras"}
        </span>
        {analysis.detectedTerms.length > 0 && (
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-pebble)",
            }}
          >
            {analysis.detectedTerms.length} {analysis.detectedTerms.length === 1 ? "termo cinematográfico" : "termos cinematográficos"}
          </span>
        )}
        {analysis.vagueTerms.length > 0 && (
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-midstone)",
            }}
          >
            {analysis.vagueTerms.length} {analysis.vagueTerms.length === 1 ? "expressão vaga" : "expressões vagas"}
          </span>
        )}
      </div>

      {/* Feedback editorial */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-24)" }}>
        <FeedbackList title="O que funciona" items={analysis.strengths} />
        <FeedbackList title="O que enfraquece" items={analysis.weaknesses} />
        <FeedbackList title="Para desenvolver" items={analysis.suggestions} />
      </div>
    </div>
  );
}
