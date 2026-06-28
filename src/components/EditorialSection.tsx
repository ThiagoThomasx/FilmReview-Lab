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
      style={{
        backgroundColor: "var(--color-paper)",
        color: "var(--color-headline-ink)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: "var(--spacing-32)",
        paddingRight: "var(--spacing-32)",
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
      style={{
        backgroundColor: "var(--color-headline-ink)",
        color: "var(--color-paper)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: "var(--spacing-32)",
        paddingRight: "var(--spacing-32)",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </section>
  );
}
