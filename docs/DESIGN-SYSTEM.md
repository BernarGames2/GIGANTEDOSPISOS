# Sistema de design — Gigante dos Pisos

Referência das decisões visuais do site. A versão "viva" (renderizada com os
componentes reais) está em **`/design-system`**. Os tokens são definidos uma
única vez em [`src/app/globals.css`](../src/app/globals.css) (bloco `@theme` do
Tailwind CSS v4) e viram classes utilitárias automaticamente
(`bg-brand-800`, `text-gold-400`, `text-display-2`…).

---

## 1. Princípios

1. **Verdade antes de estética.** Nada de números, depoimentos, fotos ou
   certificações inventados. O que não foi confirmado aparece entre
   `[colchetes]`, com destaque visual (ver §6).
2. **Respiro.** Seções com `py-20`/`py-28`, no máximo um CTA principal por
   bloco, grids com bastante espaço entre os cards.
3. **Regional e direto.** Tom de voz de loja de bairro que cresceu: claro,
   confiável, sem exagero publicitário.
4. **Mobile-first e leve.** Toda animação tem alternativa estática e nenhuma
   informação depende dela.

## 2. Cores

| Token | Hex | Uso |
| --- | --- | --- |
| `brand-800` | `#17301F` | Verde principal: hero, seção "A loja", header |
| `brand-700` | `#1E3D28` | Verde secundário, hovers |
| `brand-950` | `#0C1A11` | Rodapé |
| `brand-100…600` | — | Variações de apoio (bordas, hovers em fundo claro) |
| `gold-500` | `#F0B429` | **Destaque/CTA principal** (texto `ink-900` por cima) |
| `gold-300/400` | `#F7D77F` / `#F4C551` | Texto de destaque sobre o verde |
| `mascot-500` | `#C6432A` | Vermelho do mascote — **acento pontual** (detalhes, erro) |
| `cream-50` | `#FAF6EC` | Fundo claro principal |
| `cream-100/200/300` | — | Seções alternadas, filtros, bordas tracejadas |
| `ink-900` | `#16241C` | Texto principal |
| `ink-500/600/700` | — | Texto secundário e legendas |
| `whatsapp` | `#1DA851` | Exclusivo para ações de WhatsApp |

**Contraste (WCAG):** `ink-900` sobre `gold-500` ≈ 8,6:1 · `gold-500` sobre
`brand-800` ≈ 7,6:1 · `cream-50` sobre `brand-800` ≈ 13:1 · branco sobre
`whatsapp` ≈ 3,1:1 (usado só em botões/ícones grandes, com texto em negrito).
O vermelho sobre creme fica em ≈ 4,6:1: não usar em textos pequenos longos.

**Ritmo das seções:** verde (hero) → creme escuro (simulador) → creme
(catálogo) → verde (a loja) → creme (avaliações) → creme escuro (dúvidas) →
creme (contato) → verde quase preto (rodapé).

## 3. Tipografia

- **Títulos:** Poppins 600/700/800 (`font-display`), tracking negativo.
- **Texto:** Inter 400–600 (`font-sans`, padrão do `body`).
- Carregadas com `next/font` (auto-hospedadas, `display: swap`, sem CLS).

| Classe | Desktop (≥ 1280 px) | Mobile (390 px) | Uso |
| --- | --- | --- | --- |
| `text-display-1` | 96 px | 44 px | H1 do hero |
| `text-display-2` | 64 px | 36 px | Números grandes, título do /design-system |
| `text-display-3` | 44 px | 30 px | Títulos de seção (H2) |
| `text-display-4` | 32 px | 24 px | Subtítulos (H3 de bloco) |
| `text-title` | 24 px | 20 px | Títulos de card, estado vazio |
| `text-lg` / `text-base` | 18 / 16 px | — | Parágrafos |

As escalas usam `clamp()` e já trazem `line-height` e `letter-spacing`.

## 4. Forma, sombra e movimento

- **Raios:** `rounded-full` (botões, chips), `rounded-2xl` (cards de produto,
  campos), `rounded-3xl` (painéis, blocos de destaque).
- **Sombras:** `shadow-soft` (repouso), `shadow-lift` (hover/destaque),
  `shadow-gold` (CTA principal).
- **Easing padrão:** `--ease-out-soft` = `cubic-bezier(.22, 1, .36, 1)`.
- **Durações:** 200 ms (hover de botão) · 300–450 ms (filtros, abas, acordeão)
  · 500–750 ms (troca de piso no simulador, scroll reveal).

### Animações e microinterações

| Onde | Técnica | Movimento reduzido / modo leve |
| --- | --- | --- |
| Entrada do hero | CSS `animate-rise` (fade + 18 px) | Desligada |
| Scroll reveal das seções | CSS + `IntersectionObserver` (`data-reveal`) | Tudo visível de imediato |
| Contadores | `requestAnimationFrame` (easing cúbico) | Valor final direto |
| Hover dos cards | CSS: escala + troca de imagem | Mantido (sem deslocamento grande) |
| Simulador | Framer Motion: crossfade de camadas, pílulas com `layoutId` | Só opacidade |
| Filtros do catálogo | Framer Motion `layout` + `AnimatePresence` | Só opacidade |
| Acordeão (FAQ) | Framer Motion (altura/opacidade) | Só opacidade |
| Botão de WhatsApp | CSS: anel pulsante, 8 ciclos com pausa | Sem anel |

"Modo leve" = `Save-Data`, conexão 2G ou aparelho com ≤ 2 GB de memória
(`src/components/motion/use-lite-mode.ts`).

## 5. Componentes

| Componente | Arquivo | Notas |
| --- | --- | --- |
| `Button` / `ButtonLink` | `src/components/ui/Button.tsx` | Variantes `primary`, `whatsapp`, `outline-light`, `outline-dark`, `ghost`; tamanhos `md`/`lg`. Links externos abrem em nova aba. |
| `SectionHeading` | `src/components/ui/SectionHeading.tsx` | Rótulo + H2 + texto de apoio; `tone="dark"` para fundos verdes. |
| `Placeholder`, `WithPlaceholders`, `PlaceholderImage` | `src/components/ui/Placeholder.tsx` | Ver §6. |
| `Stars` | `src/components/ui/Stars.tsx` | Preenchimento parcial (4,8 → 4 ⅘ estrelas). |
| `Counter` | `src/components/ui/Counter.tsx` | HTML do servidor já traz o valor final. |
| `ProductCard` | `src/components/catalog/ProductCard.tsx` | Imagem + visão aplicada no hover, ações "Simular" e "Orçar". |
| `RoomScene` | `src/components/simulator/RoomScene.tsx` | Cena em perspectiva do simulador. |
| `Logo` | `src/components/layout/Logo.tsx` | **Provisório** até receber o logotipo oficial. |

Ícones: [lucide-react](https://lucide.dev) (traço 2 px). Logos de WhatsApp e
Instagram desenhados à mão em `src/components/ui/icons.tsx`.

## 6. Conteúdo a confirmar (placeholders)

- Em qualquer texto de conteúdo, escreva o trecho pendente entre colchetes:
  `"Horário: [horário de funcionamento]"`. O componente `WithPlaceholders`
  aplica o destaque (`.ph`: fundo dourado translúcido + sublinhado tracejado)
  e o `title` "Conteúdo a confirmar com a loja".
- Para fotos, use `PlaceholderImage` (área listrada, borda tracejada e rótulo
  como `[foto de obra entregue]`). **Nunca** substituir por banco de imagens.
- Ao receber o dado real, basta trocar o texto — o destaque some sozinho.

## 7. Imagens e texturas

- Fotos reais: `next/image` (formatos modernos, `sizes` corretos, `priority`
  apenas no hero).
- Texturas do simulador/catálogo: SVGs **ilustrativos** gerados por
  `npm run textures` a partir de `src/content/textures.json`. Para usar a
  textura real de um produto, coloque a imagem repetível em `public/texturas/`
  e informe `src` e `size` (em cm) no JSON.

## 8. Acessibilidade

- Link "Pular para o conteúdo", foco visível dourado em todos os controles.
- Botões de filtro/abas com `aria-pressed`; acordeão com `aria-expanded` e
  `aria-controls`; menu mobile fecha com `Esc`.
- Cena do simulador com `role="img"` e descrição + região `aria-live`
  anunciando a combinação escolhida.
- Contadores com valor final para leitores de tela (`sr-only`).
