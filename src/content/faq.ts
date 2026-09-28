/**
 * Perguntas frequentes. Respostas com [colchetes] dependem de confirmação da
 * loja — não publicar prazos, taxas ou condições que não foram confirmados.
 */
export const faq: { question: string; answer: string[] }[] = [
  {
    question: "Vocês fazem entrega?",
    answer: [
      "Sim, a entrega faz parte do atendimento da loja.",
      "[Informar a área atendida — ex.: Uberlândia e região — e como o frete é calculado.]",
    ],
  },
  {
    question: "Qual é o prazo de entrega?",
    answer: [
      "[Informar o prazo médio para itens em estoque e para itens sob encomenda.]",
      "Na hora do orçamento a equipe confirma a disponibilidade de cada produto.",
    ],
  },
  {
    question: "Vocês fazem a instalação?",
    answer: [
      "Sim, a instalação pode ser combinada junto com a compra do material.",
      "[Confirmar se o serviço é feito por equipe própria ou por profissionais parceiros, e como é orçado.]",
    ],
  },
  {
    question: "Quais são as formas de pagamento?",
    answer: [
      "[Listar as formas aceitas — ex.: Pix, cartão de débito e crédito, boleto — e as condições de parcelamento.]",
    ],
  },
  {
    question: "Como calculo quanto piso preciso comprar?",
    answer: [
      "Multiplique o comprimento pela largura de cada cômodo para chegar à área em m². Em seguida, some uma margem para recortes e quebras — a referência usual do mercado é de cerca de 10%, e mais em paginações na diagonal ou em peças grandes.",
      "Se preferir, envie as medidas pelo WhatsApp junto com o pedido de orçamento.",
    ],
  },
  {
    question: "Posso ver os produtos pessoalmente?",
    answer: [
      "Pode, sim. O showroom foi reformado em 2025 e é o melhor lugar para ver as peças em tamanho real antes de decidir.",
      "Endereço: [endereço completo]. Horário: [horário de funcionamento].",
    ],
  },
  {
    question: "Vocês trocam ou devolvem produtos?",
    answer: [
      "[Informar a política de troca e devolução — prazo, estado das peças e necessidade de nota fiscal.]",
      "Dica: compre toda a metragem do mesmo lote, com a sobra de segurança, para evitar diferença de tonalidade entre caixas.",
    ],
  },
  {
    question: "O simulador mostra exatamente o produto?",
    answer: [
      "Não exatamente. O simulador é uma referência visual para comparar estilos: cores, brilho e textura variam conforme a tela e a iluminação. Antes de fechar, confira a peça no showroom.",
    ],
  },
];
