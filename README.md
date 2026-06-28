# Review Heat

Laboratório editorial de crítica cinematográfica — pessoal, local-first, sem servidor.

## Visão do produto

Review Heat é uma ferramenta de escrita e análise pessoal. Você escreve ou cola uma crítica de filme. O sistema avalia profundidade, especificidade, argumento e estilo — devolvendo uma **temperatura de leitura**: Quente, Morna, Fria ou Congelada. Com o tempo, você acompanha a evolução da sua escrita através de insights longitudinais.

Nenhuma conta. Nenhum servidor. Todos os dados vivem no seu `localStorage`.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Estilo | Tailwind v4 + CSS Custom Properties |
| Roteamento | React Router v7 |
| Persistência | `localStorage` (local-first) |
| Dados de filmes | TMDb API (somente leitura) |
| Testes unitários | Vitest + React Testing Library |
| Ícones | Lucide React (uso mínimo) |

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar chave TMDb

Crie um arquivo `.env.local` na raiz do projeto (não é commitado):

```bash
VITE_TMDB_API_KEY=sua_chave_aqui
```

Obtenha sua chave gratuitamente em [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

> O app funciona sem a chave, mas a busca de filmes exibirá uma mensagem de configuração pendente.

### 3. Rodar localmente

```bash
npm run dev
```

## Arquitetura

```
src/
  components/     # Componentes base e de busca de filmes
  pages/          # Páginas da aplicação (uma por rota)
  domain/         # Lógica de domínio: storage, cache de buscas, reviews
  lib/            # Cliente TMDb (tmdb.ts)
  data/           # Dados estáticos ou seeds
  styles/         # Tokens CSS (tokens.css)
  types.ts        # Tipos centrais da aplicação
docs/
  DESIGN_REFERENCE.md   # Sistema de design Henry (referência visual)
```

## Comandos

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
npm run test       # Testes unitários (vitest run)
npm run typecheck  # Verificação de tipos (tsc -b)
```

## Design

A identidade visual segue o sistema **Henry** — broadside editorial monocromático quente. Consulte [`docs/DESIGN_REFERENCE.md`](docs/DESIGN_REFERENCE.md) para tokens completos, tipografia, componentes e regras de composição.

### Princípios visuais

- Paleta 100% monocromática quente: `#fafafa` (papel) e `#2a2722` (tinta)
- Hierarquia via escala tipográfica, contraste e inversão de seção
- Zero sombras, zero gradientes, zero cores de destaque
- `border-radius: 12px` único em cards, botões e tags
- Seções alternam entre Paper (`#fafafa`) e Ink (`#2a2722`) como um broadsheet
- Resultados de busca como fichas editoriais, não cards de marketplace

## Fluxo atual do app

1. **Buscar filme** — pesquise pelo nome em `/escrever`, buscas recentes são cacheadas
2. **Selecionar filme** — o painel exibe poster e metadados do filme
3. **Escrever crítica** — formulário editorial com texto, título, nota, status, tags e link Letterboxd
4. **Salvar** — review persiste no `localStorage` e a URL atualiza para `/escrever/:id`
5. **Biblioteca** — `/biblioteca` lista todas as reviews salvas com edição e exclusão

## Persistência de dados

Todos os dados ficam no `localStorage` do navegador, sem servidor.

| Dado | Chave localStorage |
|------|--------------------|
| Reviews | `review-heat:reviews:v1` |
| Cache de buscas | `review-heat:search-cache:v1` |

### Limitações atuais (Sprint 2)

- Nenhuma análise automática de texto
- Nenhum cálculo de temperatura
- Nenhum score ou insight — previsto para Sprint 3

## Decisão: localStorage

O Review Heat é uma ferramenta pessoal, não um serviço. A escolha de `localStorage` elimina a necessidade de conta, autenticação, servidor e custos de infraestrutura. O usuário possui todos os seus dados e pode exportá-los manualmente. A desvantagem é que os dados não são sincronizados entre dispositivos — uma limitação consciente e aceitável para o caso de uso.

## Roadmap por sprints

| Sprint | Foco | Status |
|--------|------|--------|
| **0** | Fundação: Vite, React, TypeScript, Tailwind, Vitest, tipos, storage, layout editorial | ✅ Concluído |
| **1** | Busca de filmes via TMDb, seleção, cache de buscas recentes | ✅ Concluído |
| **2** | Editor de críticas, CRUD completo, salvamento no localStorage, biblioteca | ✅ Concluído |
| 3 | Motor de análise: temperatura, scoring de profundidade, especificidade, argumento | Em planejamento |
| 4 | Insights longitudinais: gráficos, padrões, evolução da escrita | Em planejamento |
