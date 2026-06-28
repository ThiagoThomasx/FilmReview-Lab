import type { ReviewStatus, ReviewTemperature } from "../types";
import type {
  LibraryViewMode,
  ReviewAnalysisFilter,
  ReviewLibraryFilters,
  ReviewSortOption,
} from "../domain/reviewLibrary";
import { STATUS_LABELS, ALL_STATUSES } from "../domain/reviews";
import { TEMPERATURE_LABELS } from "../domain/reviewAnalyzer";

type Props = {
  filters: ReviewLibraryFilters;
  viewMode: LibraryViewMode;
  availableTags: string[];
  onFiltersChange: (filters: ReviewLibraryFilters) => void;
  onViewModeChange: (mode: LibraryViewMode) => void;
  onClear: () => void;
};

const TEMPERATURES: ReviewTemperature[] = ["hot", "warm", "cool", "cold", "frozen"];

const SORT_OPTIONS: { value: ReviewSortOption; label: string }[] = [
  { value: "updated-desc", label: "Mais recentes" },
  { value: "updated-asc", label: "Mais antigas" },
  { value: "title-asc", label: "Título A-Z" },
  { value: "title-desc", label: "Título Z-A" },
  { value: "score-desc", label: "Maior score" },
  { value: "score-asc", label: "Menor score" },
  { value: "rating-desc", label: "Maior nota" },
  { value: "rating-asc", label: "Menor nota" },
];

const ANALYSIS_OPTIONS: { value: ReviewAnalysisFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "analyzed", label: "Analisadas" },
  { value: "not-analyzed", label: "Sem parecer" },
  { value: "stale", label: "Parecer desatualizado" },
];

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  color: "var(--color-headline-ink)",
  background: "transparent",
  border: "1px solid var(--color-hairline)",
  borderRadius: "var(--radius-buttons)",
  padding: "6px 10px",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  paddingRight: "24px",
};

const modeButtonStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  letterSpacing: "var(--tracking-caption)",
  textTransform: "uppercase",
  background: active ? "var(--color-headline-ink)" : "transparent",
  color: active ? "var(--color-paper)" : "var(--color-ash)",
  border: "1px solid var(--color-hairline)",
  borderRadius: "var(--radius-buttons)",
  padding: "6px 14px",
  cursor: "pointer",
});

export function LibraryToolbar({
  filters,
  viewMode,
  availableTags,
  onFiltersChange,
  onViewModeChange,
  onClear,
}: Props) {
  function set<K extends keyof ReviewLibraryFilters>(key: K, value: ReviewLibraryFilters[K]) {
    onFiltersChange({ ...filters, [key]: value });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-12)",
        borderBottom: "1px solid var(--color-hairline)",
        paddingBottom: "var(--spacing-16)",
        marginBottom: "var(--spacing-24)",
      }}
    >
      {/* Linha 1: busca + modos de visualização */}
      <div style={{ display: "flex", gap: "var(--spacing-12)", alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="search"
          placeholder="Buscar por título, texto, tag…"
          value={filters.query}
          onChange={(e) => set("query", e.target.value)}
          style={{ ...inputStyle, flex: "1 1 220px", minWidth: 0 }}
        />
        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
          <button type="button" style={modeButtonStyle(viewMode === "archive")} onClick={() => onViewModeChange("archive")}>
            Arquivo
          </button>
          <button type="button" style={modeButtonStyle(viewMode === "pipeline")} onClick={() => onViewModeChange("pipeline")}>
            Pipeline
          </button>
        </div>
      </div>

      {/* Linha 2: filtros + ordenação */}
      <div style={{ display: "flex", gap: "var(--spacing-12)", flexWrap: "wrap", alignItems: "center" }}>
        {/* Status */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.status}
            onChange={(e) => set("status", e.target.value as ReviewStatus | "all")}
            style={selectStyle}
            aria-label="Filtrar por status"
          >
            <option value="all">Todos os status</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {/* Temperatura */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.temperature}
            onChange={(e) => set("temperature", e.target.value as ReviewTemperature | "all")}
            style={selectStyle}
            aria-label="Filtrar por temperatura"
          >
            <option value="all">Toda temperatura</option>
            {TEMPERATURES.map((t) => (
              <option key={t} value={t}>{TEMPERATURE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Análise */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.analysis}
            onChange={(e) => set("analysis", e.target.value as ReviewAnalysisFilter)}
            style={selectStyle}
            aria-label="Filtrar por análise"
          >
            {ANALYSIS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <div style={{ position: "relative" }}>
            <select
              value={filters.tag}
              onChange={(e) => set("tag", e.target.value)}
              style={selectStyle}
              aria-label="Filtrar por tag"
            >
              <option value="all">Todas as tags</option>
              {availableTags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        {/* Ordenação */}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <select
            value={filters.sort}
            onChange={(e) => set("sort", e.target.value as ReviewSortOption)}
            style={selectStyle}
            aria-label="Ordenar por"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Limpar filtros */}
        <button
          type="button"
          onClick={onClear}
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-midstone)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            padding: 0,
            flexShrink: 0,
          }}
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
