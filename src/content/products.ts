import type { TextureId } from "@/lib/textures";
import produtos from "./produtos.json";

/**
 * CATÁLOGO — editado pela loja em planilha/produtos.xlsx.
 * Hoje: tipos genéricos de produto com PREÇOS DE EXEMPLO (plausíveis para o
 * mercado, não da loja). Substituir pelo mix real na planilha antes de
 * publicar. Lista completa em CONTEUDO-PENDENTE.md.
 */

export type Environment = "sala" | "cozinha" | "banheiro" | "externa";
export type Category = "piso" | "revestimento" | "acabamento";
export type Surface = "floor" | "wall";
export type PriceRange = "ate-60" | "60-120" | "acima-120";

export interface Product {
  id: string;
  name: string;
  category: Category;
  environments: Environment[];
  format: string;
  finish: string;
  /** EXEMPLO — preço "a partir de" por unidade de venda. */
  price: number;
  unit: "m²" | "barra" | "kg" | "saco" | "peça";
  texture?: TextureId;
  /** Imagem do card quando não há textura (foto do produto ou ilustração). */
  illustration?: { src: string; hoverSrc?: string };
  simulate?: Surface[];
  /** 0 = fosco, 0,5 = acetinado, 1 = polido (reflexo no simulador). */
  gloss?: number;
}

export const environmentLabels: Record<Environment, string> = {
  sala: "Sala",
  cozinha: "Cozinha",
  banheiro: "Banheiro",
  externa: "Área externa",
};

export const categoryLabels: Record<Category, string> = {
  piso: "Pisos",
  revestimento: "Revestimentos",
  acabamento: "Acabamentos",
};

export const categorySingular: Record<Category, string> = {
  piso: "Piso",
  revestimento: "Revestimento",
  acabamento: "Acabamento",
};

export const priceRanges: { id: PriceRange; label: string; test: (p: number) => boolean }[] = [
  { id: "ate-60", label: "Até R$ 60", test: (p) => p <= 60 },
  { id: "60-120", label: "R$ 60 a 120", test: (p) => p > 60 && p <= 120 },
  { id: "acima-120", label: "Acima de R$ 120", test: (p) => p > 120 },
];

export const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Produtos vêm da planilha planilha/produtos.xlsx, convertida por
 * `npm run planilha` (roda sozinho antes do build). Não edite o JSON à mão.
 */
export const products: Product[] = produtos as Product[];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
