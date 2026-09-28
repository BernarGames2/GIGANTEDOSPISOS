/**
 * Dados da loja — fonte única de verdade do site.
 *
 * Dados REAIS confirmados: nome, segmento, cidade, telefone, Instagram,
 * seguidores, 22 anos, nota 4,8 com ~1.280 avaliações e showroom 2025.
 * Tudo marcado com "EXEMPLO" abaixo é valor ilustrativo para a demonstração
 * e está listado em CONTEUDO-PENDENTE.md — substituir antes de publicar.
 */

const yearsInBusiness = 22;

export const site = {
  name: "Gigante dos Pisos",
  tagline: "Do básico ao acabamento",
  description:
    `Pisos, revestimentos, materiais de construção e acabamento em Uberlândia (MG) há ${yearsInBusiness} anos. Simule o piso no seu ambiente e peça orçamento pelo WhatsApp.`,

  /**
   * Enquanto o conteúdo de exemplo não for substituído, a página fica fora do
   * Google (noindex). Isso não aparece na interface. Mudar para `true` na
   * publicação oficial.
   */
  indexable: false,

  /** URL pública definitiva. Pode ser sobrescrita por NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gigantedospisos.com.br",

  city: "Uberlândia",
  state: "MG",
  yearsInBusiness,
  showroomRenovatedIn: 2025,

  phone: {
    display: "(34) 3212-8454",
    href: "tel:+553432128454",
  },

  whatsapp: {
    /** EXEMPLO: usa o telefone fixo até a loja confirmar o número de WhatsApp. */
    number: "553432128454",
    display: "(34) 3212-8454",
    defaultMessage: "Olá! Vim pelo site da Gigante dos Pisos e gostaria de um orçamento.",
  },

  instagram: {
    handle: "@gigantedospisoss",
    url: "https://www.instagram.com/gigantedospisoss/",
    followers: "23,1", // em milhares
    followersLabel: "23,1 mil",
  },

  /** Outras redes: preencher apenas com perfis REAIS da loja. */
  otherSocials: [] as { name: string; url: string }[],

  /**
   * Números da loja — usados em TODO o site (hero, "A loja", avaliações,
   * metadados). Nunca repetir esses valores à mão nos componentes.
   */
  google: {
    rating: 4.8,
    ratingLabel: "4,8",
    reviewCount: 1280, // aproximado
    reviewCountLabel: "cerca de 1.280 avaliações",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gigante%20dos%20Pisos%20Uberl%C3%A2ndia%20MG",
    mapsEmbedUrl:
      "https://www.google.com/maps?q=Gigante%20dos%20Pisos%2C%20Uberl%C3%A2ndia%20-%20MG&output=embed",
  },

  /** Endereço completo ainda não confirmado: o site mostra só a cidade. */
  address: {
    street: null as string | null,
    cityLine: "Uberlândia – MG",
  },

  /** EXEMPLO: horário típico do comércio de materiais — confirmar com a loja. */
  hours: [
    { days: "Segunda a sexta", time: "7h30 às 18h" },
    { days: "Sábado", time: "7h30 às 12h" },
    { days: "Domingo e feriados", time: "Fechado" },
  ],

  /** Fotos reais (quando existirem) substituem as imagens renderizadas. */
  images: {
    showroom: null as string | null, // ex.: "/fotos/showroom-2025.jpg"
    /**
     * Logo usada no cabeçalho, rodapé e compartilhamento. Hoje: recriação em
     * vetor feita a partir da descrição da marca (ver CONTEUDO-PENDENTE.md).
     * Para usar o arquivo oficial, salve-o em public/marca/ e troque o caminho
     * e as proporções abaixo (ex.: "/marca/logo1.png", 400 × 244).
     */
    logo: { src: "/marca/logo-gigante-dos-pisos.svg", width: 400, height: 244 },
  },
} as const;

export const navLinks = [
  { href: "#simulador", label: "Simulador" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#diferenciais", label: "A loja" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
] as const;
