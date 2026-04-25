# Plano Estratégico — Mobifans Phone Case Previewer
**Data:** 24 de Abril de 2026  
**Contexto:** Análise do roadmap v1.6–v2.0 com base no estado real do codebase e na análise de performance da CASETiFY

---

## 1. DIAGNÓSTICO: O QUE JÁ ESTÁ PRONTO (README DESATUALIZADO)

O README lista vários itens como "em desenvolvimento" que já estão **totalmente implementados** no código atual:

| Item no README | Status Real |
|---|---|
| Motor Canvas completo (drag, zoom, rotação) | ✅ PRONTO em `index.html` |
| Upload de imagens externas | ✅ PRONTO (FileReader + canvas) |
| Exportação de previews | ✅ PRONTO (canvas.toBlob → 4× PNG) |
| Historicização de ações | ✅ PRONTO (undo stack, 20 snapshots) |

**Ação necessária:** Atualizar o README para refletir o estado real antes de planejar próximas versões.

---

## 2. VANTAGEM COMPETITIVA ATUAL vs. CASETiFY

A análise da CASETiFY mostra 32 MB / 207 requests. O Mobifans hoje:

| Métrica | CASETiFY | Mobifans Atual |
|---|---|---|
| Peso total | 32.6 MB | ~3 MB |
| Requests | 207 | ~40 (estimado) |
| Formato de imagens | PNG (sem WebP!) | AVIF ✅ |
| Trackers/Ads | 34 domínios externos | 0 |
| JS framework overhead | React + 56 arquivos JS | Vanilla JS, 1 arquivo |

**Conclusão: O Mobifans já está ~10× mais leve que o concorrente. A arquitetura atual (Vanilla JS + AVIF) é uma vantagem estratégica que deve ser preservada.**

---

## 3. ROADMAP REVISADO — PRIORIDADE POR VALOR DE NEGÓCIO

### 🔴 PRIORIDADE 1 — v1.6: Grid de Colagens
**Por quê primeiro:** É o diferencial criativo central. Casos com colagem de 2–6 fotos têm maior ticket médio e são o produto mais popular em quiosques físicos. Toda a arquitetura canvas atual suporta essa expansão.

**O que construir:**
- Seletor de layout de grid (1, 2, 4, 6 espaços) no Step 2
- Múltiplos slots de imagem com drag/zoom/rotação independentes por slot
- Cada slot usa a mesma lógica de `drawLayer1()` existente — apenas replicate com offsets
- Aviso de DPI: checar `img.naturalWidth / slotWidthPx < 72dpi` → toast de aviso

**Complexidade:** Alta (2–3 dias)  
**Arquivo crítico:** `index.html` (toda a lógica de canvas e state)

---

### 🔴 PRIORIDADE 2 — v1.8 (parcial): Upload QR Code
**Por quê urgente:** Resolve o maior atrito do quiosque físico. Cliente não precisa plugar cabo nem fazer login — escaneia QR, envia foto do celular, aparece direto no canvas.

**O que construir:**
- Geração de QR code dinâmico na tela (biblioteca leve: `qrcode.js`, 40KB)
- Página web simplificada para o celular do cliente (`/upload` endpoint no Express já existe)
- WebSocket ou polling simples para receber a imagem no canvas do quiosque

**Complexidade:** Média (1–2 dias)  
**Arquivos críticos:** `server/routes/` (novo endpoint upload), `index.html` (QR + socket)

---

### 🟠 PRIORIDADE 3 — v1.7: Texto Dinâmico
**Por quê depois:** Aumenta a personalização sem depender de infraestrutura. Pode ser feito como uma 4ª camada no canvas.

**O que construir (versão enxuta):**
- Botão "Adicionar Texto" no Step 3 (toolbar existente)
- Input de texto → renderizado como `ctx.fillText()` na camada 4
- 3 fontes pré-carregadas via `@font-face` (sem API externa)
- Drag do texto igual ao drag da imagem (reusar mesma lógica de estado)
- Shuffle: apenas troca posições dos slots no grid (se grid ativo)

**Complexidade:** Média (1–2 dias)  
**Arquivo crítico:** `index.html`

---

### 🟡 PRIORIDADE 4 — v1.8 (resto): Modo Quiosque
**Por quê depois do QR:** Depende do QR funcionar. Auto-clear e screensaver são polish, não desbloqueadores.

**O que construir:**
- Timer de inatividade: `setTimeout` → reset de estado após X segundos configurável
- Screensaver: carrossel de mockups com CSS animations (sem JS pesado)
- Ambos com config via `localStorage` (tempo de reset, ativar/desativar)

**Complexidade:** Baixa (0.5–1 dia)

---

### ⬜ PRIORIDADE 5 — v2.0: E-commerce (Longo Prazo)
Sem data definida. Depende de validação dos quiosques primeiro.

---

## 4. O QUE NÃO FAZER (Lições da CASETiFY)

| Armadilha | Por quê evitar |
|---|---|
| Adicionar trackers/pixels de ads | Vai de 0 → dezenas de requests externos; destruir o 3MB de vantagem |
| Biblioteca de UI pesada (Fabric.js 800KB+) | O canvas atual já faz tudo; Fabric.js resolveria o que já está resolvido |
| JSON monolítico de modelos | Manter CSV + carregamento on-demand por modelo |
| Voltar para React | A migração v1.0 foi correta; não reverter |
| PNG nos mockups | Manter AVIF — são ~50% menores que PNG equivalente |

---

## 5. ORDEM DE EXECUÇÃO (conforme decisão do usuário)

**Sprint 1 → v1.6 Grid**  
**Sprint 2 → v1.8 QR Kiosk** (quiosque físico ativo — urgente)  
**Sprint 3 → Corrigir README**  
**Sprint 4 → v1.7 Texto Dinâmico**

---

## 6. AÇÕES IMEDIATAS

### Ação A — Iniciar v1.6 Grid
1. Adicionar seletor de layout antes do botão de upload (Step 2)
2. Refatorar `state` para suportar array de slots: `state.slots = [{img, x, y, scale, rotation}]`
3. Loop em `drawLayer1()` para renderizar cada slot no seu quadrante
4. Implementar aviso de DPI (toast simples, sem modal)

### Ação B — v1.8 QR Upload
1. Criar endpoint POST `/api/upload-temp` no Express existente (`server/routes/`)
2. Integrar `qrcode.js` (~40KB, CDN ou bundle)
3. WebSocket via `ws` package (já no ecossistema Node) ou polling `/api/poll/:sessionId`
4. QR exibido no painel esquerdo durante Step 2

### Ação C — Corrigir README
- Mover "Motor Canvas", "Upload", "Exportação", "Historicização" para ✅ Core Features
- Atualizar seção "Funcionalidades em Desenvolvimento"

### Ação D — v1.7 Texto Dinâmico
- Input de texto no toolbar do Step 3 (botão "T" junto com Rotate/Zoom)
- `ctx.fillText()` como camada 4 no canvas com drag independente
- 3 fontes pré-carregadas via `@font-face` (sem API externa)

---

## 7. ORÇAMENTO DE PERFORMANCE (Não Ultrapassar)

| Recurso | Atual | Limite Máximo |
|---|---|---|
| HTML/CSS/JS | 64 KB | 150 KB |
| Imagens mockup | ~3 MB total (33 modelos) | 5 MB (com mais modelos) |
| Libs externas novas | 0 | 2 libs, max 100 KB cada |
| Requests externos | ~40 | 60 |

---

## 7. ARQUIVOS CRÍTICOS PARA AS PRÓXIMAS VERSÕES

| Arquivo | Relevância |
|---|---|
| `index.html` | Tudo: UI, canvas logic, state, CSS — 2.126 linhas |
| `server/routes/models.ts` | Endpoint de modelos, expandir para upload |
| `server/data/models.csv` | Dados de modelos (adicionar novos aqui) |
| `public/assets/previews/` | Mockups AVIF (manter formato) |
| `public/assets/facas/` | SVG paths de recorte |

---

## 8. VERIFICAÇÃO FINAL

Após cada sprint, verificar:
- `preview_screenshot` → visual OK no desktop
- `preview_resize(375)` → mobile OK
- `preview_network` → nenhum request novo > 100KB
- Download gera PNG correto com grid visível