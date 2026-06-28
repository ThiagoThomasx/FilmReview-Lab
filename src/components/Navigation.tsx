import { NavLink } from "react-router-dom";
import { Rule } from "./Rule";

const NAV_ITEMS = [
  { label: "ESCREVER", to: "/escrever" },
  { label: "BIBLIOTECA", to: "/biblioteca" },
  { label: "INSIGHTS", to: "/insights" },
  { label: "CONFIGURAÇÕES", to: "/configuracoes" },
] as const;

export function Navigation() {
  return (
    <nav
      aria-label="Navegação principal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--color-paper)",
        zIndex: 100,
      }}
    >
      <Rule />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "var(--spacing-32)",
          paddingRight: "var(--spacing-32)",
          paddingTop: "var(--spacing-16)",
          paddingBottom: "var(--spacing-16)",
        }}
      >
        <NavLink
          to="/"
          style={{
            fontFamily: "var(--font-louize-display)",
            fontSize: "var(--text-body)",
            fontWeight: "var(--font-weight-regular)",
            color: "var(--color-headline-ink)",
            letterSpacing: "-0.01em",
          }}
        >
          Review Heat
        </NavLink>

        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "var(--spacing-32)",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                style={({ isActive }) => ({
                  fontFamily: "var(--font-neue-montreal)",
                  fontSize: isActive ? "16px" : "12px",
                  fontWeight: "var(--font-weight-bold)",
                  letterSpacing: "var(--tracking-caption)",
                  textTransform: "uppercase" as const,
                  color: "var(--color-headline-ink)",
                  textDecoration: "none",
                  transition: "font-size 0.15s ease",
                })}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Rule />
    </nav>
  );
}
