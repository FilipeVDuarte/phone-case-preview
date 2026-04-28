# 📱 Mobifans - Phone Case Previewer

Um personalizador interativo de capinhas de smartphone desenvolvido para a **Mobifans**. Este projeto permite que o usuário visualize em tempo real como uma imagem ou foto ficaria aplicada em diferentes modelos de aparelhos, oferecendo uma experiência de compra imersiva e personalizada.

## 🚀 Funcionalidades

- **Seleção de Modelos:** Suporte dinâmico para múltiplos modelos de smartphones (iPhone, Samsung, etc.).
- **Motor de Canvas:** Sistema de renderização que permite upload de imagens externas com controles de:
  - **Arraste (Drag):** Posicionamento livre da estampa sobre o mockup.
  - **Zoom:** Ajuste de escala para enquadramento perfeito.
  - **Rotação:** Controle fino da orientação da imagem.
- **Interface Intuitiva:** Toolbar lateral com atalhos para reset, zoom e centralização.
- **Responsividade:** Design adaptável para desktop e dispositivos móveis (Mobile-first mindset).
- **Exportação de Preview:** Lógica preparada para gerar a visualização final do produto.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (Modern Flexbox & Variables).
- **Lógica:** JavaScript Vanilla (Manipulação de DOM e Canvas API).
- **Design:** Tipografia *Plus Jakarta Sans* e identidade visual focada em clareza e conversão.
- **Assets:** SVGs e Mockups otimizados para alta performance.

# Roadmap de Desenvolvimento

## 🎯 Escopo Geral

**Objetivo:** Criar uma ferramenta web interativa que permita visualização em tempo real de customizações de capinhas, com suporte a múltiplos modelos de smartphones, controles de posicionamento, zoom e rotação de imagens, interface responsiva e exportação de previews.

---

## 📊 Versionamento por Commits

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

#### Status Atual:
- **Versão mais recente e estável**
- Funcionalidades core implementadas
- Pronto para expansões futuras

---

### **v1.4** — Refinamento de Assets & Estrutura
**Data:** 22 de Abril de 2026  
**Commits:** `1692975` → `905d5a0`

#### O que foi feito:
- ✅ Ajustes nos estilos do painel central
- ✅ Remoção do favicon (simplificação)
- ✅ Atualização de nomes de SVGs `faca` para convenção `modelo_Faca.svg`
- ✅ Otimização de estrutura de assets

#### Melhorias:
- Convenção de nomenclatura mais clara
- Estrutura de assets mais organizada
- Estilos centralizados melhorados

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

#### Melhorias UX:
- Splash screen cobre toda viewport durante carregamento de recursos
- Transições mais suaves
- Melhor comunicação de estado de carregamento

---

### **v1.2** — Alinhamento Design System (Neo-Brutalism)
**Data:** 22 de Abril de 2026  
**Commits:** `0a040cf` → `cb4be8c`

#### 🎨 Implementação Completa do Design Figma 1440w:
- ✅ Refatoração do layout para **3-panel workstation**
- ✅ Implementação de **wizard flow** (fluxo de usuário)
- ✅ Alinhamento de dimensões de painéis conforme Figma
- ✅ Refatoração visual para **Neo-Brutalism Suave**:
  - Bordas espessas (`--border: 4px solid #000`)
  - Sombras sólidas (`--shadow: 0 8px 0 0 #000`)
  - Tipografia Plus Jakarta Sans
- ✅ Polimento de estilos e formatação
- ✅ Atualização de settings do projeto

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

#### Melhorias:
- UI mais polida e refinada
- Melhor usabilidade com atalhos padrão do navegador
- Identidade visual mais consistente

---

## **v1.0** — Grande Refatoração (React → Static HTML)
**Data:** 20 de Abril de 2026  
**Commits:** `ea4731e` → `c7f13a8`

#### 🔄 Mudança Arquitetural Significativa:
- ✅ **Remoção completa do cliente React**
- ✅ Transição para **HTML estático + JavaScript Vanilla**
- ✅ Reintrodução de assets demo e favicons
- ✅ Sistema de carregamento de modelos via **CSV**

#### Novas Funcionalidades:
- 📋 Carregamento dinâmico de modelos a partir de CSV
- 🎯 Seleção de dispositivos com **UI em drill-down dropdown**
- 📱 Layout em grid 2-colunas para seleção de modelos

#### Por que essa mudança?
- **Performance:** Redução de overhead do React
- **Simplicidade:** Lógica mais direta e fácil de manter
- **Flexibilidade:** Integração mais fácil com assets estáticos

---

### **v0.3** — Design Motion & Animações
**Data:** 19 de Abril de 2026  
**Commits:** `32f6fc5` → `523f718`

#### O que foi feito:
- ✅ Integração do sistema de motion design `Emil Kowalski`
- ✅ Adição de novos modelos de imagens
- ✅ Aprimoramento dos modelos de sistema
- ✅ Merge da primeira PR (#2) — consolidação de funcionalidades

#### Melhorias:
- Sistema de animações mais sofisticado
- Transições suaves entre estados
- Biblioteca visual expandida

---

### **v0.2** — Limpeza & Estruturação
**Data:** 16 de Abril de 2026  
**Commits:** `a3c5b25` → `d98164a`

#### O que foi feito:
- ✅ Documentação inicial do projeto (README.md)
- ✅ Remoção de componentes React não utilizados
- ✅ Limpeza de hooks desnecessários
- ✅ Remoção de dependências obsoletas
- ✅ Preparação da estrutura para produção

#### Status:
- Projeto em fase de consolidação pós-inicial
- Documentação básica estabelecida

---

### **v0.1** — Fundações Iniciais
**Data:** 14-15 de Abril de 2026  
**Commits:** `2e40cba` → `89fc6e3`

#### O que foi feito:
- ✅ Commit inicial do repositório
- ✅ Implementação do componente `MobiLogo`
- ✅ Implementação do `OptionsPanel` com seleção de modelos de telefone
- ✅ Arquitetura base em React com componentes funcionais

#### Tecnologias estabelecidas:
- React 18.3.1
- TypeScript
- Vite como bundler
- Tailwind CSS para estilos


## 🎯 Funcionalidades Implementadas

### ✅ Core Features
- [x] Seleção dinâmica de modelos de smartphones
- [x] Sistema de carregamento de modelos via CSV
- [x] Layout responsivo (desktop/tablet/mobile)
- [x] Splash screen durante carregamento
- [x] Interface 3-painel (seleção, preview, controles)
- [x] Design Neo-Brutalism conforme Figma 1440w
- [x] Suporte a câmeras em mockups

### 🔄 Funcionalidades em Desenvolvimento
- [ ] Motor Canvas completo (drag, zoom, rotação)
- [ ] Upload de imagens externas
- [ ] Exportação de previews
- [ ] Historicização de ações
- [ ] Integração de checkout

### 📋 Backlog/Futuro
- [ ] Suporte a mais modelos de dispositivos
- [ ] Biblioteca de patterns/designs pré-carregados
- [ ] Sistema de compartilhamento de designs
- [ ] Analytics de visualizações
- [ ] Modo escuro

---

## 🛠️ Stack Técnico

| Aspecto | Tecnologia |
|--------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript Vanilla |
| **Build Tool** | Vite 8.0.2 |
| **Framework** | React 18.3.1 (background) |
| **Styling** | Tailwind CSS 3.4.17 + Variables CSS |
| **Tipografia** | Plus Jakarta Sans |
| **Assets** | SVGs otimizados |
| **TypeScript** | 5.9.2 |
| **Runtime** | Node.js (servidor Express) |

---

## 📈 Estatísticas do Projeto

- **Total de Commits:** 46
- **Período de Desenvolvimento:** 14 de Abril - 23 de Abril de 2026 (10 dias)
- **PRs Mergeadas:** 9
- **Versões Lançadas:** 5 (v0.1 → v1.5)
- **Arquivos Principais:** 
  - `index.html` (UI estática)
  - `style.css` (Design system)
  - `script.js` (Lógica principal)
  - `models.csv` (Dados de modelos)

---

## 🔮 Próximos Passos Recomendados

1. **Motor Canvas Completo** — Implementar drag, zoom e rotação com HTML5 Canvas
2. **Upload de Imagens** — Sistema robusto de upload com validações
3. **Exportação** — Gerar imagens do preview final (html2canvas está no package.json)
4. **Mobile Optimization** — Testes extensivos em dispositivos reais
5. **Performance** — Lazy loading de modelos e imagens
6. **Analytics** — Tracking de interações e conversões

---

## 📝 Notas Importantes

- A transição de React para Static HTML (v1.0) foi uma decisão arquitetural inteligente para performance e manutenibilidade
- O design Neo-Brutalism é consistente com a identidade visual Mobifans
- O projeto está bem estruturado para expansões futuras
- Assets e SVGs estão otimizados para qualidade visual

---

**Última Atualização:** 23 de Abril de 2026  
**Responsável:** Filipe Duarte

