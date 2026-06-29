# QA Checklist — Review Heat V1

Use este checklist antes de qualquer deploy ou release importante.

---

## 1. Fluxo de busca (TMDb)

- [ ] Busca por título retorna resultados com pôster, ano e título
- [ ] Busca sem API key (`VITE_TMDB_API_KEY` ausente) exibe mensagem de erro clara, não quebra o app
- [ ] Busca com API key inválida exibe mensagem de erro compreensível
- [ ] Busca sem resultados exibe estado vazio
- [ ] Erro de rede exibe mensagem de erro
- [ ] Busca recente aparece e é clicável
- [ ] Limpar histórico de busca funciona
- [ ] Selecionar filme carrega o painel do filme selecionado
- [ ] Botão "limpar seleção" volta ao estado de busca

---

## 2. Escrita e salvamento

- [ ] Campo de texto aceita input e conta palavras em tempo real
- [ ] Salvar nova review cria entrada no localStorage
- [ ] Salvar review existente atualiza os dados (não duplica)
- [ ] Campos opcionais (título, nota pessoal, Letterboxd URL) salvam corretamente
- [ ] Tags podem ser adicionadas e removidas
- [ ] Status pode ser alterado no editor
- [ ] Validação impede salvar review sem texto
- [ ] Mensagem "✓ Salvo" aparece após salvar
- [ ] URL muda para `/escrever/:id` após primeira criação
- [ ] Editar review existente via URL `/escrever/:id` carrega dados corretamente

---

## 3. Análise de temperatura

- [ ] Botão "Analisar crítica" gera análise local sem chamada de rede
- [ ] Painel de análise exibe temperatura, score geral e dimensões
- [ ] Pontos fortes e fragilidades são exibidos
- [ ] Sugestões "Como esquentar esta crítica" aparecem
- [ ] Análise desatualizada (texto editado após análise) exibe indicador de staleness
- [ ] Re-analisar atualiza o parecer e remove indicador de staleness
- [ ] Análise persiste ao salvar a review

---

## 4. Biblioteca

- [ ] Lista todas as reviews salvas
- [ ] Estado vazio exibe mensagem clara quando não há reviews
- [ ] Filtros por texto, status, temperatura, análise e tag funcionam
- [ ] Ordenação por data, score e palavras funciona
- [ ] Botão "Editar" navega para o editor da review correta
- [ ] Botão "Excluir" remove a review após confirmação
- [ ] Mudança de status via select inline persiste
- [ ] Stats (total, analisadas, publicadas) exibem contagens corretas
- [ ] Limpar filtros restaura a listagem completa
- [ ] Troca entre modo Arquivo e Pipeline funciona

---

## 5. Pipeline

- [ ] Todas as 7 colunas aparecem (Ideia, Rascunho, Analisada, Revisar, Pronta, Publicada, Arquivada)
- [ ] Reviews aparecem nas colunas corretas conforme status
- [ ] Pipeline faz scroll horizontal em telas menores
- [ ] Botão "Editar" em cada card navega para o editor correto
- [ ] Alterar status via select no card move a review para a coluna correta

---

## 6. Insights

- [ ] Com localStorage vazio, exibe estado vazio com mensagem editorial
- [ ] Com reviews sem análise, exibe nota e panorama básico
- [ ] Com reviews analisadas, exibe dashboard completo:
  - [ ] Panorama geral (totais, publicadas, sem parecer)
  - [ ] Qualidade média (score, palavras, total)
  - [ ] Dimensões da escrita com barras e scores
  - [ ] Temperatura e Status com distribuição
  - [ ] Produção por mês (quando há dados)
  - [ ] Melhores críticas
  - [ ] Reescritas prioritárias
  - [ ] Tags mais usadas
- [ ] Botão "Editar" nos painéis navega para `/escrever/:id` (não `/write/:id`)

---

## 7. Backup, export e import

- [ ] "Exportar backup" baixa arquivo JSON com nome versionado
- [ ] Arquivo exportado contém todas as reviews e análises
- [ ] "Selecionar arquivo" abre seletor de arquivo
- [ ] Arquivo JSON válido exibe confirmação antes de importar
- [ ] Arquivo JSON inválido exibe mensagem de erro
- [ ] Importação substitui todos os dados e exibe contagem de reviews restauradas
- [ ] Cancelar importação não altera dados

---

## 8. Dados demo

- [ ] "Carregar demo" exibe confirmação antes de substituir dados
- [ ] Após carregar, Biblioteca mostra 7 reviews com análise
- [ ] Insights exibem dashboard completo com dados demo
- [ ] Pipeline popula todas as colunas

---

## 9. Limpeza de dados

- [ ] Campo "APAGAR" rejeita confirmação com palavra errada
- [ ] Digite "APAGAR" e clique "Apagar tudo" remove todas as reviews e cache de busca
- [ ] Feedback de confirmação aparece
- [ ] Biblioteca fica vazia após limpeza
- [ ] Insights exibe estado vazio após limpeza

---

## 10. localStorage vazio / edge cases

- [ ] App carrega sem erros com localStorage completamente vazio
- [ ] App carrega sem erros com dados parcialmente corrompidos (deve apenas omitir reviews inválidas)
- [ ] Reviews antigas sem campo `analysis` não quebram a Biblioteca ou Insights
- [ ] App carrega sem `.env.local` — busca TMDb mostra erro de API key, não quebra

---

## 11. Mobile (testar em 375px e 768px)

- [ ] Menu hamburguer aparece em mobile
- [ ] Menu abre e fecha corretamente
- [ ] Links de navegação funcionam e fecham o menu ao clicar
- [ ] Hero da HomePage não transborda a tela
- [ ] Botões da HomePage ficam lado a lado ou empilhados sem overflow
- [ ] Busca TMDb funciona em mobile
- [ ] Editor de review é usável em mobile (textarea, campos, botões)
- [ ] Painel de análise não quebra layout em mobile
- [ ] Biblioteca lista reviews corretamente em mobile
- [ ] Pipeline faz scroll horizontal em mobile
- [ ] Insights: grades de barras, dimensões e meses são legíveis em mobile
- [ ] Insights: Temperatura e Status empilham em mobile (não ficam dois coluntos apertados)
- [ ] Configurações: cada SectionRow empilha conteúdo/botão verticalmente em mobile
- [ ] Configurações: stats (3 colunas) reduz para 2 colunas em mobile
- [ ] Nada extrapola a largura da tela (sem scroll horizontal involuntário)

---

## 12. Desktop (1280px+)

- [ ] Layout editorial é mantido — sem elementos esticados ou desproporcionais
- [ ] Navegação horizontal aparece completa
- [ ] Seções invertidas (#2a2722) e de papel (#fafafa) alternam corretamente
- [ ] Tipografia hierárquica está legível e bem escalada

---

## 13. Acessibilidade básica

- [ ] Foco de teclado é visível em inputs, botões e links
- [ ] Navegação por Tab percorre os elementos na ordem correta
- [ ] Botões têm texto claro ou aria-label
- [ ] Inputs têm labels associados (via `<label>` ou aria)
- [ ] Contraste de texto é suficiente (texto escuro em fundo claro e vice-versa)
- [ ] Headings seguem hierarquia razoável (h1 → h2)

---

## 14. Build

```bash
npm run typecheck   # sem erros
npm run test        # 227 testes passando
npm run build       # build sem erros, dist/ gerado
```

- [ ] `typecheck` passa sem erros
- [ ] `test` passa — todos os 227 testes
- [ ] `build` gera `dist/` sem erros

---

## 15. Deploy (Vercel)

- [ ] `VITE_TMDB_API_KEY` configurada em Environment Variables no Vercel
- [ ] Deploy bem-sucedido
- [ ] URL de produção abre a Home
- [ ] Busca TMDb funciona em produção
- [ ] localStorage persiste entre reloads na URL de produção
