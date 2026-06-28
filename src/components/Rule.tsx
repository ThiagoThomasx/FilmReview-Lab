interface RuleProps {
  className?: string;
}

export function Rule({ className = "" }: RuleProps) {
  return (
    <hr
      className={className}
      style={{
        border: "none",
        borderTop: "1px solid var(--color-headline-ink)",
        width: "100%",
      }}
    />
  );
}

export function RuleMuted({ className = "" }: RuleProps) {
  return (
    <hr
      className={className}
      style={{
        border: "none",
        borderTop: "1px solid var(--color-midstone)",
        width: "100%",
      }}
    />
  );
}
