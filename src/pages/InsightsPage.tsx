import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";

const FUTURE_METRICS = [
  {
    label: "Temperatura média",
    description:
      "Média das temperaturas das suas últimas críticas analisadas.",
  },
  {
    label: "Profundidade",
    description: "Quão fundo você vai na análise de cada filme.",
  },
  {
    label: "Especificidade",
    description: "Quantas referências técnicas e concretas aparecem.",
  },
  {
    label: "Argumento",
    description: "Solidez da tese central de cada crítica.",
  },
  {
    label: "Publicabilidade",
    description:
      "Proporção de textos com nível editorial para publicação externa.",
  },
] as const;

export function InsightsPage() {
  return (
    <>
      <EditorialSection paddingY="var(--spacing-80)">
        <PageHeading eyebrow="Evolução da escrita">
          Sua voz
          <br />
          <em>em números.</em>
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
            Análise longitudinal
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
            Com o tempo, o sistema lerá padrões na sua escrita — onde você
            cresce, onde você repete, onde você pode ir mais fundo.
          </p>
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
            Disponível após análises — Sprint 2
          </span>
        </div>
      </InvertedSection>

      <Rule />

      <EditorialSection paddingY="var(--spacing-80)">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-4)",
          }}
        >
          {FUTURE_METRICS.map((metric, i) => (
            <div
              key={metric.label}
              style={{
                borderTop: i === 0 ? "1px solid var(--color-hairline)" : "none",
                borderBottom: "1px solid var(--color-hairline)",
                paddingTop: "var(--spacing-20)",
                paddingBottom: "var(--spacing-20)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "var(--spacing-32)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  fontWeight: "var(--font-weight-bold)",
                  letterSpacing: "var(--tracking-body)",
                  color: "var(--color-headline-ink)",
                  textTransform: "uppercase",
                }}
              >
                {metric.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-ash)",
                  textAlign: "right",
                  maxWidth: "360px",
                }}
              >
                {metric.description}
              </span>
            </div>
          ))}
        </div>
      </EditorialSection>
    </>
  );
}
