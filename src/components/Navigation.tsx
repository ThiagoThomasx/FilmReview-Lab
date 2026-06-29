import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Rule } from "./Rule";

const NAV_ITEMS = [
  { label: "ESCREVER", to: "/escrever" },
  { label: "BIBLIOTECA", to: "/biblioteca" },
  { label: "INSIGHTS", to: "/insights" },
  { label: "CONFIGURAÇÕES", to: "/configuracoes" },
] as const;

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    fontFamily: "var(--font-neue-montreal)",
    fontSize: "12px",
    fontWeight: "var(--font-weight-bold)" as const,
    letterSpacing: "var(--tracking-caption)",
    textTransform: "uppercase" as const,
    color: "var(--color-headline-ink)",
    textDecoration: "none",
    opacity: isActive ? 1 : 0.55,
    borderBottom: isActive ? "1px solid var(--color-headline-ink)" : "1px solid transparent",
    paddingBottom: "2px",
    transition: "opacity 0.15s ease",
  });

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
        className="section-pad"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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

        {/* Desktop nav */}
        <ul className="nav-menu" id="nav-menu">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                style={navLinkStyle}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="nav-menu-mobile"
          onClick={() => setIsOpen((v) => !v)}
        >
          <svg
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            aria-hidden="true"
          >
            {isOpen ? (
              <>
                <line x1="2" y1="2" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="20" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="2" y1="2" x2="20" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>
      <Rule />

      {/* Mobile dropdown */}
      <ul
        id="nav-menu-mobile"
        className={`nav-menu${isOpen ? " open" : ""}`}
        aria-hidden={!isOpen}
      >
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              style={({ isActive }) => ({
                fontFamily: "var(--font-neue-montreal)",
                fontSize: "12px",
                fontWeight: "var(--font-weight-bold)",
                letterSpacing: "var(--tracking-caption)",
                textTransform: "uppercase" as const,
                color: "var(--color-headline-ink)",
                opacity: isActive ? 1 : 0.55,
              })}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
