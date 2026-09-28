#!/usr/bin/env node
/**
 * Gera as texturas ILUSTRATIVAS (SVG, repetíveis) usadas no simulador de
 * ambientes e no catálogo. Não são fotos de produtos reais: servem apenas
 * para a demonstração até a loja enviar as texturas/fotos oficiais.
 *
 * Uso: npm run textures
 * Entrada: src/content/textures.json  ->  Saída: public/texturas/<id>.svg
 *
 * Todas as medidas estão em centímetros (1 unidade do viewBox = 1 cm).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const specs = JSON.parse(
  readFileSync(join(root, "src/content/textures.json"), "utf8"),
);
const outDir = join(root, "public/texturas");
mkdirSync(outDir, { recursive: true });

/* ---------- utilitários ---------- */

// PRNG determinístico (mulberry32): as texturas saem idênticas a cada geração.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v) => String(Math.round(v * 100) / 100);
const between = (R, a, b) => a + R() * (b - a);
const pick = (R, list) => list[Math.floor(R() * list.length)];

function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function rgbToHex(rgb) {
  return (
    "#" +
    rgb
      .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Clareia (amt > 0) ou escurece (amt < 0) uma cor. amt entre -1 e 1. */
function shade(hex, amt) {
  const target = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  return rgbToHex(hexToRgb(hex).map((c) => (target - c) * p + c));
}

/** Converte uma polilinha em curva suave (Catmull-Rom -> Bézier). */
function smoothPath(pts) {
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d;
}

function svg([w, h], defs, body) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${n(w)}" height="${n(h)}" viewBox="0 0 ${n(w)} ${n(h)}">` +
    `<defs>${defs}</defs>${body}</svg>\n`
  );
}

/**
 * Filtro de superfície: "nuvens" (variação de tom em baixa frequência) e
 * "grão" (ruído fino), aplicados com soft-light sobre o desenho original.
 * stitchTiles + região do filtro = arquivo inteiro -> ruído repetível sem emendas.
 */
function surfaceFilter(id, [w, h], opts) {
  const {
    seed = 1,
    grain = 1.2,
    grainFreq = "1.1",
    grainOctaves = 2,
    cloud = 0,
    cloudFreq = "0.035",
  } = opts;
  const transfer = (slope) => {
    const b = n(0.5 - slope / 2);
    return (
      `<feFuncR type="linear" slope="${slope}" intercept="${b}"/>` +
      `<feFuncG type="linear" slope="${slope}" intercept="${b}"/>` +
      `<feFuncB type="linear" slope="${slope}" intercept="${b}"/>` +
      `<feFuncA type="linear" slope="0" intercept="1"/>`
    );
  };
  let f =
    `<filter id="${id}" x="0" y="0" width="${n(w)}" height="${n(h)}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${grainFreq}" numOctaves="${grainOctaves}" seed="${seed}" stitchTiles="stitch" result="gn"/>` +
    `<feColorMatrix in="gn" type="saturate" values="0" result="gm"/>` +
    `<feComponentTransfer in="gm" result="grain">${transfer(grain)}</feComponentTransfer>`;
  let last = "SourceGraphic";
  if (cloud > 0) {
    f +=
      `<feTurbulence type="fractalNoise" baseFrequency="${cloudFreq}" numOctaves="3" seed="${seed + 7}" stitchTiles="stitch" result="cn"/>` +
      `<feColorMatrix in="cn" type="saturate" values="0" result="cm"/>` +
      `<feComponentTransfer in="cm" result="cloud">${transfer(cloud)}</feComponentTransfer>` +
      `<feBlend in="cloud" in2="SourceGraphic" mode="soft-light" result="b1"/>`;
    last = "b1";
  }
  f +=
    `<feBlend in="grain" in2="${last}" mode="soft-light" result="b2"/>` +
    `<feComposite in="b2" in2="SourceGraphic" operator="in"/></filter>`;
  return f;
}

function gridTiles(size, tile) {
  const out = [];
  for (let y = 0; y < size[1] - 0.01; y += tile[1]) {
    for (let x = 0; x < size[0] - 0.01; x += tile[0]) out.push([x, y]);
  }
  return out;
}

/** Veio de mármore: caminhada aleatória suavizada, com halo difuso + núcleo fino. */
function vein(R, [x0, y0], [tw, th], color, scale, strong) {
  const pts = [];
  const vertical = R() < 0.5;
  let x = vertical ? x0 + between(R, 0.1, 0.9) * tw : x0 - tw * 0.05;
  let y = vertical ? y0 - th * 0.05 : y0 + between(R, 0.1, 0.9) * th;
  let ang = vertical ? Math.PI / 2 + between(R, -0.6, 0.6) : between(R, -0.6, 0.6);
  const step = Math.max(tw, th) / 9;
  for (let i = 0; i < 12; i++) {
    pts.push([x, y]);
    ang += between(R, -0.45, 0.45);
    x += Math.cos(ang) * step;
    y += Math.sin(ang) * step;
  }
  const d = smoothPath(pts);
  const w = (strong ? between(R, 0.7, 1.4) : between(R, 0.15, 0.4)) * scale;
  return (
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${n(w * 3.2)}" stroke-opacity="${n(strong ? 0.12 : 0.06)}" stroke-linecap="round" filter="url(#soft)"/>` +
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${n(w)}" stroke-opacity="${n(between(R, 0.35, 0.6))}" stroke-linecap="round"/>`
  );
}

/* ---------- geradores ---------- */

const generators = {
  tiles(s, R) {
    const g = s.groutWidth;
    let body = `<rect width="${n(s.size[0])}" height="${n(s.size[1])}" fill="${s.grout}"/><g filter="url(#surf)">`;
    for (const [x, y] of gridTiles(s.size, s.tile)) {
      const c = shade(s.base, between(R, -1, 1) * s.variance);
      body += `<rect x="${n(x + g / 2)}" y="${n(y + g / 2)}" width="${n(s.tile[0] - g)}" height="${n(s.tile[1] - g)}" rx="${n(g / 2)}" fill="${c}"/>`;
    }
    body += "</g>";
    const defs = surfaceFilter("surf", s.size, {
      seed: s.seed,
      grain: n(s.grain * 4),
      grainFreq: "1.2",
      cloud: s.cloud ?? 0.8,
      cloudFreq: "0.04",
    });
    return svg(s.size, defs, body);
  },

  marble(s, R) {
    const g = s.groutWidth;
    const scale = Math.max(s.tile[0], s.tile[1]) / 90;
    let defs =
      `<filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${n(0.9 * scale)}"/></filter>` +
      surfaceFilter("surf", s.size, { seed: s.seed, grain: 0.8, grainFreq: "0.9", cloud: 1.3, cloudFreq: "0.03" });
    let body = `<rect width="${n(s.size[0])}" height="${n(s.size[1])}" fill="${s.grout}"/>`;
    gridTiles(s.size, s.tile).forEach(([x, y], i) => {
      const id = `t${i}`;
      const tx = x + g / 2;
      const ty = y + g / 2;
      const tw = s.tile[0] - g;
      const th = s.tile[1] - g;
      defs += `<clipPath id="${id}"><rect x="${n(tx)}" y="${n(ty)}" width="${n(tw)}" height="${n(th)}"/></clipPath>`;
      body += `<g clip-path="url(#${id})"><g filter="url(#surf)"><rect x="${n(tx)}" y="${n(ty)}" width="${n(tw)}" height="${n(th)}" fill="${shade(s.base, between(R, -0.015, 0.015))}"/></g>`;
      const main = 1 + Math.floor(R() * 2);
      for (let v = 0; v < main; v++) body += vein(R, [tx, ty], [tw, th], s.vein, scale, true);
      for (let v = 0; v < 3; v++) body += vein(R, [tx, ty], [tw, th], s.vein, scale, false);
      body += vein(R, [tx, ty], [tw, th], s.accent, scale, false);
      body += "</g>";
    });
    return svg(s.size, defs, body);
  },

  wood(s, R) {
    const [W, H] = s.size;
    const [pw, pl] = s.plank;
    const cols = Math.round(W / pw);
    const perCol = Math.round(H / pl);
    const gap = 0.18;
    let body = `<rect width="${n(W)}" height="${n(H)}" fill="${s.gap}"/><g filter="url(#surf)">`;
    for (let c = 0; c < cols; c++) {
      const offset = Math.round(R() * pl);
      for (let k = -1; k <= perCol; k++) {
        const y = offset + k * pl;
        if (y >= H || y + pl <= 0) continue;
        // A mesma tábua reaparece nas bordas: propriedades vêm do índice "k mod perCol".
        const PR = rng(s.seed * 1000 + c * 37 + (((k % perCol) + perCol) % perCol));
        const x = c * pw;
        const base = shade(pick(PR, s.palette), between(PR, -0.04, 0.04));
        body += `<rect x="${n(x + gap / 2)}" y="${n(y + gap / 2)}" width="${n(pw - gap)}" height="${n(pl - gap)}" fill="${base}"/>`;
        const lines = 6 + Math.floor(PR() * 4);
        for (let l = 0; l < lines; l++) {
          const lx = x + between(PR, 1, pw - 1);
          const amp = between(PR, 0.2, 0.9);
          const lambda = between(PR, 25, 70);
          const phase = between(PR, 0, Math.PI * 2);
          const drift = between(PR, -1, 1);
          const pts = [];
          for (let t = 0; t <= pl + 0.01; t += pl / 10) {
            const px = lx + amp * Math.sin((t / lambda) * Math.PI * 2 + phase) + (drift * t) / pl;
            pts.push([Math.min(x + pw - 0.4, Math.max(x + 0.4, px)), y + t]);
          }
          const light = PR() < 0.25;
          body += `<path d="${smoothPath(pts)}" fill="none" stroke="${shade(base, light ? 0.14 : -between(PR, 0.18, 0.32))}" stroke-width="${n(between(PR, 0.12, 0.42))}" stroke-opacity="${n(between(PR, 0.35, 0.65))}"/>`;
        }
        if (PR() < 0.22) {
          const kx = x + between(PR, 4, pw - 4);
          const ky = y + between(PR, 15, pl - 15);
          body += `<ellipse cx="${n(kx)}" cy="${n(ky)}" rx="${n(between(PR, 0.5, 0.9))}" ry="${n(between(PR, 1.2, 2))}" fill="${shade(base, -0.4)}" fill-opacity="0.55"/>`;
          body += `<ellipse cx="${n(kx)}" cy="${n(ky)}" rx="1.6" ry="3.2" fill="none" stroke="${shade(base, -0.25)}" stroke-width="0.25" stroke-opacity="0.5"/>`;
        }
      }
    }
    body += "</g>";
    const defs = surfaceFilter("surf", s.size, {
      seed: s.seed,
      grain: 1.1,
      grainFreq: "1.5 0.035",
      cloud: 0.9,
      cloudFreq: "0.05 0.012",
    });
    return svg(s.size, defs, body);
  },

  cement(s, R) {
    const g = s.groutWidth;
    let body = `<rect width="${n(s.size[0])}" height="${n(s.size[1])}" fill="${s.grout}"/><g filter="url(#surf)">`;
    for (const [x, y] of gridTiles(s.size, s.tile)) {
      body += `<rect x="${n(x + g / 2)}" y="${n(y + g / 2)}" width="${n(s.tile[0] - g)}" height="${n(s.tile[1] - g)}" fill="${shade(s.base, between(R, -0.03, 0.03))}"/>`;
    }
    body += "</g>";
    const defs = surfaceFilter("surf", s.size, {
      seed: s.seed,
      grain: 1.5,
      grainFreq: "1.3",
      grainOctaves: 3,
      cloud: 2.6,
      cloudFreq: "0.022",
    });
    return svg(s.size, defs, body);
  },

  stone(s, R) {
    const g = s.groutWidth;
    let body = `<rect width="${n(s.size[0])}" height="${n(s.size[1])}" fill="${s.grout}"/><g filter="url(#surf)">`;
    for (const [x, y] of gridTiles(s.size, s.tile)) {
      const base = shade(s.base, between(R, -0.07, 0.07));
      body += `<rect x="${n(x + g / 2)}" y="${n(y + g / 2)}" width="${n(s.tile[0] - g)}" height="${n(s.tile[1] - g)}" rx="0.4" fill="${base}"/>`;
      for (let p = 0; p < 22; p++) {
        body += `<circle cx="${n(x + between(R, 1, s.tile[0] - 1))}" cy="${n(y + between(R, 1, s.tile[1] - 1))}" r="${n(between(R, 0.08, 0.35))}" fill="${shade(base, -0.35)}" fill-opacity="${n(between(R, 0.2, 0.45))}"/>`;
      }
    }
    body += "</g>";
    const defs = surfaceFilter("surf", s.size, {
      seed: s.seed,
      grain: 1.3,
      grainFreq: "1.1",
      grainOctaves: 3,
      cloud: 0.9,
      cloudFreq: "0.05",
    });
    return svg(s.size, defs, body);
  },

  terrazzo(s, R) {
    const g = s.groutWidth;
    let defs = surfaceFilter("surf", s.size, { seed: s.seed, grain: 1, grainFreq: "1.2", cloud: 1, cloudFreq: "0.04" });
    let body = `<rect width="${n(s.size[0])}" height="${n(s.size[1])}" fill="${s.grout}"/>`;
    const weights = [0.12, 0.08, 0.1, 0.3, 0.12, 0.28];
    gridTiles(s.size, s.tile).forEach(([x, y], i) => {
      const tx = x + g / 2;
      const ty = y + g / 2;
      const tw = s.tile[0] - g;
      const th = s.tile[1] - g;
      defs += `<clipPath id="t${i}"><rect x="${n(tx)}" y="${n(ty)}" width="${n(tw)}" height="${n(th)}"/></clipPath>`;
      body += `<g clip-path="url(#t${i})" filter="url(#surf)"><rect x="${n(tx)}" y="${n(ty)}" width="${n(tw)}" height="${n(th)}" fill="${shade(s.base, between(R, -0.012, 0.012))}"/>`;
      for (let c = 0; c < 170; c++) {
        let roll = R();
        let color = s.chips[s.chips.length - 1];
        for (let w = 0; w < weights.length; w++) {
          if ((roll -= weights[w]) <= 0) {
            color = s.chips[w];
            break;
          }
        }
        const cx = tx + R() * tw;
        const cy = ty + R() * th;
        const r = 0.3 + R() * R() * 1.9;
        const sides = 4 + Math.floor(R() * 4);
        const rot = R() * Math.PI;
        const pts = [];
        for (let k = 0; k < sides; k++) {
          const a = rot + (k / sides) * Math.PI * 2;
          const rr = r * between(R, 0.6, 1.1);
          pts.push(`${n(cx + Math.cos(a) * rr)},${n(cy + Math.sin(a) * rr * between(R, 0.7, 1))}`);
        }
        body += `<polygon points="${pts.join(" ")}" fill="${shade(color, between(R, -0.08, 0.08))}"/>`;
      }
      body += "</g>";
    });
    return svg(s.size, defs, body);
  },

  hydraulic(s) {
    const [tw] = s.tile;
    const g = s.groutWidth;
    const { field, primary, secondary, tertiary } = s.colors;
    // Motivo desenhado para o canto superior esquerdo; as 4 rotações formam o padrão.
    const motif =
      `<rect width="${tw}" height="${tw}" fill="${field}"/>` +
      `<path d="M0 0A${tw} ${tw} 0 0 0 ${tw} ${tw}A${tw} ${tw} 0 0 0 0 0Z" fill="${tertiary}" fill-opacity="0.9" stroke="${primary}" stroke-width="0.45"/>` +
      `<path d="M0 0H8.6A8.6 8.6 0 0 1 0 8.6Z" fill="${primary}"/>` +
      `<path d="M0 0H5.4A5.4 5.4 0 0 1 0 5.4Z" fill="${field}"/>` +
      `<path d="M0 0H3.2A3.2 3.2 0 0 1 0 3.2Z" fill="${secondary}"/>` +
      `<path d="M${tw} ${tw}H${tw - 4.2}A4.2 4.2 0 0 1 ${tw} ${tw - 4.2}Z" fill="${secondary}"/>` +
      `<path d="M${tw} ${tw}H${tw - 2.2}A2.2 2.2 0 0 1 ${tw} ${tw - 2.2}Z" fill="${field}"/>` +
      `<rect x="0.4" y="0.4" width="${tw - 0.8}" height="${tw - 0.8}" fill="none" stroke="${primary}" stroke-width="0.35" stroke-opacity="0.55"/>`;
    // Rotações: o canto do motivo principal converge para o centro do bloco 2x2.
    const placements = [
      [0, 0, 180],
      [tw, 0, 270],
      [tw, tw, 0],
      [0, tw, 90],
    ];
    let body = `<rect width="${n(s.size[0])}" height="${n(s.size[1])}" fill="${s.grout}"/><g filter="url(#surf)">`;
    for (const [x, y, rot] of placements) {
      const c = tw / 2;
      body +=
        `<g transform="translate(${n(x + g / 2)} ${n(y + g / 2)}) scale(${n((tw - g) / tw)}) rotate(${rot} ${c} ${c})">` +
        `<use href="#m"/></g>`;
    }
    body += "</g>";
    const defs =
      `<g id="m">${motif}</g>` +
      surfaceFilter("surf", s.size, { seed: s.seed, grain: 1.4, grainFreq: "1.4", cloud: 1.4, cloudFreq: "0.08" });
    return svg(s.size, defs, body);
  },

  subway(s, R) {
    const [bw, bh] = s.brick;
    const g = s.groutWidth;
    const colors = [0, 1, 2, 3].map(() => shade(s.base, between(R, -0.035, 0.035)));
    const brick = (x, y, c) =>
      `<rect x="${n(x + g / 2)}" y="${n(y + g / 2)}" width="${n(bw - g)}" height="${n(bh - g)}" rx="0.45" fill="${c}"/>` +
      `<rect x="${n(x + g / 2)}" y="${n(y + g / 2)}" width="${n(bw - g)}" height="${n(bh - g)}" rx="0.45" fill="url(#glaze)"/>`;
    let body = `<rect width="${n(s.size[0])}" height="${n(s.size[1])}" fill="${s.grout}"/><g filter="url(#surf)">`;
    body += brick(0, 0, colors[0]) + brick(bw, 0, colors[1]);
    // Segunda fiada deslocada meia peça (a peça que cruza a borda é repetida do outro lado).
    body += brick(-bw / 2, bh, colors[3]) + brick(bw / 2, bh, colors[2]) + brick(bw * 1.5, bh, colors[3]);
    body += "</g>";
    const defs =
      `<linearGradient id="glaze" x1="0" y1="0" x2="0.25" y2="1">` +
      `<stop offset="0" stop-color="#fff" stop-opacity="0.5"/><stop offset="0.16" stop-color="#fff" stop-opacity="0.1"/>` +
      `<stop offset="0.7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.12"/></linearGradient>` +
      surfaceFilter("surf", s.size, { seed: s.seed, grain: 0.6, grainFreq: "1.6", cloud: 0.8, cloudFreq: "0.12" });
    return svg(s.size, defs, body);
  },

  hex(s, R) {
    const r = s.radius;
    const [W, H] = s.size;
    const dx = 1.5 * r;
    const dy = Math.sqrt(3) * r;
    const cols = Math.round(W / dx);
    const rows = Math.round(H / dy);
    const colorAt = new Map();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) colorAt.set(`${i},${j}`, pick(R, s.palette));
    }
    const inner = r - s.groutWidth * 0.62;
    let body = `<rect width="${n(W)}" height="${n(H)}" fill="${s.grout}"/><g filter="url(#surf)">`;
    for (let i = -1; i <= cols; i++) {
      for (let j = -1; j <= rows; j++) {
        const cx = i * dx;
        const cy = j * dy + (((i % 2) + 2) % 2 === 1 ? dy / 2 : 0);
        const key = `${((i % cols) + cols) % cols},${((j % rows) + rows) % rows}`;
        const pts = [];
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI / 3) * k;
          pts.push(`${n(cx + Math.cos(a) * inner)},${n(cy + Math.sin(a) * inner)}`);
        }
        body += `<polygon points="${pts.join(" ")}" fill="${colorAt.get(key)}"/>`;
      }
    }
    body += "</g>";
    const defs = surfaceFilter("surf", s.size, { seed: s.seed, grain: 0.8, grainFreq: "1.4", cloud: 0.9, cloudFreq: "0.06" });
    return svg(s.size, defs, body);
  },

  strips(s, R) {
    const [W, H] = s.size;
    const heights = [];
    let total = 0;
    while (total < H) {
      let h = pick(R, [2.5, 3, 3.5, 4, 5]);
      if (H - total - h < 2.5) h = H - total;
      heights.push(h);
      total += h;
    }
    const gap = 0.35;
    let body = `<rect width="${n(W)}" height="${n(H)}" fill="${s.grout}"/><g filter="url(#surf)">`;
    let y = 0;
    for (const h of heights) {
      const widths = [];
      let sum = 0;
      while (sum < W) {
        let w = between(R, 6, 22);
        if (W - sum - w < 5) w = W - sum;
        widths.push(w);
        sum += w;
      }
      const shift = R() * W;
      let x = 0;
      for (const w of widths) {
        const c = shade(pick(R, s.palette), between(R, -0.05, 0.05));
        const depth = between(R, -0.2, 0.2);
        for (const px of [x + shift, x + shift - W]) {
          if (px >= W || px + w <= 0) continue;
          body += `<rect x="${n(px + gap / 2)}" y="${n(y + gap / 2 + depth * 0.2)}" width="${n(w - gap)}" height="${n(h - gap)}" rx="0.35" fill="${c}"/>`;
          body += `<rect x="${n(px + gap / 2)}" y="${n(y + gap / 2 + depth * 0.2)}" width="${n(w - gap)}" height="${n(Math.min(0.6, h / 4))}" fill="#fff" fill-opacity="0.14"/>`;
        }
        x += w;
      }
      y += h;
    }
    body += "</g>";
    const defs = surfaceFilter("surf", s.size, { seed: s.seed, grain: 1.5, grainFreq: "1.1", grainOctaves: 3, cloud: 0.8, cloudFreq: "0.15" });
    return svg(s.size, defs, body);
  },

  granite(s, R) {
    const [W, H] = s.size;
    const weights = [0.34, 0.18, 0.26, 0.14, 0.08];
    let body = `<g filter="url(#surf)"><rect width="${n(W)}" height="${n(H)}" fill="${s.base}"/>`;
    for (let i = 0; i < 1300; i++) {
      let roll = R();
      let color = s.speckles[0];
      for (let w = 0; w < weights.length; w++) {
        if ((roll -= weights[w]) <= 0) {
          color = s.speckles[w];
          break;
        }
      }
      const x = R() * W;
      const y = R() * H;
      const r = 0.06 + R() * R() * 0.42;
      // Pintas perto da borda são repetidas do outro lado para o padrão não ter emenda.
      for (const ox of [0, x < 1 ? W : x > W - 1 ? -W : null]) {
        for (const oy of [0, y < 1 ? H : y > H - 1 ? -H : null]) {
          if (ox === null || oy === null) continue;
          body += `<circle cx="${n(x + ox)}" cy="${n(y + oy)}" r="${n(r)}" fill="${color}"/>`;
        }
      }
    }
    body += "</g>";
    const defs = surfaceFilter("surf", s.size, { seed: s.seed, grain: 1, grainFreq: "2", cloud: 1.4, cloudFreq: "0.08" });
    return svg(s.size, defs, body);
  },
};

let count = 0;
for (const [id, spec] of Object.entries(specs)) {
  if (id.startsWith("$") || spec.src) continue;
  const generate = generators[spec.kind];
  if (!generate) throw new Error(`Tipo de textura desconhecido: ${spec.kind} (${id})`);
  writeFileSync(join(outDir, `${id}.svg`), generate(spec, rng(spec.seed)));
  count++;
}
console.log(`${count} texturas geradas em public/texturas/`);
