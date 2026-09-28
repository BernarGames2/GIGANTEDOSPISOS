/**
 * Projeção das superfícies do simulador.
 *
 * Os ambientes são renders 3D; para cada superfície (piso e paredes) o render
 * informa o quadrilátero que um retângulo do mundo ocupa na imagem. A textura
 * do produto (em escala real, cm) é então mapeada nesse quadrilátero com uma
 * homografia (CSS matrix3d) — o navegador faz a perspectiva na GPU.
 */

export type Pt = readonly [number, number];
export type Quad = readonly [Pt, Pt, Pt, Pt];

/** Resolução das superfícies antes da projeção (px por cm). */
export const SURFACE_PX_PER_CM = 2.5;

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
