import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";

const FUTURE_SETTINGS = [
  {
    label: "Chave TMDb",
    description:
      "Integração com The Movie Database para busca e metadados de filmes.",
    status: "Sprint 3",
  },
  {
    label: "Exportar dados",
    description:
      "Backup completo em JSON de todas as suas críticas e análises.",
    status: "Sprint 2",
  },
  {
    label: "Importar dados",
    description:
      "Restaurar um backup anterior. Nenhum dado é armazenado externamente.",
    status: "Sprint 2",
  },
  {
    label: "Limpar biblioteca",
    description:
      "Remover todas as entradas do localStorage. Ação irreversível.",
    status: "Sprint 2",
  },
] as const;

export function SettingsPage() {
  return (
    <>
      <EditorialSection paddingY="var(--spacing-80)">
        <PageHeading eyebrow="Preferências e integrações">
          Configurações
          <br />
          <em>do laboratório.</em>
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
            Local-first
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
            Todos os dados vivem no seu navegador. Nenhum servidor. Nenhuma
            conta. Você controla tudo.
          </p>
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
          {FUTURE_SETTINGS.map((setting, i) => (
            <div
              key={setting.label}
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
                    fontWeight: "var(--font-weight-bold)",
                    letterSpacing: "var(--tracking-caption)",
                    color: "var(--color-headline-ink)",
                    textTransform: "uppercase",
                  }}
                >
                  {setting.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-neue-montreal)",
                    fontSize: "var(--text-caption)",
                    color: "var(--color-ash)",
                  }}
                >
                  {setting.description}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: "var(--text-caption)",
                  letterSpacing: "var(--tracking-caption)",
                  textTransform: "uppercase",
                  color: "var(--color-pebble)",
                  whiteSpace: "nowrap",
                  border: "1px solid var(--color-hairline)",
                  borderRadius: "var(--radius-tags)",
                  padding: "4px 8px",
                }}
              >
                {setting.status}
              </span>
            </div>
          ))}
        </div>
      </EditorialSection>
    </>
  );
}
