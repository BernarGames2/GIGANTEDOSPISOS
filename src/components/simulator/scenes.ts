/**
 * Ambientes do simulador: renders 3D gerados por render/run.mjs (ver
 * render/scene.js). São imagens de referência de alta qualidade — não são
 * fotos da loja. Podem ser trocados por fotos reais com as mesmas camadas
 * (máscaras de piso/parede, sombreamento e reflexo).
 */
import ambientes from "@/content/ambientes.json";
import type { Environment } from "@/content/products";
import type { Quad } from "./geometry";

export type WallId = "back" | "left" | "right";
export type PlaneId = "floor" | WallId;

export interface ScenePlane {
  widthCm: number;
  heightCm: number;
  /** background-position da textura (alinha as peças ao canto/rodapé). */
  align: string;
  quad: Quad;
}

export interface SceneData {
  width: number;
  height: number;
  wallSurfaces: WallId[];
  planes: Record<PlaneId, ScenePlane>;
}

export const scenes = ambientes as unknown as Record<Environment, SceneData>;

export const sceneInfo: { id: Environment; label: string; defaults: { floor: string; wall: string | null } }[] = [
  { id: "sala", label: "Sala de estar", defaults: { floor: "porcelanato-polido-marmorizado", wall: null } },
  { id: "cozinha", label: "Cozinha", defaults: { floor: "porcelanato-acetinado-areia", wall: "revestimento-metro-branco" } },
  { id: "banheiro", label: "Banheiro", defaults: { floor: "porcelanato-terrazzo", wall: "revestimento-acetinado-offwhite" } },
  { id: "externa", label: "Área externa", defaults: { floor: "externo-deck-madeira", wall: null } },
];

export type LayerName = "beauty" | "fg" | "floor-mask" | "wall-mask" | "shade" | "light" | "refl" | "refl-soft";

export const sceneAsset = (room: Environment, layer: LayerName | "thumb", small = false) =>
  `/ambientes/${room}/${layer}${small && layer !== "thumb" ? "-sm" : ""}.webp`;
