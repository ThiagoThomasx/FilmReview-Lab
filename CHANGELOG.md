# Changelog

## [Unreleased] — Sprint 5: Biblioteca Avançada e Pipeline Editorial

### Adicionado

- `src/domain/reviewLibrary.ts` — domínio puro de biblioteca: tipos `LibraryViewMode`, `ReviewSortOption`, `ReviewAnalysisFilter`, `ReviewLibraryFilters`; funções `filterReviews`, `sortReviews`, `getAvailableTags`, `groupReviewsByStatus`, `getLibraryStats`, `isReviewAnalyzed`, `isReviewAnalysisStale`, `getReviewWordCount`, `DEFAULT_FILTERS`
- `src/domain/reviewLibrary.test.ts` — 50 testes cobrindo busca textual, filtros por status/temperatura/análise/tag, ordenações, extração de tags, agrupamento por status, estatísticas e lista vazia
- `src/components/LibraryStats.tsx` — painel de estatísticas editoriais no topo da biblioteca (total, analisadas, sem parecer, revisar, prontas, publicadas, stale)
- `src/components/LibraryToolbar.tsx` — barra de busca + filtros (status, temperatura, análise, tag) + ordenação + modos de visualização (Arquivo / Pipeline) + botão limpar
- `src/components/LibraryEmptyState.tsx` — empty state editorial para biblioteca vazia e para resultado filtrado vazio
- `src/components/ReviewArchiveItem.tsx` — item de lista no modo Arquivo com ações rápidas: editar, mudar status (inline select), excluir com confirmação; badge "Parecer desatualizado"
- `src/components/ReviewArchiveList.tsx` — lista de archive com cabeçalho editorial e delegação para empty states
- `src/components/ReviewPipelineCard.tsx` — card do pipeline com mudança rápida de status via select sem drag-and-drop
- `src/components/ReviewPipelineColumn.tsx` — coluna do pipeline com cabeçalho, contador e empty state vazio
- `src/components/ReviewPipeline.tsx` — pipeline editorial agrupado por status: Ideia, Rascunho, Analisada, Revisar, Pronta, Publicada, Arquivada

### Alterado

- `src/pages/LibraryPage.tsx` — refatorada para suportar modo Arquivo e Pipeline; estado de filtros, ordenação, view mode; ações rápidas de status; delegate para novos componentes

## [Unreleased] — Sprint 4: Output Visual Premium da Análise

### Adicionado

- `src/lib/analysisCopy.ts` — helpers de copy editorial: `getEditorialDiagnosis(temperature)`, `getScoreStateLabel(score)`, `getLibraryStatusPhrase(temperature)`, `simpleHash(text)`
- `src/lib/analysisCopy.test.ts` — 17 testes cobrindo diagnóstico, estado de score, frase de biblioteca e hash determinístico
- `analysisTextHash?: string` em `ReviewEntry` — hash persistido do texto analisado para detecção de staleness entre sessões

### Alterado

- `src/components/ReviewAnalysisPanel.tsx` — redesign completo como "laudo editorial":
  - Aviso de parecer desatualizado mais prominente com label bold
  - Hero com temperatura em display type (77px) ao lado do score geral
  - Diagnóstico editorial principal em serif com borda lateral
  - ScoreBlock com barra plana, label de estado (Forte / Em desenvolvimento / Frágil) e descrição por dimensão
  - Seção invertida (ink) para pontos fortes e fragilidades
  - Checklist "Como esquentar esta crítica" com ícone de checkbox tipográfico
  - Vocabulário cinematográfico e expressões vagas como tags monocromáticas com borda 1px e radius 12px
  - Mensagem útil quando nenhum termo técnico é detectado
- `src/components/ReviewEditor.tsx` — staleness baseado em hash persistido; salva `analysisTextHash` em `updateReview` e em nova review com análise
- `src/pages/LibraryPage.tsx` — frase de status editorial por temperatura ("Parecer quente", "Precisa reescrita" etc.); label "Sem parecer crítico" para reviews não analisadas

## [Unreleased] — Sprint 3: Motor Local de Análise de Reviews

### Adicionado

- `src/data/technicalTerms.ts` — lista de termos cinematográficos técnicos (direção, fotografia, montagem, mise-en-scène, etc.)
- `src/data/vagueTerms.ts` — lista de expressões vagas que enfraquecem a crítica
- `src/data/argumentTerms.ts` — conectores argumentativos e marcadores de raciocínio
- `src/data/cinemaElements.ts` — elementos narrativos e formais do cinema (cena, plano, travelling, etc.)
- `src/domain/reviewAnalyzer.ts` — motor local de análise com `analyzeReview(text): ReviewAnalysis` e `TEMPERATURE_LABELS`
- `src/domain/reviewAnalyzer.test.ts` — 21 testes cobrindo texto vazio, texto curto, texto vago, termos técnicos, argumento, profundidade, invariantes de score e determinismo
- `src/components/ReviewAnalysisPanel.tsx` — painel editorial visual com temperatura, score geral, barras de dimensão, termos detectados e feedback textual (pontos fortes, fraquezas, sugestões)

### Alterado

- `src/components/ReviewEditor.tsx` — botão "Analisar crítica", exibição do painel de análise, aviso de análise desatualizada quando o texto muda, salvamento da análise junto da review
- `src/pages/LibraryPage.tsx` — exibe temperatura textual e score quando a review foi analisada; exibe "não analisada" quando não há análise
- `src/domain/reviews.test.ts` — corrigido flake de timing no teste de ordenação com `vi.setSystemTime`

### Dimensões de análise

O motor avalia seis dimensões sem IA externa:

| Dimensão | O que mede |
|----------|-----------|
| Profundidade | Tamanho, tema, estrutura, desenvolvimento |
| Especificidade | Presença de elementos formais concretos |
| Argumento | Conectores, causalidade, contraste, tese |
| Estilo | Variedade lexical, ritmo de frases, fluidez |
| Técnica | Vocabulário cinematográfico formal |
| Publicabilidade | Equilíbrio geral, tamanho mínimo, baixa vagueza |

### Temperatura

Calculada a partir do `overallScore`:

| Score | Temperatura | Rótulo |
|-------|-------------|--------|
| 90–100 | hot | QUENTE |
| 70–89 | warm | MORNA |
| 50–69 | cool | FRESCA |
| 30–49 | cold | FRIA |
| 0–29 | frozen | CONGELADA |

### Decisões técnicas

- **Motor puramente local**: nenhuma chamada de API, nenhum LLM, funciona offline
- **Análise determinística**: o mesmo texto produz sempre o mesmo resultado
- **Análise salva no registro**: `updateReview(id, { analysis })` persiste a análise junto da review
- **Indicador de desatualização**: aviso discreto quando o texto muda após a análise sem nova análise
- **Temperatura sem cor**: comunicada por tipografia, contraste e escala — sem verde/vermelho/amarelo/azul

---

## Sprint 2: Escrita e Salvamento de Reviews

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
