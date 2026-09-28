/**
 * Ambientes ILUSTRADOS do simulador (desenhos vetoriais, não fotos).
 * Na próxima fase, podem ser trocados por renders/fotos reais com máscaras de
 * piso e parede, ou pela foto do próprio cliente.
 */
import type { Environment } from "@/content/products";
import { shade } from "@/lib/color";
import {
  blob,
  box,
  flatEllipse,
  floorShadow,
  frontRect,
  line,
  poly,
  project,
  rectToQuadTransform,
  SURFACE_PX_PER_CM,
  type Box,
  type Quad,
  type Shape,
  type Vec3,
} from "./geometry";

export type WallId = "back" | "left" | "right";

export interface Plane {
  quad: Quad;
  widthCm: number;
  heightCm: number;
  transform: string;
}

export interface Room {
  id: Environment;
  label: string;
  dims: { width: number; depth: number; height: number; near: number };
  paint: string;
  ceiling: string;
  /** Paredes que recebem o revestimento escolhido. */
  wallSurfaces: WallId[];
  /** Produtos exibidos ao abrir o ambiente (ids de src/content/products.ts). */
  defaults: { floor: string; wall: string | null };
  planes: { floor: Plane } & Record<WallId, Plane>;
  /** Camadas SVG estáticas, desenhadas sobre as superfícies. */
  layers: { ceiling: Shape[]; decor: Shape[]; shadows: Shape[]; furniture: Shape[] };
  /** Mancha de reflexo/luz no piso (intensidade varia com o brilho do material). */
  sheen: Shape[];
}

type RoomInput = Omit<Room, "planes" | "layers" | "sheen"> & {
  build: (ctx: BuildContext) => { decor: Shape[]; shadows: Shape[]; furniture: Shape[]; ceiling?: Shape[]; sheen: Shape[] };
};

interface BuildContext {
  W: number; // meia largura
  D: number;
  H: number;
  near: number;
}

function plane(corners: [Vec3, Vec3, Vec3, Vec3], widthM: number, heightM: number): Plane {
  const quad = corners.map(project) as unknown as Quad;
  const widthCm = widthM * 100;
  const heightCm = heightM * 100;
  return {
    quad,
    widthCm,
    heightCm,
    transform: rectToQuadTransform(widthCm * SURFACE_PX_PER_CM, heightCm * SURFACE_PX_PER_CM, quad),
  };
}

/* ---------- paleta dos móveis ---------- */
const C = {
  green: "#2c5a41",
  greenDeep: "#1e3d28",
  mustard: "#e0a82e",
  terracotta: "#b5573d",
  wood: "#8a5d3b",
  woodLight: "#b88a5e",
  cream: "#f2ece0",
  white: "#f7f5f0",
  steel: "#c3c6c6",
  charcoal: "#2b2b28",
  leaf: ["#2f5b42", "#3f6f4f", "#4f8a5f", "#6a9f6d"],
  sky: "url(#sim-sky)",
};

/** Moldura de rodapé ao longo das paredes. */
function baseboards({ W, D, near }: BuildContext, color: string): Shape[] {
  const h = 0.07;
  return [
    frontRect(D - 0.001, [-W, W], [0, h], color),
    poly([[-W, 0, near], [-W, 0, D], [-W, h, D], [-W, h, near]], shade(color, -0.1)),
    poly([[W, 0, D], [W, 0, near], [W, h, near], [W, h, D]], shade(color, -0.06)),
  ];
}

/** Quatro pés sob um tampo (os do fundo primeiro, para a sobreposição ficar certa). */
function legsUnder(b: Box, h: number, t: number, color: string): Shape[] {
  const xs = [b.x[0] + t / 2, b.x[1] - t * 1.5];
  const zs = [b.z[1] - t * 1.5, b.z[0] + t / 2];
  return zs.flatMap((lz) => xs.flatMap((lx) => box({ x: [lx, lx + t], y: [0, h], z: [lz, lz + t] }, color)));
}

/** Planta: vaso + folhagem em camadas. */
function plant(base: Box, crown: Vec3, size: number, pot = C.terracotta): { shadow: Shape; shapes: Shape[] } {
  const [x, y, z] = crown;
  const leaves: Shape[] = [];
  const offsets: [number, number, number, number][] = [
    [-0.18, -0.05, 0.22, 0],
    [0.16, -0.08, 0.2, 1],
    [0, 0.12, 0.24, 2],
    [-0.1, 0.24, 0.16, 1],
    [0.12, 0.2, 0.17, 3],
    [0.02, -0.02, 0.2, 3],
  ];
  for (const [dx, dy, r, c] of offsets) {
    leaves.push(blob([x + dx * size, y + dy * size, z], r * size, r * size * 1.15, C.leaf[c]));
  }
  return { shadow: floorShadow(base, 0.05), shapes: [...box(base, pot), ...leaves] };
}

/** Janela com vista (vidro com céu + caixilho). */
function windowOnWall(z: number, x: [number, number], y: [number, number], frame = C.white): Shape[] {
  const out: Shape[] = [
    frontRect(z, [x[0] - 0.06, x[1] + 0.06], [y[0] - 0.06, y[1] + 0.06], frame),
    frontRect(z, x, y, C.sky),
  ];
  // Árvores distantes no terço inferior do vidro.
  const treeY = y[0] + (y[1] - y[0]) * 0.18;
  for (let i = 0; i < 5; i++) {
    const tx = x[0] + ((i + 0.5) / 5) * (x[1] - x[0]);
    out.push(blob([tx, treeY, z], 0.16 + (i % 2) * 0.05, 0.14, i % 2 ? "#8fb18a" : "#a3c09a", 0.9));
  }
  out.push(frontRect(z, x, [y[0], y[0] + (y[1] - y[0]) * 0.12], "#b9cda8", { opacity: 0.9 }));
  const midX = (x[0] + x[1]) / 2;
  const midY = y[0] + (y[1] - y[0]) * 0.55;
  out.push(
    line([midX, y[0], z], [midX, y[1], z], frame, 5),
    line([x[0], midY, z], [x[1], midY, z], frame, 4),
  );
  return out;
}

function sideWindow(xWall: number, z: [number, number], y: [number, number]): Shape[] {
  const inset = 0.05;
  return [
    poly([[xWall, y[0] - inset, z[0] - inset], [xWall, y[0] - inset, z[1] + inset], [xWall, y[1] + inset, z[1] + inset], [xWall, y[1] + inset, z[0] - inset]], C.white),
    poly([[xWall, y[0], z[0]], [xWall, y[0], z[1]], [xWall, y[1], z[1]], [xWall, y[1], z[0]]], "#cfe3ec"),
    poly([[xWall, y[0], z[0]], [xWall, y[0], z[1]], [xWall, y[0] + 0.25, z[1]], [xWall, y[0] + 0.3, z[0]]], "#a9c49f", { opacity: 0.8 }),
    line([xWall, y[0], (z[0] + z[1]) / 2], [xWall, y[1], (z[0] + z[1]) / 2], C.white, 5),
  ];
}

/* ---------- ambientes ---------- */

const roomInputs: RoomInput[] = [
  {
    id: "sala",
    label: "Sala de estar",
    dims: { width: 4.4, depth: 5.2, height: 2.8, near: 2.4 },
    paint: "#e8e1d3",
    ceiling: "#f5f2ec",
    wallSurfaces: ["back"],
    defaults: { floor: "porcelanato-polido-marmorizado", wall: null },
    build(ctx) {
      const { D } = ctx;
      const z = D - 0.002;
      const decor: Shape[] = [
        ...baseboards(ctx, "#f4efe6"),
        ...windowOnWall(z, [-1.75, -0.4], [0.95, 2.3]),
        // Cortina
        frontRect(z - 0.05, [-2.15, -1.82], [0.02, 2.55], "#e2d3b8"),
        ...[-2.07, -1.99, -1.9].map((x) => line([x, 0.05, z - 0.05], [x, 2.53, z - 0.05], "#cdbd9f", 2)),
        line([-2.2, 2.6, z - 0.05], [-0.25, 2.6, z - 0.05], C.charcoal, 3),
        // Quadro com as cores da marca
        frontRect(z, [0.55, 1.6], [1.3, 2.05], C.charcoal),
        frontRect(z, [0.6, 1.55], [1.35, 2.0], "#f7f3ea"),
        frontRect(z, [0.7, 1.05], [1.45, 1.9], C.greenDeep),
        blob([1.25, 1.62, z], 0.17, 0.17, "#f0b429"),
        frontRect(z, [1.1, 1.45], [1.43, 1.5], "#c6432a"),
      ];
      const sofaBase: Box = { x: [0.15, 2.05], y: [0.12, 0.45], z: [4.35, 5.15] };
      const table: Box = { x: [0.45, 1.45], y: [0.36, 0.41], z: [3.55, 4.05] };
      const plantInfo = plant({ x: [-2.08, -1.72], y: [0, 0.42], z: [4.55, 4.9] }, [-1.9, 0.95, 4.72], 1.05);
      const furniture: Shape[] = [
        ...plantInfo.shapes,
        ...legsUnder({ x: [0.2, 2.0], y: [0, 0], z: [4.4, 5.1] }, 0.12, 0.04, C.charcoal),
        ...box(sofaBase, C.green),
        ...box({ x: [0.15, 2.05], y: [0.45, 0.92], z: [4.92, 5.15] }, C.green),
        ...box({ x: [1.85, 2.05], y: [0.12, 0.66], z: [4.35, 5.15] }, shade(C.green, 0.04)),
        ...box({ x: [0.35, 1.1], y: [0.45, 0.58], z: [4.4, 4.92] }, shade(C.green, 0.08)),
        ...box({ x: [1.1, 1.85], y: [0.45, 0.58], z: [4.4, 4.92] }, shade(C.green, 0.08)),
        ...box({ x: [0.45, 0.82], y: [0.58, 0.86], z: [4.78, 4.9] }, C.mustard),
        ...box({ x: [1.45, 1.8], y: [0.58, 0.84], z: [4.78, 4.9] }, C.terracotta),
        ...box({ x: [0.15, 0.35], y: [0.12, 0.66], z: [4.35, 5.15] }, shade(C.green, 0.04)),
        ...legsUnder(table, 0.36, 0.035, C.charcoal),
        ...box(table, C.wood),
        ...box({ x: [0.6, 0.85], y: [0.41, 0.47], z: [3.7, 3.85] }, C.cream),
        blob([1.15, 0.5, 3.78], 0.06, 0.09, C.leaf[2]),
      ];
      return {
        decor,
        furniture,
        shadows: [floorShadow(sofaBase, 0.08, 0.34), floorShadow(table, 0.1, 0.18), plantInfo.shadow],
        sheen: [flatEllipse(-1.05, 0, 4.2, 1.1, 1.0, "#ffffff"), flatEllipse(1.1, 0, 3.2, 0.5, 0.35, "#ffffff")],
      };
    },
  },
  {
    id: "cozinha",
    label: "Cozinha",
    dims: { width: 4.0, depth: 4.8, height: 2.8, near: 2.4 },
    paint: "#ebe5d9",
    ceiling: "#f6f3ee",
    wallSurfaces: ["back"],
    defaults: { floor: "porcelanato-acetinado-areia", wall: "revestimento-metro-branco" },
    build(ctx) {
      const { W, D } = ctx;
      const z = D - 0.002;
      const counter: Box = { x: [-W, 0.95], y: [0.1, 0.86], z: [4.2, D] };
      const fridge: Box = { x: [1.18, W], y: [0, 1.95], z: [4.12, D] };
      const decor: Shape[] = [
        ...baseboards(ctx, "#efe9de"),
        ...sideWindow(-W, [3.0, 3.85], [1.05, 2.15]),
        // Prateleira com potes
        frontRect(z, [-0.35, 0.05], [1.62, 1.66], C.woodLight),
        ...box({ x: [-0.3, -0.22], y: [1.66, 1.8], z: [4.68, 4.76] }, C.terracotta),
        ...box({ x: [-0.15, -0.05], y: [1.66, 1.76], z: [4.68, 4.76] }, C.cream),
      ];
      const doors = [-1.45, -0.9, -0.35, 0.2].map((x) => line([x, 0.12, 4.2], [x, 0.84, 4.2], shade(C.greenDeep, -0.3), 1.5));
      const handles = [-1.62, -1.07, -0.52, 0.03, 0.58].map((x) => line([x, 0.76, 4.199], [x + 0.14, 0.76, 4.199], "#d9c9a0", 3));
      const furniture: Shape[] = [
        // Armários superiores e coifa
        ...box({ x: [-W, -0.55], y: [1.55, 2.25], z: [4.45, D] }, C.cream),
        ...[-1.45, -1.0].map((x) => line([x, 1.56, 4.45], [x, 2.24, 4.45], shade(C.cream, -0.18), 1.5)),
        ...box({ x: [0.28, 0.42], y: [2.1, 2.8], z: [4.62, 4.76] }, C.steel),
        ...box({ x: [0.08, 0.62], y: [1.7, 2.1], z: [4.5, D] }, C.steel),
        // Balcão
        ...box({ x: [-W, 0.95], y: [0, 0.1], z: [4.26, D] }, shade(C.greenDeep, -0.35)),
        ...box(counter, C.greenDeep),
        ...doors,
        ...handles,
        ...box({ x: [-W, 0.98], y: [0.86, 0.91], z: [4.16, D] }, "#e6e1d8", { top: "#efebe4" }),
        // Cuba e torneira
        poly([[-1.3, 0.911, 4.32], [-0.75, 0.911, 4.32], [-0.75, 0.911, 4.62], [-1.3, 0.911, 4.62]], "#9aa0a0"),
        line([-1.02, 0.91, 4.72], [-1.02, 1.18, 4.72], C.steel, 3),
        line([-1.02, 1.18, 4.72], [-1.02, 1.16, 4.55], C.steel, 3),
        // Cooktop
        poly([[0.12, 0.912, 4.3], [0.6, 0.912, 4.3], [0.6, 0.912, 4.66], [0.12, 0.912, 4.66]], "#1d1d1b"),
        flatEllipse(0.25, 0.913, 4.4, 0.06, 0.05, "#3a3a37"),
        flatEllipse(0.47, 0.913, 4.4, 0.06, 0.05, "#3a3a37"),
        flatEllipse(0.25, 0.913, 4.56, 0.05, 0.04, "#3a3a37"),
        flatEllipse(0.47, 0.913, 4.56, 0.05, 0.04, "#3a3a37"),
        // Geladeira
        ...box(fridge, C.steel),
        line([1.18, 1.25, 4.12], [W, 1.25, 4.12], "#9fa3a3", 2),
        line([1.26, 1.35, 4.119], [1.26, 1.75, 4.119], "#8e9292", 4),
        line([1.26, 0.6, 4.119], [1.26, 1.1, 4.119], "#8e9292", 4),
        // Pendente
        line([-0.55, 2.8, 3.55], [-0.55, 2.05, 3.55], C.charcoal, 1.5),
        poly([[-0.62, 2.05, 3.55], [-0.48, 2.05, 3.55], [-0.4, 1.88, 3.55], [-0.7, 1.88, 3.55]], C.charcoal),
        blob([-0.55, 1.87, 3.55], 0.14, 0.03, "#ffe7a6", 0.9),
      ];
      return {
        decor,
        furniture,
        shadows: [floorShadow({ x: [-W, 0.95], y: [0, 0], z: [4.24, D] }, 0.06, 0.3), floorShadow(fridge, 0.05, 0.3)],
        sheen: [flatEllipse(-1.1, 0, 3.4, 0.9, 0.7, "#ffffff"), flatEllipse(0.5, 0, 3.0, 0.6, 0.4, "#fff3d6")],
      };
    },
  },
  {
    id: "banheiro",
    label: "Banheiro",
    dims: { width: 2.6, depth: 4.2, height: 2.7, near: 1.6 },
    paint: "#ece7de",
    ceiling: "#f7f5f1",
    wallSurfaces: ["back", "left", "right"],
    defaults: { floor: "porcelanato-terrazzo", wall: "revestimento-acetinado-offwhite" },
    build({ D }) {
      const z = D - 0.002;
      const vanity: Box = { x: [-1.3, -0.2], y: [0.28, 0.8], z: [3.72, D] };
      const decor: Shape[] = [
        // Espelho
        frontRect(z, [-1.12, -0.38], [1.12, 2.06], "#c9d3d4", { rx: 0.06 }),
        frontRect(z, [-1.08, -0.42], [1.16, 2.02], "#dfe8ea", { rx: 0.05 }),
        poly([[-1.0, 1.9, z], [-0.85, 2.0, z], [-0.55, 1.3, z], [-0.7, 1.2, z]], "#ffffff", { opacity: 0.35 }),
        // Nicho do box
        frontRect(z, [0.55, 1.08], [1.15, 1.45], "#000000", { opacity: 0.13 }),
        frontRect(z, [0.55, 1.08], [1.41, 1.45], "#000000", { opacity: 0.1 }),
        ...box({ x: [0.62, 0.72], y: [1.15, 1.33], z: [4.1, 4.19] }, C.cream),
        ...box({ x: [0.78, 0.86], y: [1.15, 1.28], z: [4.1, 4.19] }, C.terracotta),
        // Chuveiro
        line([0.82, 2.25, z], [0.82, 2.05, 4.0], C.steel, 3),
        flatEllipse(0.82, 2.03, 3.98, 0.1, 0.1, "#9ea2a2"),
      ];
      const plantInfo = plant({ x: [-1.22, -1.08], y: [0.86, 1.0], z: [3.95, 4.08] }, [-1.15, 1.12, 4.0], 0.45, C.cream);
      const furniture: Shape[] = [
        ...box(vanity, C.wood),
        line([-0.75, 0.3, 3.72], [-0.75, 0.78, 3.72], shade(C.wood, -0.3), 1.5),
        line([-0.95, 0.72, 3.719], [-0.55, 0.72, 3.719], "#d9c9a0", 3),
        ...box({ x: [-1.32, -0.16], y: [0.8, 0.86], z: [3.68, D] }, C.white),
        flatEllipse(-0.75, 0.861, 3.95, 0.24, 0.16, "#d8dcdc"),
        flatEllipse(-0.75, 0.862, 3.95, 0.2, 0.13, "#eef0f0"),
        line([-0.75, 0.86, 4.14], [-0.75, 1.05, 4.14], C.steel, 3),
        line([-0.75, 1.05, 4.14], [-0.75, 1.04, 4.04], C.steel, 3),
        ...plantInfo.shapes,
        // Box de vidro
        poly([[0.3, 0, 3.3], [1.3, 0, 3.3], [1.3, 2.05, 3.3], [0.3, 2.05, 3.3]], "#e3f1f2", { opacity: 0.2, stroke: "#aeb8b8", strokeWidth: 2 }),
        line([0.3, 0, 3.3], [0.3, 2.05, 3.3], "#9aa3a3", 3),
        poly([[0.45, 1.8, 3.3], [0.6, 1.95, 3.3], [0.95, 0.9, 3.3], [0.8, 0.75, 3.3]], "#ffffff", { opacity: 0.18 }),
      ];
      return {
        decor,
        furniture,
        shadows: [floorShadow(vanity, 0.12, 0.2)],
        sheen: [flatEllipse(-0.2, 0, 2.6, 0.55, 0.45, "#ffffff"), flatEllipse(0.7, 0, 3.6, 0.35, 0.3, "#ffffff")],
      };
    },
  },
  {
    id: "externa",
    label: "Área externa",
    dims: { width: 5.0, depth: 6.0, height: 3.0, near: 2.4 },
    paint: "#e6ddcc",
    ceiling: "#c7a07a",
    wallSurfaces: ["back"],
    defaults: { floor: "externo-pedra-antiderrapante", wall: null },
    build({ W, D, H, near }) {
      const z = D - 0.002;
      const opening: Shape[] = [
        frontRect(z, [-2.25, 0.35], [0.95, 2.6], C.sky),
        blob([-1.86, 1.27, z], 0.33, 0.3, "#6f9a73"),
        blob([-1.25, 1.24, z], 0.38, 0.28, "#86ac85"),
        blob([-0.58, 1.32, z], 0.42, 0.36, "#5f8c66"),
        blob([0.02, 1.22, z], 0.3, 0.26, "#86ac85"),
        frontRect(z, [-2.25, 0.35], [0.95, 1.12], "#7ea27b"),
        // Guarda-corpo de vidro
        frontRect(z - 0.01, [-2.25, 0.35], [0.95, 1.95], "#e7f3f4", { opacity: 0.22 }),
        line([-2.25, 1.95, z - 0.01], [0.35, 1.95, z - 0.01], C.charcoal, 3),
        ...[-1.6, -0.95, -0.3].map((x) => line([x, 0.95, z - 0.01], [x, 1.95, z - 0.01], C.charcoal, 2)),
        frontRect(z, [-2.3, 0.4], [2.6, 2.66], C.charcoal),
        frontRect(z, [0.35, 0.4], [0.95, 2.66], C.charcoal),
      ];
      const slats: Shape[] = [];
      for (let x = -W + 0.2; x < W; x += 0.36) {
        slats.push(line([x, H - 0.001, near], [x, H - 0.001, D], "#8f6a47", 3));
      }
      const table: Box = { x: [-1.85, -0.35], y: [0.72, 0.77], z: [4.0, 4.75] };
      const bench: Box = { x: [-1.75, -0.45], y: [0.4, 0.45], z: [3.45, 3.7] };
      const bbq: Box = { x: [0.8, W], y: [0, 0.9], z: [5.35, D] };
      const planter: Box = { x: [-W, -2.1], y: [0, 0.5], z: [2.9, 4.6] };
      const leaves: Shape[] = [];
      for (let i = 0; i < 7; i++) {
        const lz = 3.0 + i * 0.24;
        leaves.push(blob([-2.3, 0.72 + (i % 3) * 0.08, lz], 0.22, 0.28, C.leaf[i % 4]));
      }
      const furniture: Shape[] = [
        // Churrasqueira
        ...box({ x: [1.5, 2.05], y: [2.1, H], z: [5.7, D] }, "#d7ccbb"),
        ...box({ x: [1.2, 2.35], y: [1.75, 2.1], z: [5.45, D] }, "#d7ccbb"),
        ...box({ x: [1.3, 2.25], y: [0.95, 1.75], z: [5.55, D] }, "#cfc2af"),
        frontRect(5.549, [1.42, 2.13], [1.02, 1.62], "#2a211c"),
        ...[1.55, 1.7, 1.85, 2.0].map((x) => line([x, 1.05, 5.548], [x, 1.2, 5.548], "#6b5446", 1.5)),
        ...box(bbq, "#cfc2af"),
        ...box({ x: [0.78, W], y: [0.9, 0.95], z: [5.3, D] }, "#3b3936"),
        // Floreira lateral
        ...box(planter, "#9c968c"),
        ...leaves,
        // Mesa e banco
        ...legsUnder(table, 0.72, 0.05, shade(C.wood, -0.2)),
        ...box(table, C.wood),
        ...legsUnder(bench, 0.4, 0.05, shade(C.wood, -0.2)),
        ...box(bench, C.woodLight),
      ];
      return {
        decor: opening,
        ceiling: slats,
        furniture,
        shadows: [floorShadow(table, 0.12, 0.18), floorShadow(bench, 0.06, 0.2), floorShadow(bbq, 0.06, 0.3), floorShadow(planter, 0.06, 0.28)],
        sheen: [flatEllipse(-0.9, 0, 4.9, 1.2, 0.9, "#ffffff")],
      };
    },
  },
];

function buildRoom(input: RoomInput): Room {
  const { width, depth, height, near } = input.dims;
  const W = width / 2;
  const D = depth;
  const H = height;
  const built = input.build({ W, D, H, near });
  return {
    id: input.id,
    label: input.label,
    dims: input.dims,
    paint: input.paint,
    ceiling: input.ceiling,
    wallSurfaces: input.wallSurfaces,
    defaults: input.defaults,
    planes: {
      floor: plane([[-W, 0, D], [W, 0, D], [W, 0, near], [-W, 0, near]], width, D - near),
      back: plane([[-W, H, D], [W, H, D], [W, 0, D], [-W, 0, D]], width, H),
      left: plane([[-W, H, near], [-W, H, D], [-W, 0, D], [-W, 0, near]], D - near, H),
      right: plane([[W, H, D], [W, H, near], [W, 0, near], [W, 0, D]], D - near, H),
    },
    layers: {
      ceiling: [
        poly([[-W, H, near], [W, H, near], [W, H, D], [-W, H, D]], input.ceiling),
        ...(built.ceiling ?? []),
      ],
      decor: built.decor,
      shadows: built.shadows,
      furniture: built.furniture,
    },
    sheen: built.sheen,
  };
}

export const rooms: Room[] = roomInputs.map(buildRoom);

export function getRoom(id: Environment) {
  return rooms.find((r) => r.id === id) ?? rooms[0];
}
