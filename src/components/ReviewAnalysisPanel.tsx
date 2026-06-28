import type { ReviewAnalysis } from "../types";
import { TEMPERATURE_LABELS } from "../domain/reviewAnalyzer";
import {
  getEditorialDiagnosis,
  getScoreStateLabel,
} from "../lib/analysisCopy";

type Props = {
  analysis: ReviewAnalysis;
  isStale?: boolean;
};

type ScoreDimension = {
  label: string;
  score: number;
  description: string;
};

function getScoreDimensions(analysis: ReviewAnalysis): ScoreDimension[] {
  return [
    { label: "Profundidade", score: analysis.depthScore, description: "Extensão e densidade temática do texto" },
    { label: "Especificidade", score: analysis.specificityScore, description: "Referências concretas a cenas e escolhas formais" },
    { label: "Argumento", score: analysis.argumentScore, description: "Sustentação lógica e conectores de causa e contraste" },
    { label: "Estilo", score: analysis.styleScore, description: "Variedade lexical, ritmo e clareza da prosa" },
    { label: "Técnica", score: analysis.technicalScore, description: "Domínio do vocabulário cinematográfico" },
    { label: "Publicabilidade", score: analysis.publishabilityScore, description: "Condição geral para publicação editorial" },
  ];
}

function ScoreBlock({ dimension, inverted }: { dimension: ScoreDimension; inverted?: boolean }) {
  const filled = Math.round(dimension.score / 10);
  const stateLabel = getScoreStateLabel(dimension.score);
  const ink = inverted ? "var(--color-paper)" : "var(--color-headline-ink)";
  const muted = inverted ? "rgba(250,250,250,0.5)" : "var(--color-ash)";
  const hairline = inverted ? "rgba(250,250,250,0.2)" : "var(--color-hairline)";
  const blockFilled = inverted ? "var(--color-paper)" : "var(--color-headline-ink)";
  const blockEmpty = inverted ? "rgba(250,250,250,0.15)" : "var(--color-hairline)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-8)",
        paddingBottom: "var(--spacing-16)",
        borderBottom: `1px solid ${hairline}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: ink,
            fontWeight: "var(--font-weight-bold)",
          }}
        >
          {dimension.label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-12)" }}>
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              letterSpacing: "var(--tracking-caption)",
              textTransform: "uppercase",
              color: muted,
            }}
          >
            {stateLabel}
          </span>
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: muted,
              minWidth: "32px",
              textAlign: "right",
            }}
          >
            {dimension.score}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2px" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              flex: 1,
              height: "3px",
              background: i < filled ? blockFilled : blockEmpty,
            }}
          />
        ))}
      </div>

      <span
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          color: muted,
          lineHeight: 1.4,
        }}
      >
        {dimension.description}
      </span>
    </div>
  );
}

function TermTag({ label, inverted }: { label: string; inverted?: boolean }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-neue-montreal)",
        fontSize: "var(--text-caption)",
        color: inverted ? "var(--color-paper)" : "var(--color-headline-ink)",
        border: `1px solid ${inverted ? "rgba(250,250,250,0.35)" : "var(--color-hairline)"}`,
        borderRadius: "var(--radius-tags)",
        padding: "3px 10px",
        lineHeight: 1.4,
      }}
    >
      {label}
    </span>
  );
}

export function ReviewAnalysisPanel({ analysis, isStale = false }: Props) {
  const temperatureLabel = TEMPERATURE_LABELS[analysis.temperature] ?? analysis.temperature.toUpperCase();
  const diagnosis = getEditorialDiagnosis(analysis.temperature);
  const dimensions = getScoreDimensions(analysis);

  const TERM_DISPLAY_LIMIT = 12;
  const technicalToShow = analysis.detectedTerms.slice(0, TERM_DISPLAY_LIMIT);
  const vagueToShow = analysis.vagueTerms.slice(0, TERM_DISPLAY_LIMIT);
  const hiddenTechnical = analysis.detectedTerms.length - technicalToShow.length;
  const hiddenVague = analysis.vagueTerms.length - vagueToShow.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        borderTop: "2px solid var(--color-headline-ink)",
      }}
    >
      {/* Aviso de análise desatualizada */}
      {isStale && (
        <div
          style={{
            borderBottom: "1px solid var(--color-headline-ink)",
            padding: "var(--spacing-16) 0",
            display: "flex",
            alignItems: "baseline",
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
              color: "var(--color-headline-ink)",
              fontWeight: "var(--font-weight-bold)",
            }}
          >
            Parecer desatualizado
          </span>
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-ash)",
            }}
          >
            O texto mudou desde a última análise. Reanalise para atualizar o parecer.
          </span>
        </div>
      )}

      {/* Hero: temperatura + score + diagnóstico */}
      <div
        style={{
          padding: "var(--spacing-32) 0",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-16)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--spacing-8)" }}>
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              letterSpacing: "var(--tracking-caption)",
              textTransform: "uppercase",
              color: "var(--color-ash)",
            }}
          >
            Parecer editorial
          </span>
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              color: "var(--color-pebble)",
            }}
          >
            {analysis.wordCount} {analysis.wordCount === 1 ? "palavra" : "palavras"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--spacing-24)", flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-louize-display)",
              fontSize: "var(--text-heading-lg)",
              fontWeight: "var(--font-weight-regular)",
              color: "var(--color-headline-ink)",
              lineHeight: 0.9,
              letterSpacing: "-1px",
            }}
          >
            {temperatureLabel}
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-4)",
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
              Score geral
            </span>
            <span
              style={{
                fontFamily: "var(--font-louize-display)",
                fontSize: "var(--text-heading)",
                fontWeight: "var(--font-weight-regular)",
                color: "var(--color-headline-ink)",
                lineHeight: 1,
              }}
            >
              {analysis.overallScore}
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-pebble)",
                  marginLeft: "4px",
                }}
              >
                /100
              </span>
            </span>
          </div>
        </div>

        <p
          style={{
            fontFamily: "var(--font-louize)",
            fontSize: "var(--text-body)",
            color: "var(--color-headline-ink)",
            lineHeight: "var(--leading-body)",
            maxWidth: "56ch",
            margin: 0,
            borderLeft: "2px solid var(--color-headline-ink)",
            paddingLeft: "var(--spacing-16)",
          }}
        >
          {diagnosis}
        </p>
      </div>

      {/* Scores por dimensão */}
      <div
        style={{
          borderTop: "1px solid var(--color-hairline)",
          paddingTop: "var(--spacing-24)",
          paddingBottom: "var(--spacing-24)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-16)",
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
          Dimensões da crítica
        </span>
        {dimensions.map((dim) => (
          <ScoreBlock key={dim.label} dimension={dim} />
        ))}
      </div>

      {/* Feedback — seção invertida */}
      {(analysis.strengths.length > 0 || analysis.weaknesses.length > 0) && (
        <div
          style={{
            background: "var(--color-headline-ink)",
            padding: "var(--spacing-32) var(--spacing-24)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-32)",
          }}
        >
          {analysis.strengths.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "var(--tracking-caption)",
                  textTransform: "uppercase",
                  color: "rgba(250,250,250,0.5)",
                }}
              >
                O que sustenta
              </span>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-12)",
                }}
              >
                {analysis.strengths.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: "var(--font-louize)",
                      fontSize: "var(--text-body)",
                      color: "var(--color-paper)",
                      lineHeight: "var(--leading-body)",
                      paddingLeft: "var(--spacing-16)",
                      borderLeft: "1px solid rgba(250,250,250,0.25)",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.weaknesses.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-16)" }}>
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "var(--tracking-caption)",
                  textTransform: "uppercase",
                  color: "rgba(250,250,250,0.5)",
                }}
              >
                O que enfraquece
              </span>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-12)",
                }}
              >
                {analysis.weaknesses.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: "var(--font-louize)",
                      fontSize: "var(--text-body)",
                      color: "var(--color-paper)",
                      lineHeight: "var(--leading-body)",
                      paddingLeft: "var(--spacing-16)",
                      borderLeft: "1px solid rgba(250,250,250,0.25)",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Checklist de reescrita */}
      {analysis.suggestions.length > 0 && (
        <div
          style={{
            paddingTop: "var(--spacing-24)",
            paddingBottom: "var(--spacing-24)",
            borderTop: "1px solid var(--color-hairline)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-16)",
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
            Como esquentar esta crítica
          </span>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-12)",
            }}
          >
            {analysis.suggestions.map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--spacing-12)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-neue-montreal)",
                    fontSize: "var(--text-caption)",
                    color: "var(--color-midstone)",
                    letterSpacing: "0.02em",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  ☐
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-louize)",
                    fontSize: "var(--text-body)",
                    color: "var(--color-headline-ink)",
                    lineHeight: "var(--leading-body)",
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Termos detectados */}
      <div
        style={{
          borderTop: "1px solid var(--color-hairline)",
          paddingTop: "var(--spacing-24)",
          paddingBottom: "var(--spacing-32)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-24)",
        }}
      >
        {/* Vocabulário cinematográfico */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-12)" }}>
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              letterSpacing: "var(--tracking-caption)",
              textTransform: "uppercase",
              color: "var(--color-ash)",
            }}
          >
            Vocabulário cinematográfico
          </span>
          {technicalToShow.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-8)" }}>
              {technicalToShow.map((term) => (
                <TermTag key={term} label={term} />
              ))}
              {hiddenTechnical > 0 && (
                <span
                  style={{
                    fontFamily: "var(--font-neue-montreal)",
                    fontSize: "var(--text-caption)",
                    color: "var(--color-pebble)",
                    padding: "3px 0",
                  }}
                >
                  +{hiddenTechnical} mais
                </span>
              )}
            </div>
          ) : (
            <span
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                color: "var(--color-pebble)",
                fontStyle: "italic",
              }}
            >
              Nenhum termo técnico detectado. Tente citar elementos formais do filme.
            </span>
          )}
        </div>

        {/* Termos vagos */}
        {vagueToShow.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-12)" }}>
            <span
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                letterSpacing: "var(--tracking-caption)",
                textTransform: "uppercase",
                color: "var(--color-ash)",
              }}
            >
              Expressões vagas detectadas
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-8)" }}>
              {vagueToShow.map((term) => (
                <TermTag key={term} label={term} />
              ))}
              {hiddenVague > 0 && (
                <span
                  style={{
                    fontFamily: "var(--font-neue-montreal)",
                    fontSize: "var(--text-caption)",
                    color: "var(--color-pebble)",
                    padding: "3px 0",
                  }}
                >
                  +{hiddenVague} mais
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
