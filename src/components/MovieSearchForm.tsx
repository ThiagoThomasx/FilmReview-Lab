import { type FormEvent, useState } from "react";

type Props = {
  onSearch: (query: string) => void;
  isLoading: boolean;
};

export function MovieSearchForm({ onSearch, isLoading }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "var(--spacing-12)",
        alignItems: "stretch",
        borderBottom: "1px solid var(--color-headline-ink)",
        paddingBottom: "var(--spacing-24)",
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Título do filme..."
        disabled={isLoading}
        autoComplete="off"
        style={{
          flex: 1,
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-body)",
          letterSpacing: "var(--tracking-body)",
          color: "var(--color-headline-ink)",
          backgroundColor: "transparent",
          border: "none",
          borderBottom: "1px solid var(--color-headline-ink)",
          outline: "none",
          paddingBottom: "var(--spacing-8)",
          opacity: isLoading ? 0.5 : 1,
        }}
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        style={{
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          fontWeight: "var(--font-weight-bold)",
          letterSpacing: "var(--tracking-caption)",
          textTransform: "uppercase",
          color: isLoading || !value.trim() ? "var(--color-pebble)" : "var(--color-paper)",
          backgroundColor: isLoading || !value.trim() ? "transparent" : "var(--color-headline-ink)",
          border: "1px solid var(--color-headline-ink)",
          borderRadius: "var(--radius-buttons)",
          padding: "8px 20px",
          cursor: isLoading || !value.trim() ? "not-allowed" : "pointer",
          transition: "background-color 0.15s, color 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        {isLoading ? "Buscando..." : "Buscar"}
      </button>
    </form>
  );
}
