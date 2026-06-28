type Props = {
  queries: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
};

export function RecentSearches({ queries, onSelect, onClear }: Props) {
  if (queries.length === 0) return null;

  return (
    <div
      style={{
        paddingTop: "var(--spacing-20)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-12)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          Buscas recentes
        </span>
        <button
          onClick={onClear}
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: "var(--color-pebble)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Limpar
        </button>
      </div>

      <div style={{ display: "flex", gap: "var(--spacing-8)", flexWrap: "wrap" }}>
        {queries.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            style={{
              fontFamily: "var(--font-neue-montreal)",
              fontSize: "var(--text-caption)",
              letterSpacing: "var(--tracking-caption)",
              color: "var(--color-headline-ink)",
              backgroundColor: "transparent",
              border: "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-tags)",
              padding: "4px 12px",
              cursor: "pointer",
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
