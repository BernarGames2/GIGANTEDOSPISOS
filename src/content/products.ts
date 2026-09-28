import type { TextureId } from "@/lib/textures";

/**
 * CATÁLOGO DE DEMONSTRAÇÃO.
 * Tipos genéricos de produto com PREÇOS DE EXEMPLO (plausíveis para o
 * mercado, não da loja). Substituir pelo mix real — nomes, formatos, fotos
 * e preços — antes de publicar. Lista completa em CONTEUDO-PENDENTE.md.
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
  illustration?: { src: string; hoverSrc: string };
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

export const products: Product[] = [
  {
    id: "porcelanato-madeira-freijo",
    name: "Porcelanato efeito madeira",
    category: "piso",
    environments: ["sala", "cozinha"],
    format: "20 × 120 cm",
    finish: "Acetinado",
    price: 79.9,
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
    format: "20 × 20 cm",
    finish: "Fosco",
    price: 189.9,
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
    format: "7,5 × 15 cm",
    finish: "Brilhante",
    price: 69.9,
    unit: "m²",
    texture: "revestimento-metro-verde",
    simulate: ["wall"],
  },
  {
    id: "porcelanato-polido-marmorizado",
    name: "Porcelanato polido marmorizado",
    category: "piso",
    environments: ["sala"],
    format: "90 × 90 cm",
    finish: "Polido",
    price: 129.9,
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
    format: "60 × 60 cm",
    finish: "Acetinado",
    price: 89.9,
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
    format: "20 cm (hexagonal)",
    finish: "Acetinado",
    price: 94.9,
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
    format: "60 × 60 cm",
    finish: "Antiderrapante",
    price: 64.9,
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
    format: "10 cm × 2,40 m",
    finish: "Branco",
    price: 24.9,
    unit: "barra",
    illustration: { src: "/ilustracoes/rodape.svg", hoverSrc: "/ilustracoes/rodape-aplicado.svg" },
  },
  {
    id: "porcelanato-acetinado-areia",
    name: "Porcelanato acetinado areia",
    category: "piso",
    environments: ["sala", "cozinha", "banheiro"],
    format: "60 × 60 cm",
    finish: "Acetinado",
    price: 59.9,
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
    format: "7,5 × 15 cm",
    finish: "Brilhante",
    price: 49.9,
    unit: "m²",
    texture: "revestimento-metro-branco",
    simulate: ["wall"],
  },
  {
    id: "porcelanato-cimento-grafite",
    name: "Porcelanato efeito cimento",
    category: "piso",
    environments: ["sala", "cozinha"],
    format: "120 × 120 cm",
    finish: "Acetinado",
    price: 149.9,
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
    format: "20 × 120 cm",
    finish: "Antiderrapante",
    price: 84.9,
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
    format: "Embalagem de 1 kg",
    finish: "Várias cores",
    price: 18.9,
    unit: "kg",
    illustration: { src: "/ilustracoes/rejunte.svg", hoverSrc: "/ilustracoes/rejunte-aplicado.svg" },
  },
  {
    id: "vinilico-carvalho-claro",
    name: "Piso vinílico em régua",
    category: "piso",
    environments: ["sala"],
    format: "18 × 122 cm",
    finish: "Fosco texturizado",
    price: 99.9,
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
    format: "30 × 60 cm",
    finish: "Brilhante",
    price: 54.9,
    unit: "m²",
    texture: "revestimento-marmorizado-parede",
    simulate: ["wall"],
  },
  {
    id: "ceramica-esmaltada-cinza",
    name: "Piso cerâmico esmaltado",
    category: "piso",
    environments: ["cozinha", "sala"],
    format: "45 × 45 cm",
    finish: "Acetinado",
    price: 29.9,
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
    format: "Saco de 20 kg",
    finish: "Uso interno e externo",
    price: 34.9,
    unit: "saco",
    illustration: { src: "/ilustracoes/argamassa.svg", hoverSrc: "/ilustracoes/argamassa-aplicada.svg" },
  },
  {
    id: "revestimento-acetinado-offwhite",
    name: "Revestimento acetinado off-white",
    category: "revestimento",
    environments: ["banheiro", "cozinha", "sala"],
    format: "30 × 90 cm",
    finish: "Acetinado",
    price: 44.9,
    unit: "m²",
    texture: "revestimento-acetinado-offwhite",
    simulate: ["wall"],
  },
  {
    id: "revestimento-filete-pedra",
    name: "Filete de pedra natural",
    category: "revestimento",
    environments: ["externa", "sala"],
    format: "Placas de 15 × 60 cm",
    finish: "Natural",
    price: 119.9,
    unit: "m²",
    texture: "revestimento-filete-pedra",
    simulate: ["wall"],
  },
  {
    id: "soleira-granito",
    name: "Soleira em granito",
    category: "acabamento",
    environments: ["sala", "cozinha", "banheiro"],
    format: "Sob medida",
    finish: "Polido",
    price: 89.9,
    unit: "peça",
    texture: "soleira-granito",
  },
  {
    id: "perfil-aluminio",
    name: "Perfil de acabamento em alumínio",
    category: "acabamento",
    environments: ["banheiro", "cozinha"],
    format: "Barra de 2,50 m",
    finish: "Alumínio",
    price: 29.9,
    unit: "barra",
    illustration: { src: "/ilustracoes/perfil.svg", hoverSrc: "/ilustracoes/perfil-aplicado.svg" },
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
