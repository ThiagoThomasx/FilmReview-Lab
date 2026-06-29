import type { ReactNode, CSSProperties } from "react";

interface EditorialSectionProps {
  children: ReactNode;
  paddingY?: string;
  style?: CSSProperties;
}

export function EditorialSection({
  children,
  paddingY = "var(--spacing-80)",
  style,
}: EditorialSectionProps) {
  return (
    <section
      className="section-pad"
      style={{
        backgroundColor: "var(--color-paper)",
        color: "var(--color-headline-ink)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

interface InvertedSectionProps {
  children: ReactNode;
  paddingY?: string;
  style?: CSSProperties;
}

export function InvertedSection({
  children,
  paddingY = "var(--spacing-64)",
  style,
}: InvertedSectionProps) {
  return (
    <section
      className="section-pad"
      style={{
        backgroundColor: "var(--color-headline-ink)",
        color: "var(--color-paper)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </section>
  );
}
