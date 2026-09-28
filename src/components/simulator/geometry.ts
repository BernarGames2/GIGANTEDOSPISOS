/**
 * Geometria do simulador de ambientes.
 *
 * Cada ambiente é uma "caixa" vista por uma câmera em perspectiva de um ponto
 * (x para a direita, y para cima, z para o fundo, em metros). As superfícies
 * (piso e paredes) são divs com a textura repetida em escala real (cm) e
 * projetadas na tela com uma homografia (CSS matrix3d) — o navegador faz o
 * mapeamento em perspectiva na GPU. Móveis e detalhes são polígonos SVG
 * calculados com a mesma câmera, então tudo se encaixa.
 */
import { shade } from "@/lib/color";

export const SCENE_W = 1000;
export const SCENE_H = 700;
/** Resolução das superfícies antes da projeção (px por cm). */
export const SURFACE_PX_PER_CM = 2;

const F = 720; // distância focal (px)
const CX = 500; // ponto de fuga
const CY = 330;
export const EYE = 1.35; // altura dos olhos (m)

export type Vec3 = readonly [number, number, number];
export type Pt = readonly [number, number];
export type Quad = readonly [Pt, Pt, Pt, Pt];

export function project([x, y, z]: Vec3): Pt {
  return [CX + (F * x) / z, CY - (F * (y - EYE)) / z];
}

/** Escala (px por metro) de um objeto à profundidade z. */
export const scaleAt = (z: number) => F / z;

/**
 * Homografia que leva o retângulo (0,0)-(w,h) ao quadrilátero `q`
 * (ordem: sup. esq., sup. dir., inf. dir., inf. esq.). Retorna o valor para
 * `transform` com `transform-origin: 0 0`. (Heckbert, "square to quad".)
 */
export function rectToQuadTransform(w: number, h: number, q: Quad) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  let g = 0;
  let hh = 0;
  if (Math.abs(dx3) > 1e-9 || Math.abs(dy3) > 1e-9) {
    const det = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / det;
    hh = (dx1 * dy3 - dx3 * dy1) / det;
  }
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + hh * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + hh * y3;
  // Converte de coordenadas do quadrado unitário para pixels do retângulo.
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.map((v) => +v.toPrecision(10)).join(",")})`;
}

/* ---------- formas SVG ---------- */

export type Shape =
  | { kind: "poly"; pts: Pt[]; fill: string; opacity?: number; stroke?: string; strokeWidth?: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; fill: string; opacity?: number }
  | { kind: "line"; a: Pt; b: Pt; stroke: string; width: number; opacity?: number }
  | { kind: "rect"; x: number; y: number; w: number; h: number; rx?: number; fill: string; opacity?: number; stroke?: string; strokeWidth?: number };

export interface ShapeStyle {
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
}

export function poly(points: Vec3[], fill: string, style: ShapeStyle = {}): Shape {
  return { kind: "poly", pts: points.map(project), fill, ...style };
}

export function line(a: Vec3, b: Vec3, stroke: string, width: number, opacity?: number): Shape {
  return { kind: "line", a: project(a), b: project(b), stroke, width, opacity };
}

export interface Box {
  x: readonly [number, number];
  y: readonly [number, number];
  z: readonly [number, number];
}

interface BoxColors {
  top?: string;
  side?: string;
  bottom?: string;
  front?: string;
  opacity?: number;
}

/** Caixa sólida: desenha só as faces visíveis pela câmera (frente por último). */
export function box({ x, y, z }: Box, color: string, colors: BoxColors = {}): Shape[] {
  const [x0, x1] = x;
  const [y0, y1] = y;
  const [z0, z1] = z;
  const o = { opacity: colors.opacity };
  const side = colors.side ?? shade(color, -0.16);
  const out: Shape[] = [];
  if (x0 > 0) out.push(poly([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], side, o));
  if (x1 < 0) out.push(poly([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], side, o));
  if (y1 < EYE) out.push(poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], colors.top ?? shade(color, 0.12), o));
  if (y0 > EYE) out.push(poly([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], colors.bottom ?? shade(color, -0.24), o));
  out.push(poly([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], colors.front ?? color, o));
  return out;
}

/** Sombra de contato no piso (usar dentro do grupo com desfoque). */
export function floorShadow({ x, z }: Box, spread = 0.06, opacity = 0.28): Shape {
  const [x0, x1] = x;
  const [z0, z1] = z;
  return poly(
    [
      [x0 - spread, 0, z0 - spread],
      [x1 + spread, 0, z0 - spread],
      [x1 + spread, 0, z1 + spread],
      [x0 - spread, 0, z1 + spread],
    ],
    "#1c1a16",
    { opacity },
  );
}

/** Retângulo frontal (paralelo à tela) na profundidade z — quadros, janelas, espelhos. */
export function frontRect(z: number, x: readonly [number, number], y: readonly [number, number], fill: string, extra: { rx?: number; opacity?: number; stroke?: string; strokeWidth?: number } = {}): Shape {
  const [ax, ay] = project([x[0], y[1], z]);
  const [bx, by] = project([x[1], y[0], z]);
  return { kind: "rect", x: ax, y: ay, w: bx - ax, h: by - ay, fill, ...extra, rx: extra.rx ? extra.rx * scaleAt(z) : undefined };
}

/** Elipse voltada para a câmera (folhagens, luminárias). Raio em metros. */
export function blob(center: Vec3, rx: number, ry: number, fill: string, opacity?: number): Shape {
  const [cx, cy] = project(center);
  const s = scaleAt(center[2]);
  return { kind: "ellipse", cx, cy, rx: rx * s, ry: ry * s, fill, opacity };
}

/** Elipse deitada num plano horizontal (altura y) — cubas, manchas de luz. */
export function flatEllipse(cx: number, y: number, cz: number, rx: number, rz: number, fill: string, opacity?: number): Shape {
  const [px] = project([cx, y, cz]);
  const [, yFar] = project([cx, y, cz + rz]);
  const [, yNear] = project([cx, y, cz - rz]);
  return {
    kind: "ellipse",
    cx: px,
    cy: (yFar + yNear) / 2,
    rx: rx * scaleAt(cz),
    ry: Math.abs(yNear - yFar) / 2,
    fill,
    opacity,
  };
}

export const pointsAttr = (pts: readonly Pt[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
