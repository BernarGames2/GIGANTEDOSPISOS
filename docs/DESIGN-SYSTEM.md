# Sistema de design v2 — Gigante dos Pisos

Versão viva (com os componentes reais): **`/design-system`**. Tokens definidos
uma vez em [`src/app/globals.css`](../src/app/globals.css) (`@theme` do
Tailwind v4) — viram classes como `bg-green-900`, `text-gold-500`,
`text-display-2`.

## 1. Princípios

1. **Identidade forte, não template.** Verde profundo, dourado e o losango da
   marca em todo lugar — nada de pastel genérico.
2. **Contraste entre blocos.** As seções alternam fundo escuro `#123322` e
   claro `#FAF6EC`.
3. **Profundidade real.** Sombras perceptíveis, gradientes sutis, cards que
   "saem" da página.
4. **Pronto para o cliente.** Nenhum placeholder ou aviso na interface; o que é
   exemplo está em `CONTEUDO-PENDENTE.md`.

## 2. Cores (hex exatos)

| Token | Hex | Uso |
| --- | --- | --- |
| `green-900` | `#123322` | **Base** — fundo escuro principal (hero, catálogo, avaliações, contato) |
| `green-800` | `#1E3D28` | Cards sobre fundo escuro |
| `gold-500` | `#F0B429` | Destaques e CTAs (texto `ink` por cima) |
| `red-500` | `#C6432A` | Acento do mascote — detalhes pequenos, nunca dominante |
| `cream-50` | `#FAF6EC` | Fundo claro (simulador, a loja, dúvidas) |
| `ink` | `#16241C` | Texto escuro sobre claro |
| `sand` | `#D7CFBB` | Texto claro sobre escuro |

Tons derivados só para gradientes/superfícies: `green-950 #0B2115`,
`green-700/600`, `gold-300/400/600`, `cream-100/200/300`, `sand-muted #AAA38F`,
`ink-500/600/700`. **Texto dourado sobre creme** usa `gold-800 #8A5F00`
(contraste ≥ 4,5:1). Nunca branco ou preto puros como fundo.

Contrastes principais: `sand` sobre `green-900` ≈ 8,9:1 · `ink` sobre
`gold-500` ≈ 8,6:1 · `ink` sobre `cream-50` ≈ 15:1 · `sand-muted` sobre
`green-900` ≈ 5,4:1.

## 3. Tipografia

- **Títulos:** Poppins **700–800** (`font-display`, `font-bold`/`font-extrabold`).
- **Texto:** Inter 400–600.
- Nada de fontes arredondadas (Fredoka, Quicksand…).

| Classe | ≥ 1280 px | 390 px | Uso |
| --- | --- | --- | --- |
| `text-display-1` | 96 | 44 | H1 do hero |
| `text-display-2` | 64 | 36 | Números, títulos grandes |
| `text-display-3` | 44 | 30 | Títulos de seção |
| `text-display-4` | 32 | 24 | Subtítulos |
| `text-title` | 24 | 20 | Títulos de card |

## 4. O losango

| Elemento | Classe / componente |
| --- | --- |
| Marca (losango dourado com "G" vermelho) | `DiamondMark`, `Logo` |
| Rótulo de seção com losango vermelho | `Eyebrow` |
| Divisor linha — ◆ ◆ ◆ — linha | `DiamondDivider` |
| Ícone dentro de losango dourado | `DiamondBadge` |
| Recorte de imagem em losango | `.diamond` (clip-path) |
| Cantos chanfrados em 45° (cards, imagens, painéis) | `.chamfer` (`-sm`, `-lg`) |
| Padrão de losangos nos fundos escuros | `.pattern-diamonds` |

Como `clip-path` corta a sombra, cards chanfrados usam a sombra no elemento
pai: `.drop-card` (média) ou `.drop-deep` (forte).

## 5. Superfícies, sombras e botões

- `.surface-dark` — gradiente `#123322 → #0B2115`.
- `.card-dark` — gradiente verde + `--shadow-deep`; `.card-light` — gradiente creme + `--shadow-card`.
- Sombras: `shadow-card`, `shadow-lift`, `shadow-deep` (tons de verde, não preto).
- Botões (`src/components/ui/Button.tsx`): cantos de 8 px, Poppins 700,
  gradientes `.btn-gold` (CTA principal), `.btn-green`, `.btn-whatsapp`, além
  de contornos `outline-dark`/`outline-light`. Sobem 2 px no hover.

## 6. Ícones

[Phosphor Icons](https://phosphoricons.com) com `weight="bold"` (ou `fill`
para estrelas, selos e logotipos). Nunca ícones de traço fino.

## 7. Movimento

| Onde | Técnica | Movimento reduzido / modo leve |
| --- | --- | --- |
| Entrada do hero | CSS `animate-rise` | Desligada |
| Scroll reveal | CSS + `IntersectionObserver` (`data-reveal`) | Tudo visível |
| Contadores | `requestAnimationFrame` | Valor final direto |
| Troca de piso/ambiente | Framer Motion (crossfade de camadas) | Só opacidade |
| Filtros, abas, acordeão | Framer Motion (`layout`, `layoutId`) | Só opacidade |
| WhatsApp flutuante | Anel pulsante (8 ciclos, com pausa) | Sem anel |
