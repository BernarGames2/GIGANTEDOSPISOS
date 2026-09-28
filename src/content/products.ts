import type { TextureId } from "@/lib/textures";

/**
 * CATÁLOGO DEMONSTRATIVO.
 * Os itens abaixo são tipos genéricos de produto usados para demonstrar o
 * catálogo e o simulador. NÃO representam o estoque, as marcas ou os preços
 * reais da loja — substitua pelo mix real (idealmente vindo de uma planilha
 * ou de um CMS) antes de publicar.
 */

export type Environment = "sala" | "cozinha" | "banheiro" | "externa";
export type Category = "piso" | "revestimento" | "acabamento";
export type Surface = "floor" | "wall";
export type PriceTier = 1 | 2 | 3;

export interface Product {
  id: string;
  name: string;
  category: Category;
  environments: Environment[];
  /** Faixa de preço relativa (limites reais a definir com a loja). */
  priceTier: PriceTier;
  format: string;
  finish: string;
  unit: "m²" | "un." | "saco" | "kg";
  /** Textura repetível (pisos e revestimentos). */
  texture?: TextureId;
  /** Ilustrações (produto + aplicação) para itens sem textura. */
  illustration?: { src: string; hoverSrc: string };
  /** Superfícies em que o item pode ser visto no simulador. */
  simulate?: Surface[];
  /** 0 = fosco, 0.5 = acetinado, 1 = polido (reflexo no simulador). */
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

export const priceTierLabels: Record<PriceTier, { label: string; symbol: string; hint: string }> = {
  1: { label: "Econômica", symbol: "$", hint: "[definir faixa de preço]" },
  2: { label: "Intermediária", symbol: "$$", hint: "[definir faixa de preço]" },
  3: { label: "Premium", symbol: "$$$", hint: "[definir faixa de preço]" },
};

export const PRICE_PLACEHOLDER = "[preço]";
export const BRAND_PLACEHOLDER = "[marca]";

export const products: Product[] = [
  {
    id: "porcelanato-madeira-freijo",
    name: "Porcelanato efeito madeira",
    category: "piso",
    environments: ["sala", "cozinha"],
    priceTier: 2,
    format: "20 × 120 cm",
    finish: "Acetinado",
    unit: "m²",
    texture: "porcelanato-madeira-freijo",
    simulate: ["floor"],
    gloss: 0.3,
  },
  {
    id: "ladrilho-hidraulico",
    name: "Ladrilho hidráulico estampado",
    category: "piso",
    environments: ["cozinha", "banheiro", "externa"],
    priceTier: 3,
    format: "20 × 20 cm",
    finish: "Fosco",
    unit: "m²",
    texture: "ladrilho-hidraulico",
    simulate: ["floor", "wall"],
    gloss: 0,
  },
  {
    id: "revestimento-metro-verde",
    name: "Revestimento metrô verde",
    category: "revestimento",
    environments: ["cozinha", "banheiro"],
    priceTier: 2,
    format: "7,5 × 15 cm",
    finish: "Brilhante",
    unit: "m²",
    texture: "revestimento-metro-verde",
    simulate: ["wall"],
  },
  {
    id: "porcelanato-polido-marmorizado",
    name: "Porcelanato polido marmorizado",
    category: "piso",
    environments: ["sala"],
    priceTier: 3,
    format: "90 × 90 cm",
    finish: "Polido",
    unit: "m²",
    texture: "porcelanato-polido-marmorizado",
    simulate: ["floor"],
    gloss: 1,
  },
  {
    id: "porcelanato-terrazzo",
    name: "Porcelanato efeito granilite",
    category: "piso",
    environments: ["sala", "cozinha", "banheiro"],
    priceTier: 2,
    format: "60 × 60 cm",
    finish: "Acetinado",
    unit: "m²",
    texture: "porcelanato-terrazzo",
    simulate: ["floor"],
    gloss: 0.4,
  },
  {
    id: "revestimento-sextavado",
    name: "Revestimento sextavado",
    category: "revestimento",
    environments: ["banheiro", "cozinha"],
    priceTier: 2,
    format: "20 cm (hexagonal)",
    finish: "Acetinado",
    unit: "m²",
    texture: "revestimento-sextavado",
    simulate: ["wall", "floor"],
    gloss: 0.3,
  },
  {
    id: "externo-pedra-antiderrapante",
    name: "Porcelanato externo efeito pedra",
    category: "piso",
    environments: ["externa"],
    priceTier: 2,
    format: "60 × 60 cm",
    finish: "Antiderrapante",
    unit: "m²",
    texture: "externo-pedra-antiderrapante",
    simulate: ["floor"],
    gloss: 0,
  },
  {
    id: "rodape-poliestireno",
    name: "Rodapé em poliestireno",
    category: "acabamento",
    environments: ["sala"],
    priceTier: 1,
    format: "10 cm de altura",
    finish: "Branco",
    unit: "un.",
    illustration: { src: "/ilustracoes/rodape.svg", hoverSrc: "/ilustracoes/rodape-aplicado.svg" },
  },
  {
    id: "porcelanato-acetinado-areia",
    name: "Porcelanato acetinado areia",
    category: "piso",
    environments: ["sala", "cozinha", "banheiro"],
    priceTier: 2,
    format: "60 × 60 cm",
    finish: "Acetinado",
    unit: "m²",
    texture: "porcelanato-acetinado-areia",
    simulate: ["floor"],
    gloss: 0.45,
  },
  {
    id: "revestimento-metro-branco",
    name: "Revestimento metrô branco",
    category: "revestimento",
    environments: ["cozinha", "banheiro"],
    priceTier: 1,
    format: "7,5 × 15 cm",
    finish: "Brilhante",
    unit: "m²",
    texture: "revestimento-metro-branco",
    simulate: ["wall"],
  },
  {
    id: "porcelanato-cimento-grafite",
    name: "Porcelanato efeito cimento",
    category: "piso",
    environments: ["sala", "cozinha"],
    priceTier: 3,
    format: "120 × 120 cm",
    finish: "Acetinado",
    unit: "m²",
    texture: "porcelanato-cimento-grafite",
    simulate: ["floor"],
    gloss: 0.35,
  },
  {
    id: "externo-deck-madeira",
    name: "Porcelanato externo efeito deck",
    category: "piso",
    environments: ["externa"],
    priceTier: 2,
    format: "20 × 120 cm",
    finish: "Antiderrapante",
    unit: "m²",
    texture: "externo-deck-madeira",
    simulate: ["floor"],
    gloss: 0,
  },
  {
    id: "rejunte-flexivel",
    name: "Rejunte flexível",
    category: "acabamento",
    environments: ["sala", "cozinha", "banheiro", "externa"],
    priceTier: 1,
    format: "Embalagem de [x] kg",
    finish: "Várias cores",
    unit: "kg",
    illustration: { src: "/ilustracoes/rejunte.svg", hoverSrc: "/ilustracoes/rejunte-aplicado.svg" },
  },
  {
    id: "vinilico-carvalho-claro",
    name: "Piso vinílico em régua",
    category: "piso",
    environments: ["sala"],
    priceTier: 2,
    format: "18 × 122 cm",
    finish: "Fosco texturizado",
    unit: "m²",
    texture: "vinilico-carvalho-claro",
    simulate: ["floor"],
    gloss: 0.1,
  },
  {
    id: "revestimento-marmorizado-parede",
    name: "Revestimento marmorizado",
    category: "revestimento",
    environments: ["banheiro", "sala"],
    priceTier: 2,
    format: "30 × 60 cm",
    finish: "Brilhante",
    unit: "m²",
    texture: "revestimento-marmorizado-parede",
    simulate: ["wall"],
  },
  {
    id: "ceramica-esmaltada-cinza",
    name: "Piso cerâmico esmaltado",
    category: "piso",
    environments: ["cozinha", "sala"],
    priceTier: 1,
    format: "45 × 45 cm",
    finish: "Acetinado",
    unit: "m²",
    texture: "ceramica-esmaltada-cinza",
    simulate: ["floor"],
    gloss: 0.4,
  },
  {
    id: "argamassa-ac3",
    name: "Argamassa colante AC-III",
    category: "acabamento",
    environments: ["sala", "cozinha", "banheiro", "externa"],
    priceTier: 1,
    format: "Saco de [x] kg",
    finish: "Uso interno e externo",
    unit: "saco",
    illustration: { src: "/ilustracoes/argamassa.svg", hoverSrc: "/ilustracoes/argamassa-aplicada.svg" },
  },
  {
    id: "revestimento-acetinado-offwhite",
    name: "Revestimento acetinado off-white",
    category: "revestimento",
    environments: ["banheiro", "cozinha", "sala"],
    priceTier: 1,
    format: "30 × 90 cm",
    finish: "Acetinado",
    unit: "m²",
    texture: "revestimento-acetinado-offwhite",
    simulate: ["wall"],
  },
  {
    id: "revestimento-filete-pedra",
    name: "Filete de pedra natural",
    category: "revestimento",
    environments: ["externa", "sala"],
    priceTier: 2,
    format: "Placas de [medida]",
    finish: "Natural",
    unit: "m²",
    texture: "revestimento-filete-pedra",
    simulate: ["wall"],
  },
  {
    id: "soleira-granito",
    name: "Soleira em granito",
    category: "acabamento",
    environments: ["sala", "cozinha", "banheiro"],
    priceTier: 2,
    format: "Sob medida",
    finish: "Polido",
    unit: "un.",
    texture: "soleira-granito",
  },
  {
    id: "perfil-aluminio",
    name: "Perfil de acabamento em alumínio",
    category: "acabamento",
    environments: ["banheiro", "cozinha"],
    priceTier: 1,
    format: "Barra de [x] m",
    finish: "Alumínio",
    unit: "un.",
    illustration: { src: "/ilustracoes/perfil.svg", hoverSrc: "/ilustracoes/perfil-aplicado.svg" },
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
