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
4. **Analisar** — clique em "Analisar crítica" para gerar diagnóstico local sem IA externa
5. **Salvar** — review e análise persistem no `localStorage`, URL atualiza para `/escrever/:id`
6. **Biblioteca** — `/biblioteca` lista todas as reviews com temperatura, score e status

## Motor de análise local

O motor de análise (`src/domain/reviewAnalyzer.ts`) avalia a qualidade de uma crítica sem nenhuma IA externa. Funciona offline, é determinístico e não envia dados para nenhum servidor.

### Painel de análise

Ao clicar em **Analisar crítica**, o painel de análise exibe um "laudo editorial" completo:

1. **Temperatura da crítica** — word em display tipo Louize Display, comunicando calor sem usar cores
2. **Score geral** — de 0 a 100, composto ponderado das 6 dimensões
3. **Diagnóstico editorial principal** — frase contextual que resume o estado da crítica
4. **Dimensões da crítica** — 6 barras de progresso com label de estado textual
5. **O que sustenta** — pontos fortes detectados pelo motor
6. **O que enfraquece** — fragilidades identificadas
7. **Como esquentar esta crítica** — checklist de ações de reescrita
8. **Vocabulário detectado** — termos cinematográficos e expressões vagas encontrados

### Temperatura

O score geral (0–100) determina a temperatura da crítica:

| Score | Temperatura | Rótulo PT | Diagnóstico |
|-------|-------------|-----------|-------------|
| 90–100 | hot | QUENTE | Operando em alta temperatura, publicável |
| 70–89 | warm | MORNA | Boa base, precisa de mais concretude |
| 50–69 | cool | FRESCA | Meio do caminho, alterna análise e impressões |
| 30–49 | cold | FRIA | Tem reação mas falta sustentação |
| 0–29 | frozen | CONGELADA | Ainda funciona como sinopse ou registro |

A temperatura é comunicada por tipografia, escala e contraste — sem cores de status, sem verde, vermelho ou amarelo.

### Dimensões avaliadas

| Dimensão | O que mede | Estado |
|----------|-----------|--------|
| **Profundidade** | Tamanho, presença de análise temática, desenvolvimento | Forte / Em desenvolvimento / Frágil |
| **Especificidade** | Referência a elementos formais concretos do filme | Forte / Em desenvolvimento / Frágil |
| **Argumento** | Conectores causais e de contraste, sustentação de tese | Forte / Em desenvolvimento / Frágil |
| **Estilo** | Variedade lexical, ritmo de frases, fluidez do texto | Forte / Em desenvolvimento / Frágil |
| **Técnica** | Uso de vocabulário cinematográfico formal | Forte / Em desenvolvimento / Frágil |
| **Publicabilidade** | Equilíbrio geral, tamanho mínimo, baixa vagueza | Forte / Em desenvolvimento / Frágil |

### Análise desatualizada

Se o texto da crítica for modificado após uma análise, o painel exibe um aviso: **"Parecer desatualizado — O texto mudou desde a última análise. Reanalise para atualizar o parecer."**

A detecção usa um hash determinístico simples do texto analisado, persistido junto da review no `localStorage`. Isso garante que o aviso funcione mesmo após recarregar a página.

Reviews salvas antes da Sprint 4 sem `analysisTextHash` são compatíveis — o sistema usa comparação de texto em memória como fallback.

### Limitações do motor baseado em regras

- A análise é lexical: detecta termos, não semântica. Uma crítica bem escrita sobre estética visual pode não usar os termos exatos da lista e receber score menor.
- O motor não distingue uso irônico ou negativo de termos técnicos.
- Reviews em outros idiomas não são suportadas (vocabulário em português).
- Nenhuma IA externa é usada — nesta versão, o motor é intencionalmente baseado em heurísticas e vocabulário.

## Persistência de dados

Todos os dados ficam no `localStorage` do navegador, sem servidor.

| Dado | Chave localStorage |
|------|--------------------|
| Reviews e análises | `review-heat:reviews:v1` |
| Cache de buscas | `review-heat:search-cache:v1` |

## Decisão: localStorage

O Review Heat é uma ferramenta pessoal, não um serviço. A escolha de `localStorage` elimina a necessidade de conta, autenticação, servidor e custos de infraestrutura. O usuário possui todos os seus dados e pode exportá-los manualmente. A desvantagem é que os dados não são sincronizados entre dispositivos — uma limitação consciente e aceitável para o caso de uso.

## Roadmap por sprints

| Sprint | Foco | Status |
|--------|------|--------|
| **0** | Fundação: Vite, React, TypeScript, Tailwind, Vitest, tipos, storage, layout editorial | ✅ Concluído |
| **1** | Busca de filmes via TMDb, seleção, cache de buscas recentes | ✅ Concluído |
| **2** | Editor de críticas, CRUD completo, salvamento no localStorage, biblioteca | ✅ Concluído |
| **3** | Motor local de análise: temperatura, scoring multidimensional, painel editorial | ✅ Concluído |
| **4** | Output visual premium: diagnóstico editorial, checklist de reescrita, termos detectados, staleness persistido | ✅ Concluído |
| 5 | Insights longitudinais: gráficos, padrões, evolução da escrita | Em planejamento |
