/**
 * Dados da loja — fonte única de verdade do site.
 *
 * REGRA: só entram aqui dados CONFIRMADOS. Tudo o que ainda não foi confirmado
 * pela loja fica entre [colchetes] e aparece destacado no site (ver
 * <Placeholder /> e renderWithPlaceholders). Ao receber o dado real, basta
 * trocar o texto — o destaque some sozinho.
 */

export const site = {
  name: "Gigante dos Pisos",
  tagline: "Do básico ao acabamento",
  description:
    "Pisos, revestimentos e materiais de acabamento em Uberlândia (MG) há 22 anos. Showroom reformado em 2025.",

  /**
   * Modo apresentação: mostra a faixa "proposta" no topo e marca a página como
   * noindex (para que a versão com placeholders não seja indexada pelo Google).
   * Desligue quando o site for publicado oficialmente.
   */
  pitchMode: true,

  /** URL pública definitiva. Pode ser sobrescrita por NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gigantedospisos.com.br",

  city: "Uberlândia",
  state: "MG",
  yearsInBusiness: 22,
  showroomRenovatedIn: 2025,

  phone: {
    display: "(34) 3212-8454",
    href: "tel:+553432128454",
  },

  whatsapp: {
    /**
     * [CONFIRMAR] Número de WhatsApp da loja. Provisoriamente usa o telefone
     * fixo — confirme se ele é WhatsApp Business ou troque pelo número correto
     * (formato: 55 + DDD + número, só dígitos).
     */
    number: "553432128454",
    display: "[confirmar número do WhatsApp]",
    defaultMessage: "Olá! Vim pelo site da Gigante dos Pisos e gostaria de um orçamento.",
  },

  instagram: {
    handle: "@gigantedospisoss",
    url: "https://www.instagram.com/gigantedospisoss/",
    followers: 23.1, // em milhares
    followersLabel: "23,1 mil",
  },

  /** Outras redes: preencher apenas com perfis REAIS da loja. */
  otherSocials: [] as { name: string; url: string }[],

  google: {
    rating: 4.8,
    reviewCount: 1280, // aproximado
    /** Busca no Google Maps pelo nome da loja (substituir pelo link direto da ficha, se preferir). */
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gigante%20dos%20Pisos%20Uberl%C3%A2ndia%20MG",
    /** Embed sem chave de API, baseado em busca. Trocar pelo embed oficial da ficha quando disponível. */
    mapsEmbedUrl:
      "https://www.google.com/maps?q=Gigante%20dos%20Pisos%2C%20Uberl%C3%A2ndia%20-%20MG&output=embed",
  },

  address: {
    street: "[endereço completo — rua, número e bairro]",
    cityLine: "Uberlândia – MG",
    zip: "[CEP]",
  },

  hours: [
    { days: "Segunda a sexta", time: "[horário]" },
    { days: "Sábado", time: "[horário]" },
    { days: "Domingo e feriados", time: "[confirmar]" },
  ],

  legal: {
    companyName: "[razão social]",
    cnpj: "[CNPJ]",
  },

  /**
   * Imagens reais. Enquanto forem `null`, o site mostra placeholders
   * identificados. Coloque os arquivos em /public/fotos e informe o caminho.
   */
  images: {
    showroom: null as string | null, // ex.: "/fotos/showroom-2025.jpg"
    logo: null as string | null, // ex.: "/marca/logo.svg"
    mascot: null as string | null, // ex.: "/marca/mascote.png"
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
