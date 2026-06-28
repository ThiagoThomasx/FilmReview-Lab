import { Link } from "react-router-dom";
import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { Rule } from "../components/Rule";

export function HomePage() {
  return (
    <>
      {/* Hero */}
      <EditorialSection
        paddingY="var(--spacing-80)"
        style={{ minHeight: "calc(100vh - 73px)" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            minHeight: "calc(100vh - 73px - 160px)",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-louize-display)",
                fontSize: "clamp(64px, 10vw, var(--text-display))",
                fontWeight: "var(--font-weight-regular)",
                lineHeight: "var(--leading-display)",
                color: "var(--color-headline-ink)",
                maxWidth: "900px",
              }}
            >
              Review
              <br />
              <em>Heat</em>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-louize)",
                fontSize: "var(--text-subheading)",
                lineHeight: "var(--leading-subheading)",
                color: "var(--color-sepia)",
                marginTop: "var(--spacing-32)",
                maxWidth: "480px",
              }}
            >
              Laboratório editorial de crítica cinematográfica. Escreva,
              analise, evolua.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "var(--spacing-24)",
              marginTop: "var(--spacing-64)",
            }}
          >
            <Link
              to="/escrever"
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                fontWeight: "var(--font-weight-bold)",
                letterSpacing: "var(--tracking-caption)",
                textTransform: "uppercase",
                color: "var(--color-paper)",
                backgroundColor: "var(--color-headline-ink)",
                border: "1px solid var(--color-headline-ink)",
                borderRadius: "var(--radius-buttons)",
                padding: "12px 24px",
                display: "inline-block",
              }}
            >
              Escrever crítica
            </Link>
            <Link
              to="/biblioteca"
              style={{
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "var(--text-caption)",
                fontWeight: "var(--font-weight-bold)",
                letterSpacing: "var(--tracking-caption)",
                textTransform: "uppercase",
                color: "var(--color-headline-ink)",
                border: "1px solid var(--color-headline-ink)",
                borderRadius: "var(--radius-buttons)",
                padding: "12px 24px",
                display: "inline-block",
              }}
            >
              Ver biblioteca
            </Link>
          </div>
        </div>
      </EditorialSection>

      <Rule />

      {/* Manifesto */}
      <InvertedSection paddingY="var(--spacing-80)">
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
            Uma breve nota do laboratório
          </span>
          <p
            style={{
              fontFamily: "var(--font-louize-display)",
              fontSize: "var(--text-heading)",
              fontWeight: "var(--font-weight-regular)",
              lineHeight: "1.2",
              color: "var(--color-paper)",
            }}
          >
            Boa crítica não é opinião. É argumento. O Review Heat existe para
            medir a temperatura do que você escreve — e te ajudar a ir mais
            fundo.
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
            Uma ferramenta pessoal — sem servidor, sem conta
          </span>
        </div>
      </InvertedSection>

      <Rule />

      {/* Sprint roadmap teaser */}
      <EditorialSection paddingY="var(--spacing-80)">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "var(--spacing-32)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-louize-display)",
              fontSize: "var(--text-heading)",
              fontWeight: "var(--font-weight-regular)",
              color: "var(--color-headline-ink)",
            }}
          >
            O que vem aí
          </h2>
          <span
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              letterSpacing: "var(--tracking-caption)",
              textTransform: "uppercase",
              color: "var(--color-ash)",
            }}
          >
            Roadmap
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-4)",
          }}
        >
          {[
            {
              sprint: "Sprint 1",
              title: "Editor & armazenamento",
              desc: "Campo de escrita, salvamento no localStorage, listagem.",
            },
            {
              sprint: "Sprint 2",
              title: "Análise de temperatura",
              desc: "Motor de scoring: profundidade, especificidade, argumento.",
            },
            {
              sprint: "Sprint 3",
              title: "TMDb & metadados",
              desc: "Busca de filmes, pôsteres, géneros e informações do elenco.",
            },
            {
              sprint: "Sprint 4",
              title: "Insights & evolução",
              desc: "Gráficos longitudinais, padrões, sugestões de melhoria.",
            },
          ].map((item, i) => (
            <div
              key={item.sprint}
              style={{
                borderTop: i === 0 ? "1px solid var(--color-hairline)" : "none",
                borderBottom: "1px solid var(--color-hairline)",
                paddingTop: "var(--spacing-20)",
                paddingBottom: "var(--spacing-20)",
                display: "flex",
                gap: "var(--spacing-32)",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "var(--tracking-caption)",
                  textTransform: "uppercase",
                  color: "var(--color-pebble)",
                  minWidth: "80px",
                }}
              >
                {item.sprint}
              </span>
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-neue-montreal)",
                    fontSize: "var(--text-caption)",
                    fontWeight: "var(--font-weight-bold)",
                    letterSpacing: "var(--tracking-caption)",
                    textTransform: "uppercase",
                    color: "var(--color-headline-ink)",
                    display: "block",
                  }}
                >
                  {item.title}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-neue-montreal)",
                    fontSize: "var(--text-caption)",
                    color: "var(--color-ash)",
                    marginTop: "var(--spacing-4)",
                    display: "block",
                  }}
                >
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </EditorialSection>
    </>
  );
}
