# Conteúdo pendente — confirmar com a loja antes de publicar

A interface do site não mostra nenhum placeholder: onde ainda não há dado real,
foi usado um **valor de exemplo plausível** ou o item foi **omitido**. Esta lista
reúne tudo o que precisa ser confirmado ou substituído pela Gigante dos Pisos.

> Enquanto houver itens em aberto, o site fica **fora do Google** (`noindex` e
> `robots.txt` bloqueado — invisível para quem navega). Na publicação oficial,
> mude `indexable` para `true` em `src/content/site.ts`.

## Dados já reais (não mexer)

Nome, segmento ("do básico ao acabamento"), Uberlândia – MG, telefone
(34) 3212-8454, showroom reformado em 2025 e paleta verde/dourado/vermelho.

**Números da loja — iguais em todo o site** (hero, "A loja", avaliações,
imagem de compartilhamento). Ficam só em `src/content/site.ts`; nunca
digitá-los direto nos componentes:

| Dado | Valor |
| --- | --- |
| Tempo de mercado | 22 anos em Uberlândia (`yearsInBusiness`) |
| Instagram | 23,1 mil seguidores, @gigantedospisoss (`instagram`) |
| Google | nota 4,8 com cerca de 1.280 avaliações (`google`) |

Ao atualizar algum número, rode `npm run og` para refazer a imagem de
compartilhamento.

## 1. Valores de EXEMPLO visíveis no site

| Item | Onde aparece | Valor de exemplo | Arquivo |
| --- | --- | --- | --- |
| **Preços** de todos os produtos ("a partir de R$ …") | Catálogo e simulador | R$ 18,90 a R$ 189,90 (ver tabela abaixo) | `src/content/products.ts` |
| **Faixas de preço** do filtro | Catálogo | Até R$ 60 / R$ 60 a 120 / acima de R$ 120 | `src/content/products.ts` (`priceRanges`) |
| **Produtos** (nomes genéricos, formatos, acabamentos) | Catálogo e simulador | 21 tipos de produto | `src/content/products.ts` |
| **Texturas/fotos dos produtos** | Catálogo e simulador | Texturas geradas por script | `src/content/textures.json`, `public/texturas/` |
| **Horário de funcionamento** | Contato | Seg–sex 7h30–18h · Sáb 7h30–12h · Dom. fechado | `src/content/site.ts` (`hours`) |
| **Número de WhatsApp** | Botões de WhatsApp | Usa o fixo (34) 3212-8454 — confirmar se é WhatsApp Business | `src/content/site.ts` (`whatsapp`) |
| **Entrega** (área atendida, frete, prazos) | FAQ e "A loja" | "Uberlândia e região; frete e data combinados no orçamento" | `src/content/faq.ts`, `src/components/sections/Highlights.tsx` |
| **Instalação** (própria ou parceiros, medição) | FAQ e "A loja" | "Instalação contratada junto com o material, com medição" | idem |
| **Formas de pagamento** | FAQ | Pix, cartões com parcelamento, boleto para empresas | `src/content/faq.ts` |
| **Política de troca** | FAQ | Produto em perfeito estado, embalagem original e nota fiscal | `src/content/faq.ts` |
| **Mapa** | Contato | Mapa ilustrativo (com o selo "Mapa ilustrativo") e o botão "Como chegar", que busca "Gigante dos Pisos Uberlândia MG" no Google Maps | `src/content/site.ts` (`address.street`) — com o endereço preenchido, aparece "Ver mapa aqui", que carrega o mapa real do Google |

### Preços de exemplo por produto

| Produto | Exemplo |
| --- | --- |
| Piso cerâmico esmaltado 45×45 | R$ 29,90/m² |
| Porcelanato acetinado areia 60×60 | R$ 59,90/m² |
| Porcelanato externo efeito pedra 60×60 | R$ 64,90/m² |
| Porcelanato efeito madeira 20×120 | R$ 79,90/m² |
| Porcelanato externo efeito deck 20×120 | R$ 84,90/m² |
| Porcelanato efeito granilite 60×60 | R$ 89,90/m² |
| Piso vinílico em régua | R$ 99,90/m² |
| Porcelanato polido marmorizado 90×90 | R$ 129,90/m² |
| Porcelanato efeito cimento 120×120 | R$ 149,90/m² |
| Ladrilho hidráulico 20×20 | R$ 189,90/m² |
| Revestimento acetinado off-white 30×90 | R$ 44,90/m² |
| Revestimento metrô branco 7,5×15 | R$ 49,90/m² |
| Revestimento marmorizado 30×60 | R$ 54,90/m² |
| Revestimento metrô verde 7,5×15 | R$ 69,90/m² |
| Revestimento sextavado 20 cm | R$ 94,90/m² |
| Filete de pedra natural | R$ 119,90/m² |
| Rejunte flexível 1 kg | R$ 18,90/kg |
| Rodapé em poliestireno 10 cm × 2,40 m | R$ 24,90/barra |
| Perfil de alumínio 2,50 m | R$ 29,90/barra |
| Argamassa AC-III 20 kg | R$ 34,90/saco |
| Soleira em granito (sob medida) | R$ 89,90/peça |

## 2. Itens OMITIDOS até haver dado real

| Item | Situação atual | Como incluir |
| --- | --- | --- |
| **Endereço completo e CEP** | O site mostra só "Uberlândia – MG" | Preencher `site.address.street` |
| **Razão social e CNPJ** | Não aparecem no rodapé | Adicionar ao rodapé (`src/components/layout/Footer.tsx`) |
| **Depoimentos de clientes** | A seção de avaliações mostra só a nota agregada (4,8 · cerca de 1.280 avaliações). Não foi possível buscar avaliações do Google neste ambiente, e nenhum depoimento foi escrito à mão | Configurar `GOOGLE_PLACES_API_KEY` e `GOOGLE_PLACE_ID` (ver README): aparecem até 3 avaliações reais de 4–5 estrelas, com autor e link, sem edição |
| **Fotos de obras entregues** | Não aparecem | Fotos reais autorizadas pelos clientes |
| **Outras redes sociais** | Só o Instagram | `site.otherSocials` |

## 3. Imagens que NÃO são da loja

| Imagem | O que é | Substituir por |
| --- | --- | --- |
| Hero (sala e cozinha) | Renders 3D feitos para a demonstração, com produtos do catálogo aplicados. Levam o selo **"Imagem ilustrativa"** | Fotos reais do showroom reformado (`site.images.showroom`) — o selo some sozinho |
| Ambientes do simulador | Renders 3D com mobília genérica (`public/ambientes/`). Levam o selo **"Ambiente ilustrativo"** e um aviso logo abaixo | Podem continuar como referência; opcionalmente, fotos reais com as mesmas máscaras |
| **Logo** (cabeçalho, rodapé, compartilhamento) | **Recriação em vetor** (`public/marca/logo-gigante-dos-pisos.svg`) feita a partir da descrição da marca — G vermelho/amarelo sobre losango verde e faixa "GIGANTE DOS PISOS". O arquivo oficial (`gigantedospisos.com.br/wp-content/uploads/2022/01/logo1.png`) não pôde ser baixado deste ambiente | Salvar o arquivo oficial em `public/marca/` e apontar `site.images.logo` para ele (caminho, largura e altura); depois `npm run og` |
| Ícone do navegador | Símbolo da mesma recriação (`src/app/icon.svg`) | Recorte do logotipo oficial |
| Ilustrações de acabamentos (rodapé, rejunte, argamassa, perfil) | Ilustrações genéricas | Fotos dos produtos |

Os modelos 3D usados nos renders são de terceiros, com licença livre (ver `CREDITOS.md`).

## Antes de publicar — checklist

- [ ] Preços, produtos e texturas reais (ou retirar o preço dos cards)
- [ ] Horário, WhatsApp, entrega, instalação, pagamento e trocas confirmados
- [ ] Endereço completo + CEP e o pino oficial no mapa
- [ ] Razão social e CNPJ no rodapé
- [ ] Logotipo oficial no lugar da recriação em vetor + `npm run og`
- [ ] Fotos reais do showroom
- [ ] Integração com o Google (avaliações reais) — opcional
- [ ] `indexable: true` em `src/content/site.ts`
