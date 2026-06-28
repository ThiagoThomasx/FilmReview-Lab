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
| Testes unitários | Vitest + React Testing Library |
| Ícones | Lucide React (uso mínimo) |

## Arquitetura

```
src/
  components/     # Componentes base reutilizáveis (AppShell, Navigation, etc.)
  pages/          # Páginas da aplicação (uma por rota)
  domain/         # Lógica de domínio e helpers (storage.ts, futura análise)
  lib/            # Utilitários genéricos
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

## Decisão: localStorage

O Review Heat é uma ferramenta pessoal, não um serviço. A escolha de `localStorage` elimina a necessidade de conta, autenticação, servidor e custos de infraestrutura. O usuário possui todos os seus dados e pode exportá-los manualmente. A desvantagem é que os dados não são sincronizados entre dispositivos — uma limitação consciente e aceitável para o caso de uso.

## Roadmap por sprints

| Sprint | Foco |
|--------|------|
| **0** *(atual)* | Fundação: Vite, React, TypeScript, Tailwind, Vitest, tipos, storage, layout editorial |
| 1 | Editor de críticas, CRUD completo, listagem na biblioteca |
| 2 | Motor de análise: scoring de profundidade, especificidade, argumento, estilo |
| 3 | Integração TMDb: busca de filmes, metadados, pôsteres |
| 4 | Insights longitudinais: gráficos, padrões, evolução da escrita |
