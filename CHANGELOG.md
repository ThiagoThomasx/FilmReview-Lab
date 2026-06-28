# Changelog

## [Unreleased] — Sprint 0: Fundação do Projeto

### Adicionado

- Configuração base Vite 8 + React 19 + TypeScript
- Tailwind v4 via plugin `@tailwindcss/vite`
- Vitest + React Testing Library + jsdom configurados
- Scripts no `package.json`: `dev`, `build`, `preview`, `test`, `typecheck`
- Estrutura de pastas: `src/components/`, `src/pages/`, `src/domain/`, `src/lib/`, `src/data/`, `docs/`
- `src/types.ts` — tipos centrais: `ReviewEntry`, `MovieInfo`, `ReviewAnalysis`, `ReviewTemperature`, `ReviewStatus`
- `src/domain/storage.ts` — helpers seguros para localStorage com fallback e tratamento de JSON inválido
- `src/domain/storage.test.ts` — testes unitários para todos os helpers de storage
- `src/styles/tokens.css` — tokens CSS completos (cores, tipografia, espaçamento, radius) baseados no design Henry
- `src/components/AppShell.tsx` — shell principal com navigation e footer
- `src/components/Navigation.tsx` — navegação editorial uppercase com links ativos
- `src/components/EditorialSection.tsx` — seções Paper e Ink (invertida) reutilizáveis
- `src/components/PageHeading.tsx` — heading editorial com eyebrow opcional
- `src/components/Rule.tsx` — linha divisória editorial (1px, sem margem)
- `src/pages/HomePage.tsx` — hero editorial com manifesto e roadmap
- `src/pages/WriteReviewPage.tsx` — placeholder para o editor de críticas
- `src/pages/LibraryPage.tsx` — placeholder com pipeline de status
- `src/pages/InsightsPage.tsx` — placeholder com métricas futuras
- `src/pages/SettingsPage.tsx` — placeholder com configurações futuras
- `docs/DESIGN_REFERENCE.md` — sistema de design Henry (referência visual)
- `README.md` — visão do produto, stack, arquitetura, comandos, roadmap

### Decisões técnicas

- **localStorage** escolhido como persistência: sem servidor, sem conta, dados do usuário permanecem locais
- **CSS Custom Properties** para tokens de design, compatíveis com Tailwind v4 via `@theme`
- **React Router v7** para roteamento client-side
- **Sem TMDb**, sem análise de review, sem gráficos nesta sprint
