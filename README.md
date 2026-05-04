# 📱 Mobifans - [MobiStudio](https://filipevduarte.github.io/mobistudio/)

Um personalizador interativo de capinhas de smartphone desenvolvido para a **Mobifans**. Este projeto permite que o usuário visualize em tempo real como uma imagem ou foto ficaria aplicada em diferentes modelos de aparelhos, oferecendo uma experiência de compra imersiva e personalizada.

## 🚀 Funcionalidades

- **Seleção de Modelos:** Suporte dinâmico para múltiplos modelos de smartphones (iPhone, Samsung, etc.).
- **Motor de Canvas:** Sistema de renderização 3-camadas com controles de:
  - **Arraste (Drag):** Posicionamento livre da estampa sobre o mockup.
  - **Zoom:** Ajuste de escala via scroll do mouse ou botões.
  - **Rotação:** Rotação em 90° com controle fino via nudge.
- **Layouts Dinâmicos:** Suporte a 1, 2, 3, 4 e 6 slots de imagem + modo DIVISOR.
- **Histórico (Undo):** Desfazer ações com até 20 snapshots.
- **Interface Intuitiva:** Wizard flow em 4 etapas com toolbar de controles.
- **Responsividade:** Design adaptável para desktop e dispositivos móveis (Mobile-first mindset).
- **Exportação de Preview:** Gera imagem final do produto em alta resolução.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (Modern Flexbox & Variables).
- **Canvas:** HTML5 Canvas 2D API (renderização nativa, sem bibliotecas externas).
- **Lógica:** JavaScript Vanilla (Manipulação de DOM e Canvas API).
- **Design:** Tipografia *Plus Jakarta Sans* e identidade visual Neo-Brutalism.
- **Assets:** SVGs e Mockups otimizados para alta performance.

## 📁 Estrutura do Projeto

| Arquivo | Propósito |
|---------|-----------|
| `index.html` | Aplicação completa (HTML + CSS inline + JS inline) |
| `public/assets/facas/` | SVGs de corte dos mockups de dispositivos |
| `public/models.csv` | Dados dos modelos (marca, série, modelo, paths) |
| `package.json` | Dependências (Vite, Express, html2canvas) |

### Fluxo de Execução:
1. Carrega `index.html` com CSS e JavaScript inline
2. Lê `models.csv` e renderiza seletor de modelos
3. Ao selecionar modelo: carrega mockup + máscara SVG
4. Canvas renderiza com Canvas API 2D (3 camadas: mockup base, imagens, overlay)
5. Eventos de mouse/touch manipulam estado de slots
6. Export via html2canvas gera preview em alta resolução

---

# Roadmap de Desenvolvimento

## 🎯 Escopo Geral

**Objetivo:** Criar uma ferramenta web interativa que permita visualização em tempo real de customizações de capinhas, com suporte a múltiplos modelos de smartphones, controles de posicionamento, zoom e rotação de imagens, interface responsiva e exportação de previews.

---

## 📊 Versões Lançadas

## **v1.6.5** — Polimento & Correções (Conclusão da v1.6)
**Data:** 26 de Abril de 2026

#### O que foi feito:
- ✅ **Bug fix:** `layoutOffset` agora é resetado ao trocar de modelo — evitava que o nudge de uma sessão anterior vazasse para o próximo modelo selecionado
- ✅ **Nudge refinado:** Passo do ajuste fino alterado de 0.5px → 1px por clique (resposta mais direta)
- ✅ Comentário interno do `nudgeImage` corrigido para refletir o valor real do step

#### Status Atual:
- **v1.6 concluída e estável**
- Motor canvas produção-ready
- Todos os bugs conhecidos corrigidos antes de iniciar v1.7

---

## **v1.6** — Motor Canvas Completo & Layouts Dinâmicos
**Data:** 25 de Abril de 2026
**Commits:** `cecd314` → `f8cd011`

#### O que foi feito:
- ✅ Motor Canvas 2D com renderização 3-camadas
- ✅ Drag & drop com hit detection por slot
- ✅ Zoom (wheel + botões) e rotação 90°
- ✅ Múltiplos layouts dinâmicos (1/2/3/4/6 slots + DIVISOR)
- ✅ Nudge controls (movimento pixel-a-pixel)
- ✅ Sistema completo de undo (até 20 snapshots)
- ✅ Z-order (profundidade) para imagens sobrepostas
- ✅ Suporte a touch e mouse events
- ✅ Exportação em alta resolução via html2canvas

#### Novas Capacidades:
- Grids com detecção de overlap de câmera
- DPI check preparado (alerta para baixa resolução)
- Máscara de câmera com Layer2 avançado

#### Status Atual:
- **Versão estável com todas as features de edição**
- Motor canvas produção-ready
- Pronto para integração com checkout e e-commerce

---

## **v1.5** — Suporte a Câmeras & Máscaras Avançadas | Lançamento Oficial
**Data:** 23 de Abril de 2026
**Commits:** `81d3c34` → `394af38`

#### O que foi feito:
- ✅ Suporte para **buracos de câmera** em mockups
- ✅ Implementação de **camadas de máscara aprimoradas**
- ✅ Atualização de .gitignore para `.claude/`
- ✅ Melhorias em padrões de busca (Bash grep)

#### Novas Capacidades:
- Máscaras com suporte a furos de câmera (realismo visual)
- Camada 2 de máscara para efeitos mais sofisticados
- Melhor configuração de desenvolvimento

---

### **v1.4** — Refinamento de Assets & Estrutura
**Data:** 22 de Abril de 2026
**Commits:** `1692975` → `905d5a0`

#### O que foi feito:
- ✅ Ajustes nos estilos do painel central
- ✅ Remoção do favicon (simplificação)
- ✅ Atualização de nomes de SVGs `faca` para convenção `modelo_Faca.svg`
- ✅ Otimização de estrutura de assets

---

### **v1.3** — Responsividade & Experiência de Carregamento
**Data:** 22 de Abril de 2026
**Commits:** `d303639` → `6f9e2b4`

#### O que foi feito:
- ✅ Implementação de **splash screen** (tela de carregamento)
- ✅ Refatoração completa da UI do loader
- ✅ Lógica de loading repensada para melhor UX
- ✅ **Estilos responsivos para dispositivos móveis (≤1024px)**
- ✅ Ajuste de dimensionamento de painéis
- ✅ Otimização de visuais do loader

#### Breakpoints Responsivos:
- **Desktop:** 1440px (design padrão)
- **Tablet:** 1024px
- **Mobile:** < 1024px

---

### **v1.2** — Alinhamento Design System (Neo-Brutalism)
**Data:** 22 de Abril de 2026
**Commits:** `0a040cf` → `cb4be8c`

#### O que foi feito:
- ✅ Refatoração do layout para **3-panel workstation**
- ✅ Implementação de **wizard flow** (fluxo de usuário)
- ✅ Alinhamento de dimensões de painéis conforme Figma
- ✅ Refatoração visual para **Neo-Brutalism Suave**
- ✅ Polimento de estilos e formatação

#### Layout 3-Painel:
1. **Painel Esquerdo:** Seleção de modelos
2. **Painel Central:** Preview do mockup
3. **Painel Direito:** Controles de edição (drag, zoom, rotação)

---

### **v1.1** — Refinamento UI/UX & Acessibilidade
**Data:** 20 de Abril de 2026
**Commits:** `6a295b1` → `3d707d2`

#### O que foi feito:
- ✅ Adição de entradas CLI em bash
- ✅ Otimização de SVGs e padding da interface
- ✅ Reabilitação do menu de contexto do navegador
- ✅ Reabilitação de atalhos do navegador
- ✅ Redução de padding horizontal em `.brand-chip`
- ✅ Ajuste de cores de destaque (switch para `--ocean`)

---

## **v1.0** — Grande Refatoração (React → Static HTML)
**Data:** 20 de Abril de 2026
**Commits:** `ea4731e` → `c7f13a8`

#### Mudança Arquitetural Significativa:
- ✅ **Remoção completa do cliente React**
- ✅ Transição para **HTML estático + JavaScript Vanilla**
- ✅ Reintrodução de assets demo e favicons
- ✅ Sistema de carregamento de modelos via **CSV**

#### Novas Funcionalidades:
- Carregamento dinâmico de modelos a partir de CSV
- Seleção de dispositivos com **UI em drill-down dropdown**
- Layout em grid 2-colunas para seleção de modelos

---

### **v0.3** — Design Motion & Animações
**Data:** 19 de Abril de 2026
**Commits:** `32f6fc5` → `523f718`

---

### **v0.2** — Limpeza & Estruturação
**Data:** 16 de Abril de 2026
**Commits:** `a3c5b25` → `d98164a`

---

### **v0.1** — Fundações Iniciais
**Data:** 14-15 de Abril de 2026
**Commits:** `2e40cba` → `89fc6e3`

---

## Próximas Versões

### **v1.7** — Ferramentas Criativas & Interação
**Previsão:** Maio de 2026

#### O que será feito:
- 🔲 **Tipografia Dinâmica:** Inserção de textos com opções de 3 a 5 fontes curadas (ex: manuscrita, serifada, Neo-Brutalista).
- 🔲 **Botão "Shuffle" (Embaralhar):** Ação rápida que troca as imagens de posição aleatoriamente dentro do grid ativo.
- 🔲 **DPI Warning:** Alerta visual caso o cliente suba uma imagem de baixa resolução.
- 🔲 Controles de edição refinados no painel direito (zoom por pinça/slider, rotação, alinhamento).

---

### **v1.8** — Operação Quiosque & Segurança (Retail UX)
**Previsão:** Maio/Junho de 2026

#### O que será feito:
- 🔲 **Upload Sem Toque (QR Code):** Geração de QR code dinâmico na tela para que o cliente abra uma página web leve no próprio celular e envie as fotos direto para o canvas do quiosque.
- 🔲 **Reset de Sessão (Auto-Clear):** Lógica de timeout. Após "X" segundos sem interação, o sistema limpa uploads e reseta o canvas.
- 🔲 **Modo Atração (Screensaver):** Quando o sistema entra em timeout, inicia um carrossel animado de mockups com artes vibrantes.

#### Impacto no Negócio:
- Resolve a dor de transferência de arquivos em loja física.
- Garante conformidade com privacidade de dados (LGPD básica visual).

---

### **v2.0** — Ecossistema & E-commerce (Longo Prazo)
**Previsão:** +5 meses (Após consolidação e testes nos quiosques)

#### Backlog:
- 🔲 **Cross-sell Interativo:** Adicionar botões no preview para testar acessórios virtuais (ex: PopSockets, Carteiras MagSafe) sobre a capinha.
- 🔲 **Biblioteca de Assets Mobifans:** Aba com stickers, selos e grafismos oficiais da marca.
- 🔲 **Assets Dinâmicos para Carrinho:** O gerador exporta um thumbnail fiel da capinha recém-criada para acompanhar o pedido no checkout.

---

## 🎯 Funcionalidades Implementadas

### ✅ Core Features (v1.0 – v1.6)
- [x] Seleção dinâmica de modelos de smartphones
- [x] Sistema de carregamento de modelos via CSV
- [x] Layout responsivo (desktop/tablet/mobile)
- [x] Splash screen durante carregamento
- [x] Interface 3-painel (seleção, preview, controles)
- [x] Design Neo-Brutalism conforme Figma 1440w
- [x] Suporte a câmeras em mockups
- [x] Motor Canvas completo (drag, zoom, rotação)
- [x] Upload de imagens externas
- [x] Layouts dinâmicos (1/2/3/4/6 slots + DIVISOR)
- [x] Exportação de preview em alta resolução
- [x] Histórico de ações (undo até 20 snapshots)
- [x] Z-order para reordenação de imagens
- [x] Nudge controls para ajustes finos

### 🔄 Próximas Funcionalidades (v1.7-v1.8)
- [ ] **Texto Dinâmico** — Inserção de texto com 3-5 fontes curadas
- [ ] **QR Code Upload** — Upload sem toque via QR para quiosque
- [ ] **Shuffle** — Botão para embaralhar posição de imagens
- [ ] **DPI Warning** — Alerta visual para baixa resolução
- [ ] **Auto-Reset Session** — Limpeza automática após inatividade
- [ ] **Modo Screensaver** — Carrossel de mockups em timeout

### 📋 Backlog Futuro (v2.0+)
- [ ] Cross-sell interativo de acessórios
- [ ] Biblioteca de patterns/designs Mobifans
- [ ] Sistema de compartilhamento de designs
- [ ] Analytics de visualizações
- [ ] Integração de checkout

---

## 🛠️ Stack Técnico

| Aspecto | Tecnologia |
|--------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript Vanilla |
| **Canvas** | HTML5 Canvas API 2D |
| **Build Tool** | Vite 8.0.2 |
| **Export** | html2canvas 1.4.1 |
| **Server** | Node.js + Express 5 |
| **Tipografia** | Plus Jakarta Sans |
| **Assets** | SVGs otimizados |

> **Nota:** React e Tailwind CSS constavam no `package.json` como legado de template inicial — não são utilizados na aplicação atual.

---

## 📈 Estatísticas do Projeto

- **Total de Commits:** 60+
- **Período de Desenvolvimento:** 14 de Abril - 26 de Abril de 2026 (13 dias)
- **PRs Mergeadas:** 9+
- **Versões Lançadas:** 7 (v0.1 → v1.6.5)
- **Arquivos Principais:**
  - `index.html` (UI + Canvas + Lógica)
  - `public/models.csv` (Dados de modelos)
  - `public/assets/facas/` (SVGs de corte)

---

## 🔮 Próximos Passos

1. **QR Code Upload** — Resolver atrito de transferência de arquivos no quiosque físico (URGENTE)
2. **Tipografia Dinâmica** — Camada de texto com fontes curadas
3. **Validação de DPI** — Alerta para imagens de baixa resolução
4. **Modo Quiosque** — Auto-reset, screensaver, privacidade (LGPD)
5. **Integração E-commerce** — Cross-sell, checkout, thumbnails automáticos

---

## 📝 Notas Importantes

- A transição de React para Static HTML (v1.0) foi uma decisão arquitetural inteligente para performance e manutenibilidade
- O design Neo-Brutalism é consistente com a identidade visual Mobifans
- O motor Canvas está produção-ready com suporte a touch e mouse
- Assets e SVGs estão otimizados para qualidade visual

---

**Última Atualização:** 26 de Abril de 2026
**Responsável:** Filipe Duarte
