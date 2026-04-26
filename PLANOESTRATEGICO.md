# Plano Estratégico — Mobifans Phone Case Previewer
**Atualizado em:** 26 de Abril de 2026
**Versão atual:** 1.6 — FECHADA E ESTÁVEL ✅

---

## CHANGELOG DESTA REVISÃO

| Data | Decisão |
|---|---|
| 26/04/2026 | Feature "Conexão Mobile via QR Code / WebSocket" **pausada** — aguardando confirmação de Wi-Fi dedicado no quiosque físico e definição de arquitetura sem backend de terceiros |
| 26/04/2026 | v1.6 **fechada oficialmente** como versão estável para uso no quiosque (upload local via PC) |
| 26/04/2026 | Ordem de sprints revisada — QR Code movido para backlog |

---

## 1. STATUS ATUAL — v1.6 (FECHADA ✅)

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
| Faca SVG por modelo | ✅ PRONTO | `public/assets/facas/` |

### O que foi inativado nesta versão (pausado, não removido)

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

| Métrica | CASETiFY | Mobifans v1.6 |
|---|---|---|
| Peso total | 32.6 MB | ~3 MB |
| Requests | 207 | ~40 (estimado) |
| Formato de imagens | PNG (sem WebP) | AVIF ✅ |
| Trackers/Ads | 34 domínios externos | 0 |
| JS framework overhead | React + 56 arquivos JS | Vanilla JS, 1 arquivo |

**Princípio:** A arquitetura atual é uma vantagem estratégica — não introduzir dependências pesadas.

---

## 3. ROADMAP REVISADO — ORDEM DE EXECUÇÃO

### ✅ CONCLUÍDO — v1.6: Upload Local + Grid de Layouts
Versão estável. Upload por PC, canvas funcional, grid multi-slot, exportação 4×.

---

### 🔴 PRÓXIMO — v1.7: Texto Dinâmico
**Por quê agora:** Aumenta personalização sem depender de infraestrutura. Feature 100% offline, alinhada com o foco atual no quiosque sem Wi-Fi garantido.

**O que construir:**
- Botão "Adicionar Texto" na toolbar do Step 3 (botão "T" junto com Rotate/Zoom)
- Input de texto → renderizado como `ctx.fillText()` na camada 4 do canvas
- 3 fontes pré-carregadas via `@font-face` (sem API externa)
- Drag do texto igual ao drag da imagem (reusar mesma lógica de estado)

**Complexidade:** Média (1–2 dias)
**Arquivo crítico:** `index.html`

---

### 🟠 BACKLOG — v1.8: Conexão Mobile via QR Code / WebSocket
**Status:** ⏸ PAUSADO — aguardando:
1. ✅ Confirmação de Wi-Fi dedicado no quiosque (verificar amanhã)
2. ✅ Decisão de arquitetura: servidor próprio (LAN) vs. relay externo
3. ✅ Teste de viabilidade da conexão na rede da loja

**Pré-requisitos para retomar:**
- Wi-Fi do quiosque acessível ao celular do cliente (mesma rede LAN)
- Servidor rodando localmente (já existe: `dev-server.js` na porta 8080)
- IP local fixo ou DHCP reservado para o PC do quiosque

**O que já está pronto (só descomentar):**
- Backend: `server/routes/qr-upload.ts` — sessão, upload, WebSocket server
- Frontend CSS + HTML + JS: todos os blocos marcados com `FEATURE PAUSED`
- Página mobile: `public/mobile/index.html`

**Complexidade para retomar:** Baixa (< 1 hora) se infraestrutura confirmada

---

### 🟡 BACKLOG — v1.8 (complemento): Modo Quiosque
**Depende do QR estar funcional ou de decisão de lançar sem ele.**

**O que construir:**
- Timer de inatividade: `setTimeout` → reset de estado após X segundos configurável
- Screensaver: carrossel de mockups com CSS animations (sem JS pesado)
- Config via `localStorage` (tempo de reset, ativar/desativar)

**Complexidade:** Baixa (0.5–1 dia)

---

### ⬜ LONGO PRAZO — v2.0: E-commerce
Sem data definida. Depende de validação dos quiosques primeiro.

---

## 4. PENDÊNCIAS ATUAIS DE UI/UX (v1.6 → v1.7)

Itens a resolver antes ou durante o sprint de v1.7:

| # | Pendência | Prioridade | Tipo |
|---|---|---|---|
| 1 | README desatualizado (lista features prontas como "em desenvolvimento") | 🟡 Média | Documentação |
| 2 | "Como usar" no painel esquerdo ainda menciona 4 passos genéricos — poderia ser mais específico ao fluxo atual com grid | 🟢 Baixa | UX copy |
| 3 | Sem feedback visual de progresso no Step 4 (Finalizar) após download | 🟢 Baixa | UX |
| 4 | Modelo padrão não é selecionado automaticamente ao voltar do Step 2 ao Step 1 | 🟢 Baixa | Bug UX |

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

---

## 6. ORÇAMENTO DE PERFORMANCE (Não Ultrapassar)

| Recurso | Atual | Limite Máximo |
|---|---|---|
| HTML/CSS/JS | ~64 KB | 150 KB |
| Imagens mockup | ~3 MB total (33 modelos) | 5 MB (com mais modelos) |
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
| `public/assets/facas/` | SVG paths de recorte |
| `public/mobile/index.html` | Página mobile QR — pausada, intacta |

---

## 8. CHECKLIST DE VERIFICAÇÃO (a cada sprint)

- [ ] `preview_screenshot` → visual OK no desktop 1440×900
- [ ] `preview_console_logs` → zero erros e zero warnings
- [ ] `preview_resize(375)` → mobile OK (se aplicável)
- [ ] `preview_network` → nenhum request novo > 100 KB
- [ ] Download gera PNG correto com grid visível
- [ ] Canvas renderiza ao selecionar modelo + fazer upload
