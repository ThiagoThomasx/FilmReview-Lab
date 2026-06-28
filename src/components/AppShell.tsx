import type { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-paper)",
        color: "var(--color-headline-ink)",
      }}
    >
      <Navigation />
      <main style={{ paddingTop: "73px" }}>{children}</main>
      <footer
        style={{
          borderTop: "1px solid var(--color-headline-ink)",
          paddingTop: "var(--spacing-16)",
          paddingBottom: "var(--spacing-16)",
          paddingLeft: "var(--spacing-32)",
          paddingRight: "var(--spacing-32)",
          fontFamily: "var(--font-neue-montreal)",
          fontSize: "var(--text-caption)",
          letterSpacing: "var(--tracking-caption)",
          color: "var(--color-headline-ink)",
          textTransform: "uppercase",
        }}
      >
        Review Heat — Laboratório Editorial de Crítica Cinematográfica
      </footer>
    </div>
  );
}
