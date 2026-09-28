/**
 * Perguntas frequentes. As respostas marcadas como EXEMPLO descrevem práticas
 * comuns do setor e precisam ser confirmadas pela loja (ver CONTEUDO-PENDENTE.md).
 */
export const faq: { question: string; answer: string[] }[] = [
  {
    // EXEMPLO: área atendida e forma de cálculo do frete
    question: "Vocês fazem entrega?",
    answer: [
      "Sim. A entrega faz parte do atendimento: levamos o material até a obra em Uberlândia e região.",
      "O frete e a data de entrega são combinados no orçamento, conforme o endereço e o volume do pedido.",
    ],
  },
  {
    // EXEMPLO: prazos
    question: "Qual é o prazo de entrega?",
    answer: [
      "Itens em estoque costumam sair em poucos dias úteis. Produtos sob encomenda dependem do prazo do fabricante — a equipe informa a previsão antes de você fechar o pedido.",
    ],
  },
  {
    // EXEMPLO: modelo do serviço de instalação
    question: "Vocês fazem a instalação?",
    answer: [
      "Sim. A instalação pode ser contratada junto com o material, com medição do ambiente e orçamento completo — material e mão de obra no mesmo lugar.",
    ],
  },
  {
    // EXEMPLO: formas de pagamento
    question: "Quais são as formas de pagamento?",
    answer: [
      "Pix, cartões de débito e crédito — com parcelamento — e boleto para empresas. As condições de cada pedido são informadas no orçamento.",
    ],
  },
  {
    question: "Como calculo quanto piso preciso comprar?",
    answer: [
      "Multiplique o comprimento pela largura de cada cômodo para ter a área em m². Depois, some uma margem para recortes e quebras: a referência usual do mercado é de cerca de 10%, e um pouco mais em paginações na diagonal ou com peças grandes.",
      "Se preferir, envie as medidas pelo WhatsApp junto com o pedido de orçamento.",
    ],
  },
  {
    question: "Posso ver os produtos pessoalmente?",
    answer: [
      "Pode, sim. O showroom foi reformado em 2025 e é o melhor lugar para ver as peças em tamanho real, comparar acabamentos e tirar dúvidas com a equipe.",
    ],
  },
  {
    // EXEMPLO: política de troca
    question: "Vocês trocam ou devolvem produtos?",
    answer: [
      "Produtos em perfeito estado, na embalagem original e com nota fiscal podem ser trocados dentro do prazo informado na compra.",
      "Dica: compre toda a metragem do mesmo lote, já com a sobra de segurança, para evitar diferença de tonalidade entre caixas.",
    ],
  },
  {
    question: "O simulador mostra exatamente o produto?",
    answer: [
      "Ele é uma referência para comparar estilos: cor, brilho e textura variam conforme a tela e a iluminação. Antes de fechar, confira a peça no showroom.",
    ],
  },
];
