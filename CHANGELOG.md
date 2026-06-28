# Changelog

## [Unreleased] — Sprint 2: Escrita e Salvamento de Reviews

### Adicionado

- `src/domain/reviews.ts` — serviço de domínio com CRUD completo de reviews: `createReview`, `getReviews`, `getReviewById`, `updateReview`, `deleteReview`, `clearReviews`, `countWords`, `STATUS_LABELS`
- `src/domain/reviews.test.ts` — 19 testes cobrindo criação, validação, normalização de tags, atualização, exclusão e limpeza
- `src/components/ReviewEditor.tsx` — formulário editorial completo (texto, título, nota, status, tags, Letterboxd), contador de palavras, estado visual de salvo
- `src/components/TagInput.tsx` — input de tags com adição por Enter/vírgula, remoção individual, deduplicação case-insensitive
- Rota `/escrever/:reviewId` em `App.tsx` para edição de review existente via URL

### Alterado

- `src/pages/WriteReviewPage.tsx` — integra `ReviewEditor`, carrega review existente pela URL, redireciona para `/escrever/:id` após salvar, suporta modo criação e edição
- `src/pages/LibraryPage.tsx` — lista reviews reais do localStorage, exibe poster, título, ano, status, nota, tags, contagem de palavras, data; ações de editar e excluir com confirmação; estado vazio com CTA
- `README.md` — fluxo atual do app, chaves de localStorage, limitações da Sprint 2, roadmap atualizado

### Decisões técnicas

- **Chave versionada** `review-heat:reviews:v1`: facilita migração futura sem quebrar dados
- **`crypto.randomUUID()` com fallback**: IDs únicos sem dependência externa
- **Tags normalizadas no domínio**: trim, sem vazias, sem duplicatas case-insensitive — a UI nunca recebe dados sujos
- **Rota dinâmica `/escrever/:reviewId`**: URL reflete o estado, permite abrir link direto para edição
- **Biblioteca sem análise**: status, contagem de palavras e metadados editoriais sem qualquer IA ainda

---

## Sprint 1: Busca de Filmes via TMDb

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
