import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";

const PIPELINE_STATUSES = [
  { label: "IDEIA", description: "Anotação inicial, sem texto desenvolvido." },
  { label: "RASCUNHO", description: "Crítica em desenvolvimento." },
  { label: "ANALISADA", description: "Temperatura calculada pelo sistema." },
  { label: "REVISÃO", description: "Marcada para refinamento." },
  { label: "PRONTA", description: "Aprovada para publicação." },
  { label: "PUBLICADA", description: "Circulando externamente." },
  { label: "ARQUIVADA", description: "Encerrada ou obsoleta." },
] as const;

export function LibraryPage() {
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
            Pipeline editorial
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "var(--spacing-16)",
          }}
        >
          {PIPELINE_STATUSES.map((s) => (
            <div
              key={s.label}
              style={{
                border: "1px solid var(--color-hairline)",
                borderRadius: "var(--radius-cards)",
                padding: "var(--card-padding)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-8)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  fontWeight: "var(--font-weight-bold)",
                  letterSpacing: "var(--tracking-caption)",
                  textTransform: "uppercase",
                  color: "var(--color-headline-ink)",
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-ash)",
                  lineHeight: "1.4",
                }}
              >
                {s.description}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "var(--spacing-64)",
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
            }}
          >
            Nenhuma crítica ainda — escreva a primeira
          </p>
        </div>
      </EditorialSection>
    </>
  );
}
