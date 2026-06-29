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
6. **Biblioteca** — `/biblioteca` lista todas as reviews em modo Arquivo ou Pipeline, com busca, filtros, ordenação e ações rápidas
7. **Insights** — `/insights` exibe relatório editorial de evolução crítica: scores, dimensões, distribuições e tendências

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

## Biblioteca avançada

A biblioteca (`/biblioteca`) é um arquivo crítico pessoal com dois modos de visualização e um conjunto completo de filtros.

### Modos de visualização

| Modo | Descrição |
|------|-----------|
| **Arquivo** | Lista editorial com todos os metadados, status, temperatura e ações rápidas |
| **Pipeline** | Colunas agrupadas por status — Ideia, Rascunho, Analisada, Revisar, Pronta, Publicada, Arquivada |

### Busca textual

A busca procura simultaneamente em: título do filme, ano, título da review, texto completo da crítica, tags, label de status e label de temperatura.

### Filtros disponíveis

| Filtro | Opções |
|--------|--------|
| **Status** | Todos / Ideia / Rascunho / Analisada / Revisar / Pronta / Publicada / Arquivada |
| **Temperatura** | Toda temperatura / QUENTE / MORNA / FRESCA / FRIA / CONGELADA |
| **Análise** | Todas / Analisadas / Sem parecer / Parecer desatualizado |
| **Tag** | Todas as tags / qualquer tag presente nas reviews |

### Ordenações disponíveis

- Mais recentes / Mais antigas (por `updatedAt`)
- Título A-Z / Título Z-A
- Maior score / Menor score (reviews sem análise vão ao final)
- Maior nota pessoal / Menor nota pessoal

### Estatísticas da biblioteca

No topo da biblioteca, um painel exibe: total, analisadas, sem parecer, revisar, prontas, publicadas e pareceres desatualizados.

### Ações rápidas

No modo Arquivo, cada item permite: **editar** (navega para o editor), **alterar status** (select inline), **excluir** (com confirmação). No Pipeline, cada card permite editar e mudar de status via select.

### Limitações atuais

- Sem drag-and-drop no pipeline (planejado para sprint futura)
- Sem integração automática com Letterboxd
- Sem backend ou sincronização entre dispositivos

## Insights críticos

A aba **Insights** (`/insights`) apresenta um relatório editorial da evolução da sua escrita, calculado localmente a partir das reviews salvas.

### Métricas disponíveis

| Seção | Métricas |
|-------|----------|
| **Panorama geral** | Total, analisadas, sem parecer, desatualizadas, publicadas, prontas, para revisar |
| **Qualidade média** | Score médio geral, média de palavras por review, total de palavras escritas |
| **Dimensões da escrita** | Médias das 6 dimensões + dimensão mais forte e mais fraca |
| **Temperatura** | Distribuição de reviews por temperatura (quente a congelada) |
| **Status** | Distribuição de reviews por status de pipeline |
| **Produção por mês** | Quantidade de reviews e score médio por mês |
| **Melhores críticas** | Top 5 reviews por score geral |
| **Reescritas prioritárias** | Até 5 reviews com menor score ou status "revisar" |
| **Tags mais usadas** | Tags mais frequentes no arquivo |

### Como interpretar a evolução crítica

- **Score médio crescendo** — sua escrita está ganhando calor ao longo do tempo.
- **Dimensão mais fraca** — indica onde focar nas próximas reescritas.
- **Temperatura MORNA ou QUENTE** na distribuição — proporção de reviews publicáveis.
- **Reescritas prioritárias** — reviews que mais ganhariam com uma revisão.

### Limitações dos insights

- Baseados nos dados locais do `localStorage` — não há comparação com outros autores.
- O score médio reflete apenas reviews que passaram por análise.
- Reviews escritas em outros idiomas têm scores potencialmente subestimados (motor em português).
- Não há histórico temporal de scores — só o estado atual de cada review.

Reviews salvas antes da Sprint 4 sem `analysisTextHash` são compatíveis — o sistema usa comparação de texto em memória como fallback.

### Limitações do motor baseado em regras

- A análise é lexical: detecta termos, não semântica. Uma crítica bem escrita sobre estética visual pode não usar os termos exatos da lista e receber score menor.
- O motor não distingue uso irônico ou negativo de termos técnicos.
- Reviews em outros idiomas não são suportadas (vocabulário em português).
- Nenhuma IA externa é usada — nesta versão, o motor é intencionalmente baseado em heurísticas e vocabulário.

## Backup e gestão de dados

A aba **Configurações** (`/configuracoes`) é o painel de controle do arquivo local.

### Exportar backup

Clique em **Baixar JSON** para gerar um arquivo `review-heat-backup-YYYY-MM-DD.json`. O arquivo contém todas as suas reviews, análises e histórico de buscas. O formato é versionado:

```json
{
  "app": "review-heat",
  "version": 1,
  "exportedAt": "2025-01-15T10:30:00.000Z",
  "data": {
    "reviews": [ ... ],
    "recentSearches": [ ... ]
  }
}
```

### Importar backup

Selecione um arquivo `.json` gerado pelo Review Heat. O sistema valida o formato antes de qualquer alteração — se o arquivo for inválido ou de outra aplicação, os dados atuais não são tocados. Após a validação, uma confirmação é exibida antes de substituir os dados.

### Dados demo

Carrega 7 reviews de exemplo realistas com statuses variados (publicada, pronta, revisar, analisada, rascunho, ideia, arquivada) para explorar a Biblioteca e os Insights sem precisar escrever reviews reais.

### Limpar todos os dados

Digite `APAGAR` no campo de confirmação e clique em **Apagar tudo**. Remove todas as reviews e o histórico de buscas. Esta ação é irreversível — exporte um backup antes.

### Riscos do localStorage

- **Limpar dados do navegador** apaga todas as reviews permanentemente.
- O `localStorage` tem um limite de ~5 MB por domínio — arquivos com muitas reviews longas podem se aproximar desse limite.
- Os dados não são sincronizados entre dispositivos ou navegadores diferentes.
- **Recomendação:** exporte um backup regularmente, especialmente antes de atualizar o navegador ou limpar o cache.

## Persistência de dados

Todos os dados ficam no `localStorage` do navegador, sem servidor.

| Dado | Chave localStorage |
|------|--------------------|
| Reviews e análises | `review-heat:reviews:v1` |
| Cache de buscas | `review-heat:search-cache` |

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
| **5** | Biblioteca avançada: busca, filtros, ordenação, pipeline, estatísticas, ações rápidas | ✅ Concluído |
| **6** | Insights críticos: domínio de insights, panorama geral, dimensões, distribuições, produção mensal, top reviews | ✅ Concluído |
| **7** | Backup versionado, export/import JSON, dados demo, limpeza segura, configurações funcionais | ✅ Concluído |
