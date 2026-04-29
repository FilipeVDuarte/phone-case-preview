/* ================================================================
     * MOBIFANS — PREVIEW DE CAPINHAS  v1.6
     * ================================================================
     * ARQUITETURA DO CANVAS: 3 camadas sobrepostas
     *   CAMADA 0 → Mockup AVIF (aparelho)
     *   CAMADA 1 → Arte do usuário (recortada pelo path SVG da faca)
     *   CAMADA 2 → Overlay do mockup (bordas, câmeras)
     * ================================================================ */
import STATIC_MODELS from './models.json';

const DPR = Math.min(window.devicePixelRatio || 1, 2);
const DISPLAY_H = 520;
const FACA_SVG_W = 500;
const FACA_SVG_H = 1000;

/* ── GRIDS CUSTOMIZADOS — coordenadas normalizadas (0–1) no espaço da faca ── */
const CUSTOM_GRIDS = {
    'RETRATO': [{
        x: 0.25,
        y: 0.25,
        w: 0.5,
        h: 0.5
    },],
    '3-FOTOS': [{
        x: 0.55,
        y: 0.15,
        w: 0.3,
        h: 0.3
    },
    {
        x: 0.35,
        y: 0.40,
        w: 0.3,
        h: 0.3
    },
    {
        x: 0.15,
        y: 0.65,
        w: 0.3,
        h: 0.3
    },
    ],
    'DIVISOR-1': [{
        x: 0,
        y: 0,
        w: 1,
        h: 1
    }],
    'DIVISOR-2': [{
        x: 0,
        y: 0,
        w: 1,
        h: 0.5
    },
    {
        x: 0,
        y: 0.5,
        w: 1,
        h: 0.5
    },
    ],
    'DIVISOR-4': [{
        x: 0,
        y: 0,
        w: 0.5,
        h: 0.5
    }, {
        x: 0.5,
        y: 0,
        w: 0.5,
        h: 0.5
    },
    {
        x: 0,
        y: 0.5,
        w: 0.5,
        h: 0.5
    }, {
        x: 0.5,
        y: 0.5,
        w: 0.5,
        h: 0.5
    },
    ],
    'DIVISOR-6': [{
        x: 0,
        y: 0,
        w: 0.5,
        h: 0.33
    }, {
        x: 0.5,
        y: 0,
        w: 0.5,
        h: 0.33
    },
    {
        x: 0,
        y: 0.33,
        w: 0.5,
        h: 0.34
    }, {
        x: 0.5,
        y: 0.33,
        w: 0.5,
        h: 0.34
    },
    {
        x: 0,
        y: 0.67,
        w: 0.5,
        h: 0.33
    }, {
        x: 0.5,
        y: 0.67,
        w: 0.5,
        h: 0.33
    },
    ],
};

const DIVISOR_SEQUENCE = ['DIVISOR-1', 'DIVISOR-2', 'DIVISOR-4', 'DIVISOR-6'];

/* ── MODELOS ── */
const MODELS = [];

/* ── ESTADO v1.6.4 ── */
const state = {
    model: null,
    layout: 'RETRATO',
    layoutOffset: {
        x: 0,
        y: 0
    },
    slots: [{
        img: null,
        imgUrl: null,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0
    }],
    activeSlot: 0,
    history: [],
};

function currentSlot() {
    return state.slots[state.activeSlot] || state.slots[0];
}

/* ── WIZARD STATE ── */
let currentStep = 1;

/* ── DOM ── */
const canvas = document.getElementById('phoneCanvas');
const ctx = canvas.getContext('2d');
const sel = document.getElementById('modelSelect');
const fileInput = document.getElementById('fileInput');
const loadingEl = document.getElementById('canvasLoading');


/* ================================================================
 * WIZARD — navegação entre passos
 * ================================================================ */

function showStep(n) {
    currentStep = n;

    for (let i = 1; i <= 4; i++) {
        const p = document.getElementById(`stepPanel${i}`);
        if (p) p.style.display = i === n ? 'flex' : 'none';
    }

    updateStepper();

    document.getElementById('btnPrev').disabled = n === 1;
    const btnNext = document.getElementById('btnNext');
    btnNext.textContent = n === 4 ? '—' : 'Próximo Passo';
    btnNext.disabled = n === 4;

    // Hint only visible on step 3 when active slot has image
    const hint = document.getElementById('canvasHint');
    hint.style.display = (n === 3 && !!currentSlot().img) ? 'block' : 'none';

    // Update step 4 model name
    if (n === 4) {
        document.getElementById('selectedModelDisplay').textContent =
            state.model ? state.model.name : '—';
    }
}

function updateStepper() {
    for (let i = 1; i <= 4; i++) {
        const item = document.getElementById(`stepItem${i}`);
        if (!item) continue;
        item.classList.remove('active', 'completed');
        if (i < currentStep) item.classList.add('completed');
        else if (i === currentStep) item.classList.add('active');
    }

    // Connector color (between step i and i+1 is completed when step i is completed)
    for (let i = 1; i <= 3; i++) {
        const conn = document.getElementById(`stepConn${i}`);
        if (conn) conn.style.background = i < currentStep ? '#22C55E' : '#E2E8F0';
    }
}

document.getElementById('btnPrev').addEventListener('click', () => {
    if (currentStep > 1) showStep(currentStep - 1);
});

document.getElementById('btnNext').addEventListener('click', () => {
    if (currentStep === 1 && !state.model) return; // need model first
    if (currentStep === 2 && !state.slots.some(s => s.img)) return; // need at least 1 image
    if (currentStep < 4) showStep(currentStep + 1);
});


/* ================================================================
 * DROPDOWN — hierarquia de marca/série/modelo
 * ================================================================ */

const dropdownState = {
    selectedBrand: null,
    selectedSeries: null,
    hierarchy: {},
};

function organizeModelsByBrandAndSeries() {
    const h = {};
    MODELS.forEach(m => {
        const parts = m.name.split(' ');
        const brand = parts[0];
        const displayBrand = brand === 'iPhone' ? 'Apple' : brand;
        const series = displayBrand === 'Apple' ? parts[1] : parts[1].charAt(0);
        if (!h[displayBrand]) h[displayBrand] = {};
        if (!h[displayBrand][series]) h[displayBrand][series] = [];
        h[displayBrand][series].push(m);
    });
    return h;
}

function renderBrands() {
    const grid = document.getElementById('brandsGrid');
    grid.innerHTML = '';
    Object.keys(dropdownState.hierarchy).sort().forEach(brand => {
        const chip = document.createElement('button');
        chip.className = 'brand-chip';
        chip.textContent = brand;
        chip.onclick = () => selectBrand(brand);
        grid.appendChild(chip);
    });
}

function renderSeries() {
    const scroll = document.getElementById('seriesScroll');
    scroll.innerHTML = '';
    if (!dropdownState.selectedBrand) return;
    const series = Object.keys(dropdownState.hierarchy[dropdownState.selectedBrand])
        .sort((a, b) => {
            const an = parseInt(a),
                bn = parseInt(b);
            if (!isNaN(an) && !isNaN(bn)) return bn - an;
            return a.localeCompare(b);
        });
    series.forEach(s => {
        const chip = document.createElement('button');
        chip.className = 'series-chip';
        chip.textContent = dropdownState.selectedBrand === 'Apple' ? `Linha ${s}` : `Série ${s}`;
        chip.onclick = () => selectSeries(s);
        scroll.appendChild(chip);
    });
}

function renderModels() {
    const list = document.getElementById('modelsList');
    list.innerHTML = '';
    if (!dropdownState.selectedBrand || !dropdownState.selectedSeries) return;

    const models = dropdownState.hierarchy[dropdownState.selectedBrand][dropdownState.selectedSeries];
    document.getElementById('modelLayerHeader').textContent =
        dropdownState.selectedBrand === 'Apple' ?
            `Linha ${dropdownState.selectedSeries}` :
            `Série ${dropdownState.selectedSeries}`;

    models.forEach(m => {
        const item = document.createElement('button');
        item.className = 'model-item';
        item.textContent = m.name;
        item.onclick = () => selectModel(m);
        list.appendChild(item);
    });
}

function selectBrand(brand) {
    dropdownState.selectedBrand = brand;
    dropdownState.selectedSeries = null;
    renderSeries();
    document.getElementById('layerBrand').style.display = 'none';
    document.getElementById('layerSeries').style.display = 'flex';
}

function selectSeries(series) {
    dropdownState.selectedSeries = series;
    renderModels();
    document.getElementById('layerSeries').style.display = 'none';
    document.getElementById('layerModel').style.display = 'flex';
}

function selectModel(m) {
    sel.value = m.id;
    sel.dispatchEvent(new Event('change'));
    // Show badge and reset to brand layer for re-selection
    const badge = document.getElementById('modelSelectedBadge');
    document.getElementById('modelSelectedName').textContent = m.name;
    badge.style.display = 'flex';
    // Reset to brand layer
    dropdownState.selectedBrand = null;
    dropdownState.selectedSeries = null;
    document.getElementById('layerModel').style.display = 'none';
    document.getElementById('layerSeries').style.display = 'none';
    document.getElementById('layerBrand').style.display = 'flex';
    renderBrands();
}

document.getElementById('backFromSeries').addEventListener('click', () => {
    dropdownState.selectedBrand = null;
    renderBrands();
    document.getElementById('layerSeries').style.display = 'none';
    document.getElementById('layerBrand').style.display = 'flex';
});

document.getElementById('backFromModel').addEventListener('click', () => {
    dropdownState.selectedSeries = null;
    renderSeries();
    document.getElementById('layerModel').style.display = 'none';
    document.getElementById('layerSeries').style.display = 'flex';
});


/* ================================================================
 * GRID — geometria dos slots no espaço da faca
 * Coordenadas normalizadas (0–1) × dimensões da faca = pixels do modelo
 * ================================================================ */

function getSlotRects(m, layout) {
    const fc = m._facaCenter;
    if (!fc) return [{
        x: 0,
        y: 0,
        w: m.fw,
        h: m.fh
    }];
    const x0 = fc.x - fc.w / 2;
    const y0 = fc.y - fc.h / 2;
    const W = fc.w;
    const H = fc.h;

    const grid = CUSTOM_GRIDS[layout];
    if (!grid || !grid.length) return [{
        x: x0,
        y: y0,
        w: W,
        h: H
    }];
    return grid.map(nr => ({
        x: x0 + nr.x * W,
        y: y0 + nr.y * H,
        w: nr.w * W,
        h: nr.h * H,
    }));
}

function clipToShape(ctx, rect) {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
}


/* ================================================================
 * UTILITÁRIOS DE CANVAS
 * ================================================================ */

function getFacaPath(m) {
    const d = m.facaMaskPath;
    if (!d) return null;
    const sx = m.fw / FACA_SVG_W;
    const sy = m.fh / FACA_SVG_H;

    // Build combined path: outer case boundary + camera/sensor circles.
    // When filled with evenodd, the circles become transparent holes so
    // camera hardware shows through the user art on Layer 1 and remains
    // visible in the Layer 2 overlay.
    const base = new Path2D();
    base.addPath(new Path2D(d));
    if (m.facaCircles) {
        for (const {
            cx,
            cy,
            r
        } of m.facaCircles) {
            base.moveTo(cx + r, cy);
            base.arc(cx, cy, r, 0, Math.PI * 2);
        }
    }

    if (sx === 1 && sy === 1) return base;
    const matrix = new DOMMatrix().scale(sx, sy);
    const scaled = new Path2D();
    scaled.addPath(base, matrix);
    return scaled;
}

function initCanvas(m) {
    const wrapper = document.getElementById('canvasWrapper');
    const availH = Math.max((wrapper.clientHeight || 400) - 16, 200);
    const availW = Math.max((wrapper.clientWidth || 300) - 16, 200);

    let cssH = Math.min(DISPLAY_H, availH);
    let cssW = Math.round(cssH * m.fw / m.fh);

    if (cssW > availW) {
        cssW = availW;
        cssH = Math.round(cssW * m.fh / m.fw);
    }

    canvas.width = m.fw * DPR;
    canvas.height = m.fh * DPR;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
}

function cssToLogical(dx, dy) {
    const m = state.model;
    return {
        dx: dx * m.fw / canvas.clientWidth,
        dy: dy * m.fh / canvas.clientHeight,
    };
}


/* ================================================================
 * CAMADA 0 — MOCKUP DO APARELHO
 * ================================================================ */

function drawLayer0(c, m) {
    if (m._mockupImg) {
        c.drawImage(m._mockupImg, 0, 0, m.fw, m.fh);
        return;
    }
    const path = getFacaPath(m);
    c.fillStyle = '#e0e0e0';
    c.fillRect(0, 0, m.fw, m.fh);
    if (path) {
        c.fillStyle = '#f8f8f8';
        c.fill(path);
        c.strokeStyle = '#bbb';
        c.lineWidth = 1;
        c.stroke(path);
    }
    c.fillStyle = '#aaa';
    c.font = "500 11px 'Plus Jakarta Sans', sans-serif";
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('Mockup carregando…', m.fw / 2, m.fh / 2);
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
}


/* ================================================================
 * CAMADA 1 — ARTE DO USUÁRIO (recortada pela faca)
 * Desenha todos os slots ativos; a máscara da faca é aplicada
 * uma única vez no buffer temporário, cobrindo todos os slots.
 * ================================================================ */

function drawLayer1(mainCtx, m, slots, slotRects, sc, exportMode) {
    const tmp = document.createElement('canvas');
    tmp.width = m.fw * sc;
    tmp.height = m.fh * sc;
    const tc = tmp.getContext('2d');
    tc.setTransform(sc, 0, 0, sc, 0, 0);

    slots.forEach((s, i) => {
        if (!s.img) return;
        const rect = slotRects[i];
        if (!rect) return;
        const cx = rect.x + rect.w / 2;
        const cy = rect.y + rect.h / 2;
        const rotated90 = Math.round(s.rotation / 90) % 2 !== 0;
        const iw = rotated90 ? s.img.naturalHeight : s.img.naturalWidth;
        const ih = rotated90 ? s.img.naturalWidth : s.img.naturalHeight;
        const baseScale = Math.max(rect.w / iw, rect.h / ih);
        const totalScale = baseScale * s.scale;

        tc.save();
        tc.globalAlpha = exportMode ? 1.0 : (i === state.activeSlot ? 1.0 : 0.4);
        clipToShape(tc, rect);
        tc.clip();
        tc.translate(cx + s.x, cy + s.y);
        tc.rotate(s.rotation * Math.PI / 180);
        tc.scale(totalScale, totalScale);
        tc.drawImage(s.img, -s.img.naturalWidth / 2, -s.img.naturalHeight / 2);
        tc.restore();
    });

    // Máscara da faca aplicada uma vez para todos os slots
    tc.globalAlpha = 1;
    tc.globalCompositeOperation = 'destination-in';
    const maskPath = getFacaPath(m);
    if (maskPath) {
        tc.fillStyle = '#fff';
        tc.fill(maskPath, 'evenodd');
    }
    tc.globalCompositeOperation = 'source-over';

    mainCtx.setTransform(1, 0, 0, 1, 0, 0);
    mainCtx.drawImage(tmp, 0, 0);
}

function drawLayer1Empty(c, m, slotRects, activeSlot) {
    const path = getFacaPath(m);
    if (!path) return;
    c.save();
    c.clip(path, 'evenodd');
    slotRects.forEach((rect, i) => {
        c.fillStyle = i === activeSlot ? 'rgba(49,53,144,0.07)' : 'rgba(0,0,0,0.04)';
        c.fillRect(rect.x, rect.y, rect.w, rect.h);
        const fontSize = slotRects.length === 1 ? 22 : Math.min(16, Math.max(9, rect.w / 14));
        c.fillStyle = i === activeSlot ? 'rgba(49,53,144,0.55)' : 'rgba(0,0,0,0.22)';
        c.font = `700 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        const label = slotRects.length > 1 ? `Foto ${i + 1}` : 'Faz upload →';
        c.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
    });
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    c.restore();
}

function drawActiveSlotOverlay(c, m, slotRects, slots, activeSlot, exportMode) {
    if (exportMode) return;
    const path = getFacaPath(m);
    const OCEAN = 'rgba(49,53,144,0.9)';
    const H_SIZE = 8;

    c.save();
    if (path) c.clip(path, 'evenodd');

    // Thin outline on inactive filled slots
    slotRects.forEach((rect, i) => {
        if (i === activeSlot || !slots[i] || !slots[i].img) return;
        c.strokeStyle = 'rgba(255,255,255,0.35)';
        c.lineWidth = 1;
        clipToShape(c, rect);
        c.stroke();
    });

    // Active slot: ocean border
    const r = slotRects[activeSlot];
    if (!r) {
        c.restore();
        return;
    }

    c.strokeStyle = OCEAN;
    c.lineWidth = 3;
    clipToShape(c, r);
    c.stroke();

    // Corner handles
    c.fillStyle = OCEAN;
    [
        [r.x, r.y],
        [r.x + r.w, r.y],
        [r.x, r.y + r.h],
        [r.x + r.w, r.y + r.h]
    ]
        .forEach(([hx, hy]) => c.fillRect(hx - H_SIZE / 2, hy - H_SIZE / 2, H_SIZE, H_SIZE));

    c.restore();
}


/* ================================================================
 * CAMADA 2 — OVERLAY DO MOCKUP (máscara inversa da faca)
 * Renderiza o AVIF novamente, apagando a área da faca via
 * destination-out, deixando visível apenas bordas/botões/câmeras.
 * ================================================================ */

function drawLayer2(mainCtx, m, sc) {
    const path = getFacaPath(m);
    if (!path) return;

    if (!m._mockupImg) {
        // Fallback: traço do contorno quando o AVIF ainda não carregou
        mainCtx.save();
        mainCtx.setTransform(sc, 0, 0, sc, 0, 0);
        mainCtx.strokeStyle = 'rgba(35, 31, 32, 0.55)';
        mainCtx.lineWidth = 1.2;
        mainCtx.setLineDash([]);
        mainCtx.stroke(path);
        mainCtx.restore();
        mainCtx.setTransform(1, 0, 0, 1, 0, 0);
        return;
    }

    const tmp = document.createElement('canvas');
    tmp.width = m.fw * sc;
    tmp.height = m.fh * sc;
    const tc = tmp.getContext('2d');
    tc.setTransform(sc, 0, 0, sc, 0, 0);

    // Desenha o mockup completo no buffer temporário
    tc.drawImage(m._mockupImg, 0, 0, m.fw, m.fh);

    // Apaga a área da faca → sobra a parte externa (bordas, botões) + furos das câmeras
    tc.globalCompositeOperation = 'destination-out';
    tc.fillStyle = '#fff';
    tc.fill(path, 'evenodd');
    tc.globalCompositeOperation = 'source-over';

    mainCtx.setTransform(1, 0, 0, 1, 0, 0);
    mainCtx.drawImage(tmp, 0, 0);
}


/* ================================================================
 * RENDER PRINCIPAL
 * ================================================================ */

function draw() {
    if (!state.model) return;
    renderAllLayers(ctx, state.model, state, DPR, false);
}

function renderAllLayers(c, m, s, sc, exportMode) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, m.fw * sc, m.fh * sc);
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, m.fw * sc, m.fh * sc);
    c.setTransform(sc, 0, 0, sc, 0, 0);

    const layout = s.layout || 'RETRATO';
    const off = s.layoutOffset || {
        x: 0,
        y: 0
    };
    const slotRects = getSlotRects(m, layout).map(r => ({
        ...r,
        x: r.x + off.x,
        y: r.y + off.y
    }));
    const hasAnyImage = s.slots.some(sl => sl.img);
    const active = s.activeSlot || 0;

    drawLayer0(c, m);

    if (hasAnyImage) {
        drawLayer1(c, m, s.slots, slotRects, sc, exportMode);
        c.setTransform(sc, 0, 0, sc, 0, 0);
    } else {
        drawLayer1Empty(c, m, slotRects, active);
    }

    c.setTransform(sc, 0, 0, sc, 0, 0);
    drawActiveSlotOverlay(c, m, slotRects, s.slots, active, exportMode);

    drawLayer2(c, m, sc);

    // ── DEBUG VISUAL (remover depois) ── ativado via window.DEBUG_LAYOUTS = true
    if (window.DEBUG_LAYOUTS) {
        c.setTransform(sc, 0, 0, sc, 0, 0);

        // 1. Contorno vermelho em cada slotRect
        slotRects.forEach((rect, i) => {
            c.save();
            c.strokeStyle = '#FF0055';
            c.lineWidth = 3;
            c.setLineDash([6, 3]);
            c.strokeRect(rect.x, rect.y, rect.w, rect.h);
            c.fillStyle = 'rgba(255,0,85,0.85)';
            c.font = 'bold 13px monospace';
            c.textBaseline = 'top';
            c.fillText(
                `#${i} (${Math.round(rect.x)},${Math.round(rect.y)}) ${Math.round(rect.w)}×${Math.round(rect.h)}`,
                rect.x + 4, rect.y + 4
            );
            c.restore();
        });

        // 2. Marcador azul no _facaCenter (cx, cy e bounding box)
        const fc = m._facaCenter;
        if (fc) {
            c.save();
            const bx = fc.x - fc.w / 2;
            const by = fc.y - fc.h / 2;
            // bounding box verde
            c.strokeStyle = '#00CC66';
            c.lineWidth = 2;
            c.setLineDash([4, 4]);
            c.strokeRect(bx, by, fc.w, fc.h);
            // centro azul
            c.setLineDash([]);
            c.fillStyle = '#0066FF';
            c.fillRect(fc.x - 5, fc.y - 5, 10, 10);
            c.strokeStyle = '#fff';
            c.lineWidth = 1.5;
            c.strokeRect(fc.x - 5, fc.y - 5, 10, 10);
            // label
            c.fillStyle = 'rgba(0,102,255,0.9)';
            c.font = 'bold 11px monospace';
            c.textBaseline = 'top';
            c.fillText(
                `fc (${Math.round(fc.x)},${Math.round(fc.y)}) ${Math.round(fc.w)}×${Math.round(fc.h)}`,
                bx + 4, by + 4
            );
            c.restore();
        }
    }
    // ── FIM DEBUG ──
}


/* ================================================================
 * CARREGAMENTO DE IMAGENS DO MODELO
 * ================================================================ */

async function loadModelImages(m) {
    const loads = [];

    if (m.mockupPath && !m._mockupImg) {
        loads.push(new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                m._mockupImg = img;
                if (img.naturalWidth !== m.fw || img.naturalHeight !== m.fh) {
                    m.fw = img.naturalWidth;
                    m.fh = img.naturalHeight;
                }
                resolve();
            };
            img.onerror = () => {
                console.warn('[Mobifans] Mockup não encontrado:', m.mockupPath);
                resolve();
            };
            img.src = m.mockupPath;
        }));
    }

    await Promise.all(loads);

    if (m.facaMaskPath && !m._facaCenter) {
        m._facaCenter = computeFacaCenter(m);
    }
}

function computeFacaCenter(m) {
    const path = getFacaPath(m);
    if (!path) return null;
    const tmp = document.createElement('canvas');
    tmp.width = m.fw;
    tmp.height = m.fh;
    const tc = tmp.getContext('2d');
    const STEPS = 40;
    let minX = m.fw,
        maxX = 0,
        minY = m.fh,
        maxY = 0,
        found = false;
    for (let xi = 0; xi <= STEPS; xi++) {
        for (let yi = 0; yi <= STEPS; yi++) {
            const x = (xi / STEPS) * m.fw;
            const y = (yi / STEPS) * m.fh;
            if (tc.isPointInPath(path, x, y)) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                found = true;
            }
        }
    }
    if (!found) return {
        x: m.fw / 2,
        y: m.fh / 2,
        w: m.fw * 0.85,
        h: m.fh * 0.92
    };
    return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
        w: maxX - minX,
        h: maxY - minY
    };
}


/* ================================================================
 * DRAG — arrastar a arte
 * ================================================================ */

let dragging = false;
let dragOrigin = {
    x: 0,
    y: 0
};
let posOrigin = {
    x: 0,
    y: 0
};

/* Converte posição do cliente para coordenadas do modelo */
function clientToModel(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    return {
        x: (clientX - r.left) * state.model.fw / canvas.clientWidth,
        y: (clientY - r.top) * state.model.fh / canvas.clientHeight,
    };
}

/* Retorna o índice do slot onde o ponto (mx,my) cai */
function slotAtModel(mx, my) {
    if (!state.model) return 0;
    const off = state.layoutOffset || {
        x: 0,
        y: 0
    };
    const rects = getSlotRects(state.model, state.layout).map(r => ({
        ...r,
        x: r.x + off.x,
        y: r.y + off.y
    }));
    for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return i;
    }
    return state.activeSlot;
}

canvas.addEventListener('mousedown', e => {
    if (!state.slots.some(s => s.img)) return;
    const {
        x: mx,
        y: my
    } = clientToModel(e.clientX, e.clientY);
    const clicked = slotAtModel(mx, my);
    if (clicked !== state.activeSlot) {
        state.activeSlot = clicked;
        updateSlotDotsUI();
        updateIndicators();
        draw();
        syncUI();
    }
    if (!currentSlot().img) return;
    dragging = true;
    dragOrigin = {
        x: e.clientX,
        y: e.clientY
    };
    posOrigin = {
        x: currentSlot().x,
        y: currentSlot().y
    };
    canvas.classList.add('dragging');
});

window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const {
        dx,
        dy
    } = cssToLogical(e.clientX - dragOrigin.x, e.clientY - dragOrigin.y);
    currentSlot().x = posOrigin.x + dx;
    currentSlot().y = posOrigin.y + dy;
    draw();
});

window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove('dragging');
    pushHistory();
});


/* ================================================================
 * TOUCH — arrastar + pinch zoom
 * ================================================================ */

let touchDragging = false;
let lastPinchDist = 0;
let pinchScaleBase = 1;

canvas.addEventListener('touchstart', e => {
    if (!state.slots.some(s => s.img)) return;
    if (e.touches.length === 1) {
        e.preventDefault();
        const t = e.touches[0];
        const {
            x: mx,
            y: my
        } = clientToModel(t.clientX, t.clientY);
        const clicked = slotAtModel(mx, my);
        if (clicked !== state.activeSlot) {
            state.activeSlot = clicked;
            updateSlotDotsUI();
            updateIndicators();
            draw();
            syncUI();
        }
        if (!currentSlot().img) return;
        touchDragging = true;
        dragOrigin = {
            x: t.clientX,
            y: t.clientY
        };
        posOrigin = {
            x: currentSlot().x,
            y: currentSlot().y
        };
    } else if (e.touches.length === 2) {
        e.preventDefault();
        touchDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist = Math.hypot(dx, dy);
        pinchScaleBase = currentSlot().scale;
    }
}, {
    passive: false
});

canvas.addEventListener('touchmove', e => {
    if (!state.slots.some(s => s.img)) return;
    e.preventDefault();
    if (e.touches.length === 1 && touchDragging) {
        const {
            dx,
            dy
        } = cssToLogical(
            e.touches[0].clientX - dragOrigin.x,
            e.touches[0].clientY - dragOrigin.y
        );
        currentSlot().x = posOrigin.x + dx;
        currentSlot().y = posOrigin.y + dy;
        draw();
    } else if (e.touches.length === 2 && lastPinchDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        applyScale(pinchScaleBase * (Math.hypot(dx, dy) / lastPinchDist));
    }
}, {
    passive: false
});

canvas.addEventListener('touchend', e => {
    if (e.touches.length === 0) {
        if (touchDragging) pushHistory();
        touchDragging = false;
        lastPinchDist = 0;
    }
});


/* ================================================================
 * WHEEL — zoom com scroll
 * ================================================================ */

canvas.addEventListener('wheel', e => {
    if (!currentSlot().img) return;
    e.preventDefault();
    applyScale(currentSlot().scale + (e.deltaY > 0 ? -0.06 : 0.06));
}, {
    passive: false
});


/* ================================================================
 * MOTION HELPERS
 * ================================================================ */

function triggerBump(el) {
    if (!el) return;
    el.classList.remove('pill-bump');
    void el.offsetWidth;
    el.classList.add('pill-bump');
    el.addEventListener('animationend', () => el.classList.remove('pill-bump'), {
        once: true
    });
}


/* ================================================================
 * INDICADORES — sincroniza pills com o slot ativo
 * ================================================================ */

function updateIndicators() {
    const s = currentSlot();
    document.getElementById('scaleLabel').textContent = Math.round((s.scale || 1) * 100) + '%';
    const rot = s.rotation || 0;
    document.getElementById('rotationLabel').textContent = rot + '°';
    document.getElementById('rotationRow').style.display = rot !== 0 ? 'flex' : 'none';
}


/* ================================================================
 * ZOOM
 * ================================================================ */

function applyScale(v) {
    currentSlot().scale = Math.max(0.2, Math.min(3.0, v));
    document.getElementById('scaleLabel').textContent = Math.round(currentSlot().scale * 100) + '%';
    triggerBump(document.querySelector('.scale-pill'));
    draw();
}

function resetView() {
    pushHistory();
    const s = currentSlot();
    s.x = 0;
    s.y = 0;
    s.scale = 1;
    s.rotation = 0;
    updateIndicators();
    draw();
}


/* ================================================================
 * HISTÓRICO — snapshot completo do estado
 * ================================================================ */

function pushHistory() {
    state.history.push({
        layout: state.layout,
        layoutOffset: {
            ...state.layoutOffset
        },
        activeSlot: state.activeSlot,
        slots: state.slots.map(s => ({
            img: s.img,
            imgUrl: s.imgUrl,
            x: s.x,
            y: s.y,
            scale: s.scale,
            rotation: s.rotation,
        })),
    });
    if (state.history.length > 20) state.history.shift();
    syncUI();
}

function undo() {
    if (!state.history.length) return;
    const snap = state.history.pop();
    // Revoke URLs for slots that will be removed
    for (let i = snap.slots.length; i < state.slots.length; i++) {
        if (state.slots[i].imgUrl) URL.revokeObjectURL(state.slots[i].imgUrl);
    }
    state.layout = snap.layout;
    state.layoutOffset = snap.layoutOffset ? {
        ...snap.layoutOffset
    } : {
        x: 0,
        y: 0
    };
    state.activeSlot = snap.activeSlot;
    state.slots = snap.slots.map(ss => ({
        ...ss
    }));
    updateLayoutUI();
    updateSlotDotsUI();
    updateIndicators();
    draw();
    syncUI();
}


/* ================================================================
 * SYNC UI
 * ================================================================ */

function syncUI() {
    const hasModel = !!state.model;
    const hasAnyImg = state.slots.some(s => s.img);
    const hasCurImg = !!currentSlot().img;
    const hasHist = state.history.length > 0;
    const multiSlot = state.slots.length > 1;
    const isDivisor = state.layout.startsWith('DIVISOR');

    document.getElementById('uploadBtn').disabled = !hasModel;
    // [QR_PAUSED] const qrTriggerBtn = document.getElementById('qrTriggerBtn');
    // [QR_PAUSED] if (qrTriggerBtn && qrTriggerBtn.style.display !== 'none') qrTriggerBtn.disabled = !hasModel;
    document.getElementById('downloadBtn').disabled = !hasAnyImg;
    document.getElementById('btnUndo').disabled = !hasHist;
    document.getElementById('btnFit').disabled = !hasCurImg;
    document.getElementById('btnReset').disabled = !hasCurImg;
    document.getElementById('btnRotate').disabled = !hasCurImg;
    document.getElementById('btnZoomIn').disabled = !hasCurImg;
    document.getElementById('btnZoomOut').disabled = !hasCurImg;

    // Divisor dinâmico
    const divisorControls = document.getElementById('divisorControls');
    if (divisorControls) divisorControls.style.display = isDivisor ? 'flex' : 'none';
    const divisorIdx = DIVISOR_SEQUENCE.indexOf(state.layout);
    const btnDA = document.getElementById('btnDivisorAdd');
    const btnDR = document.getElementById('btnDivisorRemove');
    if (btnDA) btnDA.disabled = divisorIdx >= DIVISOR_SEQUENCE.length - 1;
    if (btnDR) btnDR.disabled = divisorIdx <= 0;

    // Nudge panel: visível no Step 3 apenas para Retrato e 3-Fotos
    const nudgePanel = document.getElementById('nudgePanel');
    const showNudge = currentStep === 3 && !isDivisor;
    if (nudgePanel) nudgePanel.style.display = showNudge ? 'flex' : 'none';
    ['btnNudgeUp', 'btnNudgeDown', 'btnNudgeLeft', 'btnNudgeRight'].forEach(id => {
        const b = document.getElementById(id);
        if (b) b.disabled = !hasCurImg;
    });

    // Slot indicator visibility
    const ind = document.getElementById('slotIndicator');
    const sel3 = document.getElementById('slotSelectorStep3');
    if (ind) ind.style.display = multiSlot ? 'flex' : 'none';
    if (sel3) sel3.style.display = multiSlot ? 'flex' : 'none';

    // Upload label
    const emptyIdx = state.slots.findIndex(s => !s.img);
    const lbl = document.getElementById('uploadBtnLabel');
    if (lbl) lbl.textContent = multiSlot && emptyIdx !== -1 ?
        `Foto ${emptyIdx + 1} de ${state.slots.length}` :
        'Faça upload aqui';

    const hint = document.getElementById('canvasHint');
    hint.style.display = (currentStep === 3 && hasCurImg) ? 'block' : 'none';
}


/* ================================================================
 * TOOLBAR — handlers
 * ================================================================ */

document.getElementById('btnUndo').onclick = undo;
document.getElementById('btnFit').onclick = resetView;
document.getElementById('btnReset').onclick = resetView;

document.getElementById('btnRotate').onclick = () => {
    pushHistory();
    const s = currentSlot();
    s.rotation = (s.rotation + 90) % 360;
    updateIndicators();
    triggerBump(document.querySelector('.rotation-pill'));
    draw();
};

document.getElementById('btnZoomIn').onclick = () => {
    pushHistory();
    applyScale(currentSlot().scale + 0.1);
};

document.getElementById('btnZoomOut').onclick = () => {
    pushHistory();
    applyScale(currentSlot().scale - 0.1);
};


/* ================================================================
 * LAYOUT — seletor de grid
 * ================================================================ */

function setLayout(name) {
    const oldSlots = state.slots;
    const grid = CUSTOM_GRIDS[name];
    const count = grid ? grid.length : 1;

    // Revoke URLs for slots beyond new count
    for (let i = count; i < oldSlots.length; i++) {
        if (oldSlots[i] && oldSlots[i].imgUrl) URL.revokeObjectURL(oldSlots[i].imgUrl);
    }

    state.layout = name;
    state.layoutOffset = {
        x: 0,
        y: 0
    };
    state.history = [];
    state.slots = Array.from({
        length: count
    }, (_, i) => ({
        img: oldSlots[i] ? oldSlots[i].img : null,
        imgUrl: oldSlots[i] ? oldSlots[i].imgUrl : null,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
    }));
    state.activeSlot = Math.min(state.activeSlot, count - 1);

    updateLayoutUI();
    updateSlotDotsUI();
    draw();
    syncUI();
}

function updateLayoutUI() {
    document.querySelectorAll('.layout-btn').forEach(btn => {
        const match = btn.dataset.layout === state.layout ||
            (btn.dataset.layout === 'DIVISOR-1' && state.layout.startsWith('DIVISOR'));
        btn.classList.toggle('active', match);
    });
}

document.getElementById('layoutGrid').addEventListener('click', e => {
    const btn = e.target.closest('.layout-btn');
    if (!btn) return;
    setLayout(btn.dataset.layout);
});


/* ================================================================
 * SLOT DOTS — botões de seleção de slot ativo
 * ================================================================ */

function updateSlotDotsUI() {
    ['slotDots', 'slotDotsStep3'].forEach(id => {
        const container = document.getElementById(id);
        if (!container) return;
        container.innerHTML = '';
        state.slots.forEach((s, i) => {
            const dot = document.createElement('button');
            dot.className = 'slot-dot' +
                (i === state.activeSlot ? ' active' : '') +
                (s.img ? ' has-img' : '');
            dot.title = `Foto ${i + 1}`;
            dot.textContent = s.img ? '✓' : String(i + 1);
            dot.addEventListener('click', () => {
                state.activeSlot = i;
                updateSlotDotsUI();
                updateIndicators();
                draw();
                syncUI();
            });
            container.appendChild(dot);
        });
    });
}


/* ================================================================
 * TOAST — notificação genérica
 * ================================================================ */

let _toastTimer = null;

function showToast(msg) {
    let toast = document.getElementById('dpiToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'dpiToast';
        toast.className = 'dpi-toast';
        toast.innerHTML = '<span id="dpiToastMsg"></span>';
        document.body.appendChild(toast);
    }
    document.getElementById('dpiToastMsg').textContent = msg;
    toast.classList.add('visible');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => toast.classList.remove('visible'), 5500);
}


/* ================================================================
 * DPI — verificação 300 DPI para impressão
 * ================================================================ */

function checkDpi(img, rect) {
    // Para impressão a 300 DPI, a imagem precisa de ~4× os pixels lógicos do slot
    if (img.naturalWidth < rect.w * 4 || img.naturalHeight < rect.h * 4) {
        showToast('⚠️ Resolução baixa — pode ficar pixelado na impressão a 300 DPI.');
    }
}


/* ================================================================
 * CÂMERA — aviso de sobreposição com zona da câmera traseira
 * ================================================================ */

function checkCameraOverlap(rect, m) {
    const fc = m._facaCenter;
    if (!fc) return;
    const x0 = fc.x - fc.w / 2;
    const y0 = fc.y - fc.h / 2;
    const normX = (rect.x - x0) / fc.w;
    const normY = (rect.y - y0) / fc.h;
    // Camera zone: top portion of faca space (y < 0.20)
    if (normY < 0.20) {
        showToast('⚠️ Foto pode sobrepor a câmera traseira neste layout.');
    }
}


/* ================================================================
 * DIVISOR DINÂMICO — ciclar entre 2 / 4 / 6 slots
 * ================================================================ */

function addDivisorSlots() {
    const idx = DIVISOR_SEQUENCE.indexOf(state.layout);
    if (idx < 0 || idx >= DIVISOR_SEQUENCE.length - 1) return;
    pushHistory();
    const nextLayout = DIVISOR_SEQUENCE[idx + 1];
    const oldSlots = state.slots;
    const count = CUSTOM_GRIDS[nextLayout].length;
    state.layout = nextLayout;
    state.layoutOffset = {
        x: 0,
        y: 0
    };
    state.slots = Array.from({
        length: count
    }, (_, i) => ({
        img: oldSlots[i] ? oldSlots[i].img : null,
        imgUrl: oldSlots[i] ? oldSlots[i].imgUrl : null,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
    }));
    state.activeSlot = Math.min(state.activeSlot, count - 1);
    updateLayoutUI();
    updateSlotDotsUI();
    draw();
    syncUI();
}

function removeDivisorSlots() {
    const idx = DIVISOR_SEQUENCE.indexOf(state.layout);
    if (idx <= 0) return;
    pushHistory();
    const prevLayout = DIVISOR_SEQUENCE[idx - 1];
    const oldSlots = state.slots;
    const count = CUSTOM_GRIDS[prevLayout].length;
    // Revoke URLs for removed slots
    for (let i = count; i < oldSlots.length; i++) {
        if (oldSlots[i].imgUrl) URL.revokeObjectURL(oldSlots[i].imgUrl);
    }
    state.layout = prevLayout;
    state.layoutOffset = {
        x: 0,
        y: 0
    };
    state.slots = Array.from({
        length: count
    }, (_, i) => ({
        img: oldSlots[i] ? oldSlots[i].img : null,
        imgUrl: oldSlots[i] ? oldSlots[i].imgUrl : null,
        x: oldSlots[i] ? oldSlots[i].x : 0,
        y: oldSlots[i] ? oldSlots[i].y : 0,
        scale: oldSlots[i] ? oldSlots[i].scale : 1,
        rotation: oldSlots[i] ? oldSlots[i].rotation : 0,
    }));
    state.activeSlot = Math.min(state.activeSlot, count - 1);
    updateLayoutUI();
    updateSlotDotsUI();
    draw();
    syncUI();
}

document.getElementById('btnDivisorAdd').onclick = addDivisorSlots;
document.getElementById('btnDivisorRemove').onclick = removeDivisorSlots;

/* ================================================================
 * NUDGE — micro-ajuste de posição (1px por clique)
 * ================================================================ */

function nudgeImage(dx, dy) {
    if (!state.model) return;
    pushHistory();
    state.layoutOffset.x += dx;
    state.layoutOffset.y += dy;
    draw();
}

document.getElementById('btnNudgeUp').onclick = () => nudgeImage(0, -1);
document.getElementById('btnNudgeDown').onclick = () => nudgeImage(0, 1);
document.getElementById('btnNudgeLeft').onclick = () => nudgeImage(-1, 0);
document.getElementById('btnNudgeRight').onclick = () => nudgeImage(1, 0);


/* ================================================================
 * CARREGAMENTO E INICIALIZAÇÃO DA APP
 * ================================================================ */

function addModelOption(m) {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.name;
    sel.appendChild(opt);
}

async function initApp() {
    try {
        let models;
        const resp = await fetch('/api/models').catch(() => null);
        if (resp && resp.ok) {
            models = await resp.json();
        } else {
            models = STATIC_MODELS;
        }

        for (const m of models) {
            const model = {
                id: m.id ?? m.name.toLowerCase().replace(/\s+/g, '-'),
                name: m.name,
                mockupPath: m.mockupImageUrl,
                facaMaskPath: null,
                facaCircles: [],
                fw: m.frameWidth ?? 500,
                fh: m.frameHeight ?? 1000,
                _mockupImg: null,
            };

            // Carregar SVG da máscara para extrair path outline + circles
            if (m.screenMaskPath) {
                try {
                    const svgResp = await fetch(m.screenMaskPath);
                    if (svgResp.ok) {
                        const svgText = await svgResp.text();
                        // Extrair o d="" do <path> principal (outline da capinha)
                        const pathMatch = svgText.match(/<path[^>]*\sd="([^"]+)"/);
                        if (pathMatch) model.facaMaskPath = pathMatch[1];

                        const circleMatches = [...svgText.matchAll(/<circle([^>]*?)\/>/g)];
                        model.facaCircles = circleMatches.map(cm => {
                            const a = cm[1];
                            return {
                                cx: parseFloat(a.match(/cx="([^"]+)"/)?.[1] || 0),
                                cy: parseFloat(a.match(/cy="([^"]+)"/)?.[1] || 0),
                                r: parseFloat(a.match(/\br="([^"]+)"/)?.[1] || 0),
                            };
                        }).filter(c => c.r > 0);
                    }
                } catch (e) {
                    console.warn('[Mobifans] SVG não encontrado:', m.screenMaskPath);
                }
            }

            MODELS.push(model);
            addModelOption(model);
        }

        dropdownState.hierarchy = organizeModelsByBrandAndSeries();
        renderBrands();

    } catch (err) {
        console.error('[Mobifans] Erro ao carregar modelos:', err);
    } finally {
        finishLoading();
    }
}

initApp();


/* ================================================================
 * HANDLER DE MUDANÇA DE MODELO
 * ================================================================ */

sel.addEventListener('change', async () => {
    // Revoke all existing image object URLs before switching model
    state.slots.forEach(s => {
        if (s.imgUrl) URL.revokeObjectURL(s.imgUrl);
    });

    const found = MODELS.find(m => m.id === sel.value);

    if (!found) {
        state.model = null;
        canvas.style.display = 'none';
        document.getElementById('emptyState').style.display = 'flex';
        syncUI();
        return;
    }

    loadingEl.classList.add('visible');
    document.getElementById('emptyState').style.display = 'none';

    state.model = found;
    state.layout = 'RETRATO';
    state.layoutOffset = { x: 0, y: 0 };
    state.slots = [{
        img: null,
        imgUrl: null,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0
    }];
    state.activeSlot = 0;
    state.history = [];

    updateIndicators();
    updateLayoutUI();
    updateSlotDotsUI();

    initCanvas(found);
    canvas.style.display = 'block';
    canvas.classList.add('entering');
    canvas.addEventListener('animationend', () => canvas.classList.remove('entering'), {
        once: true
    });

    await loadModelImages(found);
    initCanvas(found);

    loadingEl.classList.remove('visible');
    draw();
    syncUI();
});


/* ================================================================
 * UPLOAD DA ARTE
 * ================================================================ */

document.getElementById('uploadBtn').onclick = () => fileInput.click();

fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    // Preenche o primeiro slot vazio; se todos cheios, substitui o ativo
    let targetIdx = state.slots.findIndex(s => !s.img);
    if (targetIdx === -1) targetIdx = state.activeSlot;

    const slot = state.slots[targetIdx];

    // Revoke previous URL for this slot
    if (slot.imgUrl) {
        URL.revokeObjectURL(slot.imgUrl);
        slot.imgUrl = null;
    }

    const imgUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
        slot.img = img;
        slot.imgUrl = imgUrl;
        slot.x = 0;
        slot.y = 0;
        slot.scale = 1;
        slot.rotation = 0;

        state.activeSlot = targetIdx;
        state.history = [];

        updateIndicators();
        updateSlotDotsUI();

        if (state.model && state.model._facaCenter) {
            const rects = getSlotRects(state.model, state.layout);
            const r = rects[targetIdx];
            if (r) {
                checkDpi(img, r);
                checkCameraOverlap(r, state.model);
            }
        }

        const name = file.name.length > 26 ? file.name.slice(0, 24) + '…' : file.name;
        document.getElementById('uploadName').textContent = name;
        const uploadStatus = document.getElementById('uploadStatus');
        uploadStatus.style.display = 'flex';
        uploadStatus.classList.remove('animating');
        void uploadStatus.offsetWidth;
        uploadStatus.classList.add('animating');
        uploadStatus.addEventListener('animationend', () => uploadStatus.classList.remove('animating'), {
            once: true
        });

        draw();
        syncUI();
    };

    img.onerror = () => URL.revokeObjectURL(imgUrl);
    img.src = imgUrl;
    e.target.value = '';
});


/* ================================================================
 * DOWNLOAD — exportar preview em alta resolução (4×)
 * ================================================================ */

document.getElementById('downloadBtn').onclick = () => {
    if (!state.model || !state.slots.some(s => s.img)) return;
    const m = state.model;
    const SC = 4;
    const dlCanvas = document.createElement('canvas');
    dlCanvas.width = m.fw * SC;
    dlCanvas.height = m.fh * SC;
    const dlCtx = dlCanvas.getContext('2d');
    renderAllLayers(dlCtx, m, state, SC, true); // exportMode=true: all slots at 100% opacity
    dlCanvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `preview-capinha-${m.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
};


/* ================================================================
 * INICIALIZAÇÃO
 * ================================================================ */

function finishLoading() {
    const loader = document.getElementById('loader-screen');
    if (!loader) return;
    loader.classList.add('loader-hidden');
    setTimeout(() => loader.remove(), 550);
}

syncUI();
showStep(1);
updateLayoutUI();
updateSlotDotsUI();