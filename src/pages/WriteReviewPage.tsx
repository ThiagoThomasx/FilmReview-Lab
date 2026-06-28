import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";

export function WriteReviewPage() {
  return (
    <>
      <EditorialSection paddingY="var(--spacing-80)">
        <PageHeading eyebrow="Novo registro">
          Escreva
          <br />
          <em>o que sentiu.</em>
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
            Fluxo de trabalho
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
            Cole ou escreva sua crítica. O sistema avaliará profundidade,
            especificidade e argumento — devolvendo uma temperatura de leitura.
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
            Em desenvolvimento — Sprint 1
          </span>
        </div>
      </InvertedSection>

      <Rule />

      <EditorialSection paddingY="var(--spacing-80)">
        <div
          style={{
            border: "1px solid var(--color-hairline)",
            borderRadius: "var(--radius-cards)",
            padding: "var(--spacing-32)",
            minHeight: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              letterSpacing: "var(--tracking-caption)",
              textTransform: "uppercase",
              color: "var(--color-pebble)",
            }}
          >
            Campo de escrita — disponível na Sprint 1
          </p>
        </div>
      </EditorialSection>
    </>
  );
}
