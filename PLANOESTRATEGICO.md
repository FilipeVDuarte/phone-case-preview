# Plano Estratégico — Mobifans Phone Case Previewer
**Atualizado em:** 28 de Abril de 2026
**Versão atual:** 1.6.4 — FECHADA E ESTÁVEL ✅ (main atualizado para v1.6.4)

---

## CHANGELOG DESTA REVISÃO

| Data | Decisão |
|---|---|
| 28/04/2026 | Merge develop → main executado (main atualizado de v1.5 → v1.6.4) |
| 28/04/2026 | v1.7 reformulada: **Estampas** antes de Texto Dinâmico |
| 28/04/2026 | Definidos 10 temas de estampa + 11 cores + lógica de Times separada |
| 26/04/2026 | Feature "Conexão Mobile via QR Code / WebSocket" **pausada** — aguardando confirmação de Wi-Fi dedicado no quiosque |
| 26/04/2026 | v1.6 **fechada oficialmente** como versão estável |

---

## 1. STATUS ATUAL — v1.6.4 (FECHADA ✅)

### O que está 100% funcional e estável

| Feature | Status | Arquivo |
|---|---|---|
| Motor Canvas (drag, zoom, rotação) | ✅ PRONTO | `index.html` |
| Upload local de imagem (PC) | ✅ PRONTO | `index.html` |
| Grid de layouts (Retrato, 3 Fotos, Divisor) | ✅ PRONTO | `index.html` |
| Slots independentes por layout | ✅ PRONTO | `index.html` |
| Exportação PNG 4× (alta resolução) | ✅ PRONTO | `index.html` |
| Historicização de ações (undo, 20 snapshots) | ✅ PRONTO | `index.html` |
| Aviso de DPI baixo (toast) | ✅ PRONTO | `index.html` |
| Aviso de câmera sobreposta | ✅ PRONTO | `index.html` |
| Stepper de 4 passos (Modelo → Foto → Ajuste → Finalizar) | ✅ PRONTO | `index.html` |
| Seletor de modelos Apple/Samsung (via CSV) | ✅ PRONTO | `server/routes/models.ts` |
| Mockups em formato AVIF (~3 MB total) | ✅ PRONTO | `public/assets/previews/` |
| Faca SVG por modelo (33 modelos) | ✅ PRONTO | `public/assets/facas/` |
| Nudge controls (ajuste fino de posição) | ✅ PRONTO | `index.html` |
| Badge de versão | ✅ PRONTO | `index.html` |

### O que foi inativado (pausado, não removido)

| Feature | Status | Onde está o código |
|---|---|---|
| Envio de foto via QR Code (celular → quiosque) | ⏸ PAUSADO | `index.html` (CSS l.551, HTML l.1402, JS l.3130) |
| WebSocket client (`qrWs`) | ⏸ PAUSADO | `index.html` (JS l.3130–3207) |
| Rotas de servidor QR (`/api/session`, `/api/upload/:id`) | ⏸ PAUSADO | `server/routes/qr-upload.ts` (arquivo intacto, não importado) |
| WebSocket server upgrade handler | ⏸ PAUSADO | `server/index.ts` (linhas comentadas com `[QR_PAUSED]`) |
| Página mobile (`/mobile/:sessionId`) | ⏸ PAUSADO | `public/mobile/index.html` (arquivo intacto) |

**Como reativar:** Buscar por `[QR_PAUSED]` e `FEATURE PAUSED` nos arquivos acima e descomentar os blocos correspondentes.

---

## 2. DIAGNÓSTICO: VANTAGEM COMPETITIVA ATUAL

A arquitetura Vanilla JS + AVIF continua sendo ~10× mais leve que a CASETiFY:

| Métrica | CASETiFY | Mobifans v1.6.4 |
|---|---|---|
| Peso total | 32.6 MB | ~3 MB |
| Requests | 207 | ~40 (estimado) |
| Formato de imagens | PNG (sem WebP) | AVIF ✅ |
| Trackers/Ads | 34 domínios externos | 0 |
| JS framework overhead | React + 56 arquivos JS | Vanilla JS, 1 arquivo |

**Princípio:** A arquitetura atual é uma vantagem estratégica — não introduzir dependências pesadas.

---

## 3. ROADMAP REVISADO — ORDEM DE EXECUÇÃO

### ✅ CONCLUÍDO — v1.6.4: Upload Local + Grid de Layouts + Faca + Nudge
Versão estável no main. Upload por PC, canvas funcional, grid multi-slot, exportação 4×, 33 modelos.

---

### 🔴 PRÓXIMO — v1.7.1: Estampas (modo alternativo à foto)

**Por quê agora:** Clientes sem foto disponível no momento podem personalizar a capinha com estampas pré-definidas, aumentando a taxa de conversão no quiosque.

**Conceito:** O usuário que não tem foto pode escolher uma estampa vetorial + cor de fundo e criar uma capinha personalizada, sem precisar de upload. O canvas renderiza a combinação estampa + cor no mesmo slot existente.

#### Temas de estampa disponíveis (Filipe faz os vetores SVG)

| # | Tema | Observação |
|---|---|---|
| 1 | Tartaruga | Padrão animal print |
| 2 | Onça | Padrão animal print |
| 3 | Zebra | Padrão animal print |
| 4 | Óleo | Padrão abstrato / marmorizado |
| 5 | Girafa | Padrão animal print |
| 6 | Vaca | Padrão animal print |
| 7 | Cobra | Padrão animal print (escamas) |
| 8 | Xadrez | Padrão geométrico |
| 9 | Viagem | Padrão temático |
| 10 | Times | **Lógica diferente — implementar por último** |

#### Como Filipe deve entregar os vetores

- **Formato:** SVG inline-compatível (sem `<image>`, sem fontes externas)
- **Estrutura:** O padrão deve ser desenhado como `<pattern>` ou como um tile que pode ser repetido via `patternUnits="userSpaceOnUse"` no canvas
- **Alternativa simples:** SVG plano que cubra uma área quadrada (ex: 500×500 px) — o código fará o tile/scale para preencher o canvas
- **Naming:** `estampa_tartaruga.svg`, `estampa_onca.svg`, etc. (snake_case, sem acento)
- **Pasta de entrega:** `public/assets/estampas/`
- **Cores:** O SVG deve ser desenhado em preto/branco ou em uma cor neutra — a colorização será aplicada via código (filtro CSS/canvas `globalCompositeOperation` ou substituição de cor)

#### Cores disponíveis para combinação

| # | Nome | Hex sugerido |
|---|---|---|
| 1 | Preto | #1A1A1A |
| 2 | Branco | #FFFFFF |
| 3 | Off White | #F5F0E8 |
| 4 | Vermelho | #D72B2B |
| 5 | Azul | #1A4FBF |
| 6 | Laranja | #E8650A |
| 7 | Verde | #2E8B45 |
| 8 | Marrom | #7B4A2D |
| 9 | Amarelo | #F5C518 |
| 10 | Rosa | #E85A8A |
| 11 | Roxo | #7B2FBE |

#### O tema Times — lógica especial (implementar por último na v1.7)

- 3 possibilidades de time: **Brasil**, **Tricolor Gaúcho** (Grêmio), **Colorado** (Inter)
- **Importante:** Não citar os nomes "Grêmio" e "Internacional" — usar apenas "Tricolor Gaúcho" e "Colorado"
- Filipe irá desenhar o padrão de listra/listrado que replica o visual das camisas (sem escudos, sem logos)
- O padrão seguirá a mesma lógica dos outros vetores, mas com identidade visual dos uniformes
- Cores serão fixas por time (não intercambiáveis com a paleta geral)

#### O que construir (código)

- Modo de seleção "Estampa" no Step 2 — toggle entre "Enviar Foto" e "Usar Estampa"
- Grid de seleção de estampa (thumbnails dos SVGs disponíveis)
- Picker de cor (swatches visuais com as 11 cores)
- Renderização no canvas: SVG de estampa carregado como `Image`, colorizado, preenchendo o slot recortado pela faca
- Compatível com os layouts existentes (Retrato, 3 Fotos, Divisor)

**Complexidade:** Média (2–3 dias)
**Arquivo crítico:** `index.html`, `public/assets/estampas/`

---

### 🟠 DEPOIS — v1.7.2: Texto Dinâmico

**O que construir:**
- Botão "Adicionar Texto" na toolbar do Step 3 (botão "T" junto com Rotate/Zoom)
- Input de texto → renderizado como `ctx.fillText()` na camada 4 do canvas
- 3 fontes pré-carregadas via `@font-face` (sem API externa)
- Drag do texto igual ao drag da imagem (reusar mesma lógica de estado)

**Complexidade:** Média (1–2 dias)
**Arquivo crítico:** `index.html`

---

### ⏸ BACKLOG — v1.8: Conexão Mobile via QR Code / WebSocket
**Status:** PAUSADO — aguardando:
1. Confirmação de Wi-Fi dedicado no quiosque (mesma rede LAN que o celular do cliente)
2. Decisão de arquitetura: servidor próprio (LAN) vs. relay externo

**O que já está pronto (só descomentar):**
- Backend: `server/routes/qr-upload.ts` — sessão, upload, WebSocket server
- Frontend CSS + HTML + JS: todos os blocos marcados com `FEATURE PAUSED`
- Página mobile: `public/mobile/index.html`

**Complexidade para retomar:** Baixa (< 1 hora) se infraestrutura confirmada

---

### ⏸ BACKLOG — v1.9: Modo Quiosque
- Timer de inatividade com reset de estado
- Screensaver com carrossel de mockups (CSS animations)
- Config via `localStorage`

---

### ⬜ LONGO PRAZO — v2.0: E-commerce
Sem data definida. Depende de validação dos quiosques primeiro.

---

## 4. PENDÊNCIAS DE UI/UX

| # | Pendência | Prioridade | Tipo |
|---|---|---|---|
| 1 | README desatualizado (lista features prontas como "em desenvolvimento") | 🟡 Média | Documentação |
| 2 | "Como usar" no painel esquerdo ainda menciona 4 passos genéricos | 🟢 Baixa | UX copy |
| 3 | Sem feedback visual de progresso no Step 4 após download | 🟢 Baixa | UX |
| 4 | Modelo padrão não é selecionado automaticamente ao voltar Step 2 → Step 1 | 🟢 Baixa | Bug UX |

---

## 5. O QUE NÃO FAZER (Princípios)

| Armadilha | Por quê evitar |
|---|---|
| Adicionar trackers/pixels de ads | Vai de 0 → dezenas de requests externos |
| Biblioteca de UI pesada (Fabric.js 800KB+) | O canvas atual já faz tudo |
| JSON monolítico de modelos | Manter CSV + carregamento on-demand por modelo |
| Voltar para React | A arquitetura Vanilla JS é uma vantagem, não uma limitação |
| PNG nos mockups | Manter AVIF — ~50% menores que PNG equivalente |
| Backend de terceiros para QR | Latência imprevisível + custo + dependência externa |
| SVGs com fontes externas nas estampas | Vai quebrar em ambiente offline (quiosque sem internet) |

---

## 6. ORÇAMENTO DE PERFORMANCE (Não Ultrapassar)

| Recurso | Atual | Limite Máximo |
|---|---|---|
| HTML/CSS/JS | ~64 KB | 150 KB |
| Imagens mockup | ~3 MB total (33 modelos) | 5 MB (com mais modelos) |
| Estampas SVG | 0 (a criar) | 50 KB por SVG / 500 KB total |
| Libs externas novas | 0 | 2 libs, max 100 KB cada |
| Requests externos | ~40 | 60 |

---

## 7. ARQUIVOS CRÍTICOS

| Arquivo | Relevância |
|---|---|
| `index.html` | Tudo: UI, canvas logic, state, CSS (~3.200 linhas) |
| `server/routes/models.ts` | Endpoint de modelos |
| `server/routes/qr-upload.ts` | Lógica QR pausada — intacta para retomada |
| `server/data/models.csv` | Dados de modelos (adicionar novos aqui) |
| `public/assets/previews/` | Mockups AVIF (manter formato) |
| `public/assets/facas/` | SVG paths de recorte (33 modelos) |
| `public/assets/estampas/` | SVG de estampas — pasta a criar |
| `public/mobile/index.html` | Página mobile QR — pausada, intacta |

---

## 8. CHECKLIST DE VERIFICAÇÃO (a cada sprint)

- [ ] `preview_screenshot` → visual OK no desktop 1440×900
- [ ] `preview_console_logs` → zero erros e zero warnings
- [ ] `preview_resize(375)` → mobile OK (se aplicável)
- [ ] `preview_network` → nenhum request novo > 100 KB
- [ ] Download gera PNG correto com grid visível
- [ ] Canvas renderiza ao selecionar modelo + fazer upload
