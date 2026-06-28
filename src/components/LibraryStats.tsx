import type { LibraryStats } from "../domain/reviewLibrary";

type Props = {
  stats: LibraryStats;
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-neue-montreal)",
  fontSize: "var(--text-caption)",
  letterSpacing: "var(--tracking-caption)",
  textTransform: "uppercase",
  color: "var(--color-pebble)",
};

const valueStyle: React.CSSProperties = {
  fontFamily: "var(--font-louize-display)",
  fontSize: "var(--text-heading)",
  fontWeight: "var(--font-weight-regular)",
  color: "var(--color-headline-ink)",
  lineHeight: 1,
};

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={valueStyle}>{value}</span>
      <span style={labelStyle}>{label}</span>
    </div>
  );
}

export function LibraryStats({ stats }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--spacing-48)",
        borderBottom: "1px solid var(--color-hairline)",
        paddingBottom: "var(--spacing-32)",
        marginBottom: "var(--spacing-32)",
      }}
    >
      <StatItem value={stats.total} label="Total" />
      <StatItem value={stats.analyzed} label="Analisadas" />
      <StatItem value={stats.notAnalyzed} label="Sem parecer" />
      <StatItem value={stats.needsRevision} label="Revisar" />
      <StatItem value={stats.ready} label="Prontas" />
      <StatItem value={stats.published} label="Publicadas" />
      {stats.stale > 0 && (
        <StatItem value={stats.stale} label="Parecer desatualizado" />
      )}
    </div>
  );
}
