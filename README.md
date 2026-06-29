# Review Heat

Laboratório editorial de crítica cinematográfica — pessoal, local-first, sem servidor.

---

## Visão

Review Heat é uma ferramenta de escrita e análise pessoal para críticos de cinema. Você busca um filme, escreve sua crítica e o sistema devolve um **parecer editorial** com temperatura de leitura, score por dimensão e sugestões de melhoria. Com o tempo, você acompanha a evolução da sua escrita crítica por meio de insights longitudinais.

Nenhuma conta. Nenhum servidor. Todos os dados vivem no `localStorage` do seu navegador.

---

## Features

| Feature | Descrição |
|---------|-----------|
| Busca cinematográfica | Integração TMDb — pôsteres, ano, elenco, metadados |
| Parecer editorial | Motor local de análise: profundidade, especificidade, argumento, estilo, técnica, publicabilidade |
| Temperatura crítica | Score 0–100 classificado em 5 graus (Incandescente → Congelada) |
| Pipeline de produção | 7 estágios: Ideia → Rascunho → Analisada → Revisar → Pronta → Publicada → Arquivada |
| Insights de evolução | Relatório longitudinal com ranking, reescritas prioritárias, distribuição por temperatura e mês |
| Backup versionado | Export/import JSON com esquema versionado |
| Dados demo | 7 reviews de exemplo para explorar o sistema |
| Limpeza segura | Exclusão com confirmação textual + aviso de backup |

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Estilo | Tailwind v4 + CSS Custom Properties |
| Roteamento | React Router v7 |
| Persistência | `localStorage` (local-first) |
| Dados de filmes | TMDb API (somente leitura, via `VITE_TMDB_API_KEY`) |
| Testes | Vitest + React Testing Library |
| Ícones | Lucide React |

---

## Arquitetura

```
src/
├── pages/           # 5 páginas: Home, Escrever, Biblioteca, Insights, Configurações
├── components/      # 21 componentes de UI
├── domain/          # Lógica de negócio pura (reviews, análise, biblioteca, insights, backup)
├── lib/             # TMDb API client, utilitários de análise
├── data/            # Vocabulários de análise (termos técnicos, vagos, argumentativos)
├── styles/          # tokens.css — design tokens + CSS utilitário
└── types.ts         # Tipos TypeScript compartilhados
```

### Domínio

- `reviews.ts` — CRUD de reviews no localStorage
- `reviewAnalyzer.ts` — Motor de análise local (pontuação por 6 dimensões)
- `reviewLibrary.ts` — Filtros, ordenação, pipeline, stats da biblioteca
- `reviewInsights.ts` — Agregações longitudinais para o painel de insights
- `backup.ts` — Serialização/deserialização com versão de esquema
- `movieSearchCache.ts` — Cache de buscas TMDb no localStorage

---

## Design system

Estética editorial/broadsheet. Monochrome quente.

| Token | Valor |
|-------|-------|
| Fundo principal | `#fafafa` (--color-paper) |
| Texto principal | `#2a2722` (--color-headline-ink) |
| Seções invertidas | `#2a2722` fundo + `#fafafa` texto |
| Radius único | 12px |
| Sem sombras | — |
| Sem cores de destaque | — |
| Hierarquia | Tipografia, escala, contraste e inversão |

Fontes: **Louize Display** (display), **Louize** (corpo editorial), **Neue Montreal** (UI/labels).  
Fallbacks open source incluídos no token stack.

Referência completa: [`docs/DESIGN_REFERENCE.md`](docs/DESIGN_REFERENCE.md)

---

## localStorage

Todos os dados são salvos localmente no navegador via `localStorage`. Isso significa:

- **Sem conta** — nenhum cadastro necessário
- **Sem servidor** — o app funciona 100% offline após o primeiro carregamento
- **Dados privados** — nenhuma review sai do seu dispositivo
- **Risco** — limpar o cache do navegador apaga todos os dados

**Recomendado:** exporte backups regularmente via **Configurações → Exportar backup**.

---

## TMDb

A busca de filmes usa a [API pública do TMDb](https://www.themoviedb.org/documentation/api).

A chave é opcional para o restante do app funcionar. Sem ela, a busca exibe uma mensagem de erro amigável, mas todas as outras funcionalidades (escrever, analisar, biblioteca, insights) continuam disponíveis.

---

## Como rodar localmente

```bash
# Clonar o repositório
git clone <url>
cd filmreview-lab

# Instalar dependências
npm install

# Configurar variável de ambiente
cp .env.example .env.local
# Editar .env.local e adicionar sua chave TMDb

# Iniciar servidor de desenvolvimento
npm run dev
```

### Configurar `.env.local`

```env
VITE_TMDB_API_KEY=sua_chave_aqui
```

Para obter uma chave TMDb gratuita: [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção → `dist/` |
| `npm run preview` | Preview do build de produção |
| `npm run typecheck` | Verificação de tipos TypeScript |
| `npm run test` | Rodar testes (Vitest) |
| `npm run test:watch` | Testes em modo watch |

---

## Deploy na Vercel

### Deploy rápido

1. Faça push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o projeto
3. Em **Environment Variables**, adicione:
   - `VITE_TMDB_API_KEY` = `sua_chave_aqui`
4. Clique em **Deploy**

### Configurações automáticas (Vercel detecta automaticamente)

- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Install command**: `npm install`

### Importante

Como o app é 100% local-first com `localStorage`, cada visitante tem seus próprios dados isolados. Não há banco de dados compartilhado.

---

## Limitações conhecidas

- **localStorage** tem limite de ~5–10 MB por domínio. Reviews muito longas ou muitos anexos de análise podem aproximar esse limite.
- **Sem sincronização** — dados não sincronizam entre dispositivos ou navegadores diferentes.
- **Sem autenticação** — qualquer pessoa com acesso ao navegador pode ver e editar os dados.
- **Cache do navegador** — limpar cookies/dados do site apaga todas as reviews.
- **TMDb** — busca de filmes requer conexão com a internet e chave de API válida.

---

## Roadmap futuro

- Sincronização opcional via arquivo (sem servidor)
- Modo de escrita de tela cheia sem distrações
- Export para PDF/Markdown
- Suporte a múltiplos perfis locais
- Comparação de temperaturas entre sessões de escrita

---

## Testes

```bash
npm run test
# 227 testes passando
# Cobertura: domain layer (reviews, análise, biblioteca, insights, backup, cache, tmdb)
```

---

## QA

Checklist completo de QA em [`docs/QA_CHECKLIST.md`](docs/QA_CHECKLIST.md).
