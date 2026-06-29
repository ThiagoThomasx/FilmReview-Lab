import { useState, useRef, useCallback, type ChangeEvent } from "react";
import { EditorialSection, InvertedSection } from "../components/EditorialSection";
import { PageHeading } from "../components/PageHeading";
import { Rule } from "../components/Rule";
import { getReviews, clearReviews } from "../domain/reviews";
import { clearSearchCache } from "../domain/movieSearchCache";
import {
  createBackup,
  downloadBackup,
  parseBackup,
  importBackup,
} from "../domain/backup";
import { getDemoReviews } from "../data/demoReviews";
import { replaceReviews } from "../domain/reviews";

// ─── tipos locais ────────────────────────────────────────────

type Feedback = { kind: "ok" | "err"; message: string } | null;

// ─── estilos compartilhados ──────────────────────────────────

const label: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  fontWeight: "var(--font-weight-bold)",
  letterSpacing: "var(--tracking-caption)",
  textTransform: "uppercase",
  color: "var(--color-headline-ink)",
};

const description: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  color: "var(--color-ash)",
  lineHeight: 1.5,
};

const caption: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  letterSpacing: "var(--tracking-caption)",
  textTransform: "uppercase" as const,
};

const btnBase: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  letterSpacing: "var(--tracking-caption)",
  textTransform: "uppercase",
  border: "1px solid var(--color-hairline)",
  borderRadius: "var(--radius-tags)",
  padding: "6px 14px",
  background: "transparent",
  color: "var(--color-headline-ink)",
  cursor: "pointer",
  transition: "border-color 120ms",
};

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  border: "1px solid var(--color-hairline)",
  borderRadius: "var(--radius-tags)",
  padding: "6px 12px",
  background: "transparent",
  color: "var(--color-headline-ink)",
  width: "120px",
};

// ─── componente de linha de seção ────────────────────────────

function SectionRow({
  children,
  isFirst = false,
}: {
  children: React.ReactNode;
  isFirst?: boolean;
}) {
  return (
    <div
      className="section-row-flex"
      style={{
        borderTop: isFirst ? "1px solid var(--color-hairline)" : "none",
        borderBottom: "1px solid var(--color-hairline)",
        paddingTop: "var(--spacing-20)",
        paddingBottom: "var(--spacing-20)",
      }}
    >
      {children}
    </div>
  );
}

function FeedbackLine({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <span
      style={{
        ...caption,
        color: feedback.kind === "err" ? "var(--color-headline-ink)" : "var(--color-ash)",
        borderLeft: "2px solid var(--color-hairline)",
        paddingLeft: "var(--spacing-8)",
        display: "block",
        marginTop: "var(--spacing-8)",
      }}
    >
      {feedback.message}
    </span>
  );
}

// ─── página ──────────────────────────────────────────────────

export function SettingsPage() {
  const reviews = getReviews();
  const analyzed = reviews.filter((r) => r.analysis !== undefined);

  const backupSize = useCallback(() => {
    const b = createBackup();
    const bytes = new TextEncoder().encode(JSON.stringify(b)).length;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }, []);

  // export
  const [exportFeedback, setExportFeedback] = useState<Feedback>(null);

  function handleExport() {
    try {
      downloadBackup();
      setExportFeedback({ kind: "ok", message: "Backup baixado com sucesso." });
    } catch {
      setExportFeedback({ kind: "err", message: "Falha ao gerar backup." });
    }
  }

  // import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFeedback, setImportFeedback] = useState<Feedback>(null);
  const [pendingImport, setPendingImport] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        parseBackup(text);
        setPendingImport(text);
        setImportFeedback({
          kind: "ok",
          message:
            "Arquivo válido. Clique em 'Confirmar importação' para substituir os dados atuais.",
        });
      } catch (err) {
        setImportFeedback({
          kind: "err",
          message: err instanceof Error ? err.message : "Arquivo inválido.",
        });
        setPendingImport(null);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleConfirmImport() {
    if (!pendingImport) return;
    if (
      !window.confirm(
        "Importar este backup vai substituir TODAS as suas reviews atuais. Continuar?",
      )
    ) {
      setPendingImport(null);
      setImportFeedback(null);
      return;
    }
    try {
      const backup = parseBackup(pendingImport);
      importBackup(backup);
      setPendingImport(null);
      setImportFeedback({
        kind: "ok",
        message: `Importação concluída. ${backup.data.reviews.length} review(s) restaurada(s).`,
      });
    } catch (err) {
      setImportFeedback({
        kind: "err",
        message: err instanceof Error ? err.message : "Falha ao importar.",
      });
    }
  }

  // demo
  const [demoFeedback, setDemoFeedback] = useState<Feedback>(null);

  function handleLoadDemo() {
    if (
      !window.confirm(
        "Carregar os dados demo vai substituir TODAS as suas reviews atuais. Continuar?",
      )
    )
      return;
    const demo = getDemoReviews();
    replaceReviews(demo);
    setDemoFeedback({
      kind: "ok",
      message: `${demo.length} reviews demo carregadas. Explore a Biblioteca e os Insights.`,
    });
  }

  // clear
  const [clearWord, setClearWord] = useState("");
  const [clearFeedback, setClearFeedback] = useState<Feedback>(null);

  function handleClear() {
    if (clearWord !== "APAGAR") {
      setClearFeedback({
        kind: "err",
        message: 'Digite APAGAR para confirmar a exclusão.',
      });
      return;
    }
    clearReviews();
    clearSearchCache();
    setClearWord("");
    setClearFeedback({
      kind: "ok",
      message: "Todos os dados foram apagados.",
    });
  }

  return (
    <>
      <EditorialSection paddingY="var(--spacing-80)">
        <PageHeading eyebrow="Gestão do arquivo local">
          Configurações
          <br />
          <em>do laboratório.</em>
        </PageHeading>
      </EditorialSection>

      <Rule />

      {/* ── estado do arquivo ─────────────────────────── */}
      <InvertedSection paddingY="var(--spacing-64)">
        <div
          className="stats-grid-3"
          style={{
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          {[
            { label: "Reviews", value: reviews.length },
            { label: "Analisadas", value: analyzed.length },
            { label: "Tamanho do backup", value: backupSize() },
          ].map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)" }}>
              <span
                style={{
                  ...caption,
                  color: "var(--color-paper)",
                  opacity: 0.5,
                  fontSize: "var(--text-caption)",
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-louize-display)",
                  fontSize: "var(--text-subheading)",
                  fontWeight: "var(--font-weight-regular)",
                  color: "var(--color-paper)",
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </InvertedSection>

      <Rule />

      {/* ── ações ─────────────────────────────────────── */}
      <EditorialSection paddingY="var(--spacing-80)">
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* exportar */}
          <SectionRow isFirst>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
              <span style={label}>Exportar backup</span>
              <span style={description}>
                Baixa um arquivo JSON com todas as suas reviews e análises.
                <br />
                Recomendado antes de qualquer operação destrutiva.
              </span>
              <FeedbackLine feedback={exportFeedback} />
            </div>
            <button style={btnBase} onClick={handleExport}>
              Baixar JSON
            </button>
          </SectionRow>

          {/* importar */}
          <SectionRow>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
              <span style={label}>Importar backup</span>
              <span style={description}>
                Restaura um backup anterior. A importação substitui{" "}
                <strong>todos os dados atuais</strong>.
              </span>
              <FeedbackLine feedback={importFeedback} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)", alignItems: "flex-end" }}>
              <button style={btnBase} onClick={() => fileInputRef.current?.click()}>
                Selecionar arquivo
              </button>
              {pendingImport && (
                <button
                  style={{ ...btnBase, borderColor: "var(--color-headline-ink)" }}
                  onClick={handleConfirmImport}
                >
                  Confirmar importação
                </button>
              )}
              <label htmlFor="import-file" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                Selecionar arquivo de backup JSON
              </label>
              <input
                ref={fileInputRef}
                id="import-file"
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleFileChange}
                aria-label="Selecionar arquivo de backup JSON"
              />
            </div>
          </SectionRow>

          {/* dados demo */}
          <SectionRow>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
              <span style={label}>Dados demo</span>
              <span style={description}>
                Carrega 7 reviews de exemplo para explorar a Biblioteca e os Insights.
                <br />
                Substitui todos os dados atuais.
              </span>
              <FeedbackLine feedback={demoFeedback} />
            </div>
            <button style={btnBase} onClick={handleLoadDemo}>
              Carregar demo
            </button>
          </SectionRow>

          {/* limpar tudo */}
          <SectionRow>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
              <span style={label}>Limpar todos os dados</span>
              <span style={description}>
                Remove permanentemente todas as reviews e o histórico de buscas.
                <br />
                Ação irreversível. Faça um backup antes.
              </span>
              <div style={{ display: "flex", gap: "var(--spacing-8)", alignItems: "center", marginTop: "var(--spacing-8)" }}>
                <label htmlFor="confirm-clear" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                  Confirmação de exclusão — digite APAGAR
                </label>
                <input
                  id="confirm-clear"
                  type="text"
                  placeholder="Digite APAGAR"
                  value={clearWord}
                  onChange={(e) => setClearWord(e.target.value)}
                  style={inputStyle}
                  aria-describedby="clear-desc"
                />
                <button
                  style={{
                    ...btnBase,
                    opacity: clearWord === "APAGAR" ? 1 : 0.4,
                  }}
                  onClick={handleClear}
                >
                  Apagar tudo
                </button>
              </div>
              <FeedbackLine feedback={clearFeedback} />
            </div>
          </SectionRow>
        </div>
      </EditorialSection>

      <Rule />

      {/* ── nota local-first ──────────────────────────── */}
      <InvertedSection paddingY="var(--spacing-64)">
        <div
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-16)",
          }}
        >
          <span
            style={{
              ...caption,
              color: "var(--color-paper)",
              opacity: 0.5,
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
            Todos os dados vivem no seu navegador. Nenhum servidor. Nenhuma conta.
          </p>
          <span
            style={{
              ...caption,
              color: "var(--color-paper)",
              opacity: 0.4,
              fontSize: "11px",
            }}
          >
            Limpar o cache do navegador apaga todos os dados. Exporte backups regularmente.
          </span>
        </div>
      </InvertedSection>
    </>
  );
}
