import type { CSSProperties } from "react";

interface RuleProps {
  className?: string;
  style?: CSSProperties;
}

export function Rule({ className = "", style }: RuleProps) {
  return (
    <hr
      className={className}
      style={{
        border: "none",
        borderTop: "1px solid var(--color-headline-ink)",
        width: "100%",
        ...style,
      }}
    />
  );
}

export function RuleMuted({ className = "", style }: RuleProps) {
  return (
    <hr
      className={className}
      style={{
        border: "none",
        borderTop: "1px solid var(--color-midstone)",
        width: "100%",
        ...style,
      }}
    />
  );
}
