# Sistema de design v3 — Gigante dos Pisos

Versão viva (com os componentes reais): **`/design-system`**. Tokens definidos
uma vez em [`src/app/globals.css`](../src/app/globals.css) (`@theme` do
Tailwind v4) — viram classes como `bg-green-900`, `text-gold-500`,
`text-display-2`.

## 1. Princípios

1. **Loja estabelecida, não aplicativo.** O público principal tem de 40 a 60
   anos e está reformando ou construindo. O site precisa passar solidez e
   confiança: títulos firmes mas sem peso exagerado, poucos efeitos, espaço
   para respirar.
2. **A marca aparece na logo.** O losango fica reservado à logo; o resto da
   página usa cantos arredondados discretos.
3. **Três cores da marca, com funções diferentes.** Verde é a base; dourado
   só no CTA principal (hero e cabeçalho), nas estrelas da nota, no rótulo das
   seções e em detalhes pequenos; o **vermelho do mascote** é o segundo acento,
   em pontos específicos: a logo, o selo "Showroom reformado em 2025" do hero
   e o pino do mapa.
4. **Ritmo claro/escuro.** Nunca mais de 2 seções verde-escuras seguidas sem
   uma clara entre elas. Ordem atual: hero (escuro) → simulador (creme) →
   catálogo (creme mais quente, `cream-100`) → a loja (creme) → avaliações
   (escuro) → dúvidas (creme) → contato + rodapé (escuros).
5. **Números iguais em todo lugar.** 22 anos, 23,1 mil seguidores, 4,8 com
   cerca de 1.280 avaliações — sempre lidos de `src/content/site.ts`, sem
   contagem animada.
6. **Pronto para o cliente.** Nenhum placeholder na interface; o que é
   exemplo está em `CONTEUDO-PENDENTE.md`. Imagens que não são da loja levam
   o selo "Imagem ilustrativa" / "Ambiente ilustrativo".

## 2. Cores (hex exatos)

| Token | Hex | Uso |
| --- | --- | --- |
| `green-900` | `#123322` | **Base** — fundo escuro principal (hero, avaliações, contato) |
| `green-800` | `#1E3D28` | Cards sobre fundo escuro |
| `gold-500` | `#F0B429` | CTA principal (texto `ink` por cima) e detalhes pontuais |
| `red-500` | `#C6432A` | Segundo acento: logo, selo de destaque do hero, pino do mapa (texto `cream-50` por cima ≈ 4,6:1) |
| `cream-50` | `#FAF6EC` | Fundo claro (simulador, a loja, dúvidas); botão secundário sobre escuro |
| `cream-100` | `#F3ECDC` | Fundo do catálogo (separa das seções creme vizinhas) |
| `ink` | `#16241C` | Texto escuro sobre claro |
| `sand` | `#D7CFBB` | Texto claro sobre escuro |

Tons derivados só para superfícies: `green-950 #0B2115` (rodapé),
`green-700/600`, `gold-300/400/600`, `cream-100/200/300`, `sand-muted #AAA38F`,
`ink-500/600/700`. **Texto dourado sobre creme** usa `gold-800 #8A5F00`
(contraste ≥ 4,5:1). Nunca branco ou preto puros como fundo.

Contrastes principais: `sand` sobre `green-900` ≈ 8,9:1 · `ink` sobre
`gold-500` ≈ 8,6:1 · `ink` sobre `cream-50` ≈ 15:1 · `sand-muted` sobre
`green-900` ≈ 5,4:1.

## 3. Tipografia

- **Títulos:** Poppins **600** (`font-display font-semibold`); 500 em
  detalhes. Sem 700/800 — o peso extremo deixava a página com cara de app
  infantil.
- **Texto, menus e rótulos:** Inter 400–600.
- Nada de fontes arredondadas (Fredoka, Quicksand…).

| Classe | ≥ 1280 px | 390 px | Uso |
| --- | --- | --- | --- |
| `text-display-1` | 64 | 38 | H1 do hero |
| `text-display-2` | 48 | 32 | Números da loja |
| `text-display-3` | 40 | 28 | Títulos de seção |
| `text-display-4` | 28 | 22 | Subtítulos |
| `text-title` | 22 | 19 | Títulos de card |

Rótulo de seção (`Eyebrow`): Inter 600, 13 px, caixa alta com espaçamento,
precedido de um filete fino.

## 4. Componentes de marca

| Elemento | Componente |
| --- | --- |
| Logo (arquivo em `public/marca/`, definido em `site.images.logo`) | `Logo` |
| Rótulo de seção | `Eyebrow` |
| Ícone em caixa discreta (8 px de raio) | `IconBox` |
| Título + rótulo + texto de apoio | `SectionHeading` |

## 5. Superfícies, sombras e botões

- `.surface-dark` — gradiente sutil `#123322 → #0F2B1C`.
- `.card-dark` (verde + `--shadow-deep`) e `.card-light` (creme claro +
  `--shadow-card` + filete de 1 px). Cantos: 16 px (`rounded-2xl`) em cards e
  imagens, 12 px (`rounded-xl`) em itens de lista, 8 px (`rounded-lg`) em
  botões e campos.
- Sombras em tom de verde (nunca preto), presentes mas discretas.
- Botões (`src/components/ui/Button.tsx`): cores chapadas, Poppins 600,
  sem "pulo" no hover (só a cor muda).
  - `gold` — CTA principal (um por bloco, no máximo).
  - `cream` — secundário sobre fundo escuro ("Ver no ambiente", "Como chegar").
  - `whatsapp` — verde próprio do WhatsApp.
  - `outline-light` / `outline-dark` — ações de apoio.

## 6. Ícones

[Phosphor Icons](https://phosphoricons.com) com `weight="bold"` em tamanho
pequeno, em tons neutros (`sand-muted`, `green-700`); `fill` só para estrelas
e logos de terceiros.

## 7. Movimento

Sutil e rápido — o objetivo é parecer refinado, não "cheio de efeito".

| Onde | Técnica | Movimento reduzido / modo leve |
| --- | --- | --- |
| Entrada do hero | CSS `animate-rise` (0,55 s, 10 px) | Desligada |
| Scroll reveal | CSS + `IntersectionObserver` (0,5 s, 12 px) | Tudo visível |
| Troca de piso/ambiente | Framer Motion (crossfade de camadas, 0,4 s) | Só opacidade |
| Filtros, abas, acordeão | Framer Motion (`layoutId` sem mola, 0,2–0,3 s) | Só opacidade |
| Hover dos cards | Troca da amostra pelo material aplicado (só com mouse) | — |
| WhatsApp flutuante | Anel pulsante (3 ciclos, depois para) | Sem anel |
