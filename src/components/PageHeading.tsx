import type { ReactNode } from "react";

interface PageHeadingProps {
  eyebrow?: string;
  children: ReactNode;
  inverted?: boolean;
}

export function PageHeading({
  eyebrow,
  children,
  inverted = false,
}: PageHeadingProps) {
  const textColor = inverted
    ? "var(--color-paper)"
    : "var(--color-headline-ink)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-12)" }}>
      {eyebrow && (
        <span
          style={{
            fontFamily: "var(--font-neue-montreal)",
            fontSize: "var(--text-caption)",
            fontWeight: "var(--font-weight-regular)",
            letterSpacing: "var(--tracking-caption)",
            textTransform: "uppercase",
            color: textColor,
            opacity: 0.6,
          }}
        >
          {eyebrow}
        </span>
      )}
      <h1
        style={{
          fontFamily: "var(--font-louize-display)",
          fontSize: "clamp(56px, 8vw, var(--text-heading-lg))",
          fontWeight: "var(--font-weight-regular)",
          lineHeight: "var(--leading-heading-lg)",
          color: textColor,
        }}
      >
        {children}
      </h1>
    </div>
  );
}
