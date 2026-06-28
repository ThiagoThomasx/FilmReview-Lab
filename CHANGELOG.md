# Changelog

## [Unreleased] — Sprint 1: Busca de Filmes via TMDb

### Adicionado

- `.env.example` — template de variáveis de ambiente
- `src/lib/tmdb.ts` — cliente TMDb com `searchMovies`, `mapTmdbMovie`, `buildPosterUrl`, `buildBackdropUrl`
- `src/lib/tmdb.test.ts` — 16 testes cobrindo mapper, URLs, busca e estados de erro
- `src/domain/movieSearchCache.ts` — cache de buscas recentes no localStorage (máximo 8 entradas, sem duplicatas)
- `src/domain/movieSearchCache.test.ts` — 16 testes cobrindo save, deduplicação, limite, clear, find
- `src/components/MovieSearchForm.tsx` — formulário de busca editorial
- `src/components/MovieResultItem.tsx` — ficha editorial de resultado (poster sóbrio, título, ano, sinopse, nota)
- `src/components/MovieResultList.tsx` — lista com todos os estados UX: idle, loading, error, no-api-key, empty, success
- `src/components/SelectedMoviePanel.tsx` — painel editorial do filme selecionado com backdrop grayscale
- `src/components/RecentSearches.tsx` — chips de buscas recentes com opção de limpar
- Atualização de `src/pages/WriteReviewPage.tsx` — integra busca completa, seleção e ficha do filme
- Atualização de `src/components/Rule.tsx` — aceita prop `style` para personalização inline

### Alterado

- `README.md` — instruções de configuração TMDb, variável de ambiente, status do roadmap
- `CHANGELOG.md` — entrada da Sprint 1

### Decisões técnicas

- **TMDb somente leitura**: nenhum dado de busca é enviado para servidor próprio
- **Chave via `VITE_TMDB_API_KEY`**: exposta ao cliente Vite intencionalmente (chave pública TMDb)
- **Cache no localStorage**: reutiliza o `storage.ts` da Sprint 0, evita requisições duplicadas
- **Mapper exportado**: `mapTmdbMovie` é testável sem mock de rede
- **Estados UX explícitos**: `idle | loading | error | success | no-api-key` — nenhum estado silencioso

---

## Sprint 0: Fundação do Projeto

### Adicionado

- Configuração base Vite 8 + React 19 + TypeScript
- Tailwind v4 via plugin `@tailwindcss/vite`
- Vitest + React Testing Library + jsdom configurados
- Scripts no `package.json`: `dev`, `build`, `preview`, `test`, `typecheck`
- Estrutura de pastas: `src/components/`, `src/pages/`, `src/domain/`, `src/lib/`, `src/data/`, `docs/`
- `src/types.ts` — tipos centrais: `ReviewEntry`, `MovieInfo`, `ReviewAnalysis`, `ReviewTemperature`, `ReviewStatus`
- `src/domain/storage.ts` — helpers seguros para localStorage com fallback e tratamento de JSON inválido
- `src/domain/storage.test.ts` — 13 testes unitários para todos os helpers de storage
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
