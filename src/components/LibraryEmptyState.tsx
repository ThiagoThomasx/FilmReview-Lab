import { useNavigate } from "react-router-dom";

const captionStyle: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  letterSpacing: "var(--tracking-caption)",
  textTransform: "uppercase",
};

const buttonStyle: React.CSSProperties = {
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
};

type Props =
  | { variant: "empty" }
  | { variant: "filtered"; onClear: () => void };

export function LibraryEmptyState(props: Props) {
  const navigate = useNavigate();

  if (props.variant === "empty") {
    return (
      <div
        style={{
          border: "1px dashed var(--color-midstone)",
          borderRadius: "var(--radius-cards)",
          padding: "var(--spacing-64)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-24)",
          alignItems: "center",
        }}
      >
        <p style={{ ...captionStyle, color: "var(--color-pebble)" }}>
          Arquivo pessoal vazio
        </p>
        <p
          style={{
            fontFamily: "var(--font-louize-display)",
            fontSize: "var(--text-subheading)",
            fontWeight: "var(--font-weight-regular)",
            color: "var(--color-headline-ink)",
            lineHeight: 1.3,
            maxWidth: "480px",
          }}
        >
          Seu arquivo crítico ainda está em branco. Busque um filme, escreva uma
          review e comece seu índice pessoal.
        </p>
        <button type="button" onClick={() => navigate("/escrever")} style={buttonStyle}>
          Escrever a primeira
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px dashed var(--color-midstone)",
        borderRadius: "var(--radius-cards)",
        padding: "var(--spacing-64)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-16)",
        alignItems: "center",
      }}
    >
      <p style={{ ...captionStyle, color: "var(--color-pebble)" }}>
        Nenhuma review corresponde aos filtros atuais
      </p>
      <button
        type="button"
        onClick={props.onClear}
        style={{
          ...captionStyle,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--color-midstone)",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        }}
      >
        Limpar filtros
      </button>
    </div>
  );
}
