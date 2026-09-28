# Gigante dos Pisos — site

Site institucional e comercial da **Gigante dos Pisos**, loja de pisos,
revestimentos, materiais de construção e acabamento em **Uberlândia (MG)**,
com 22 anos de mercado. Construído para ser apresentado aos donos como um
site pronto: identidade forte, simulador de ambientes com renders
fotorrealistas e nenhum placeholder visível na interface.

> Tudo o que ainda é **exemplo** (preços, horário, políticas…) ou foi
> **omitido** (endereço completo, CNPJ…) está listado em
> **[CONTEUDO-PENDENTE.md](CONTEUDO-PENDENTE.md)**. Enquanto houver pendências,
> o site fica fora do Google (`noindex`), sem nenhum aviso na tela.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — tokens no `@theme` de `src/app/globals.css`
- **Framer Motion** (pacote `motion`, carregado sob demanda)
- **Phosphor Icons** (peso *bold*/*fill*), `next/font` (Poppins 700–800 + Inter), `next/image`
- **three.js + sharp** apenas para gerar os renders dos ambientes (fora do bundle do site)

## Rodando localmente

Requer Node.js 20.9+ (recomendado 22).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run start      # serve o build
npm run lint
npm run typecheck
```

Páginas: `/` (site) e `/design-system` (guia visual vivo, não indexado).

## Seções

1. **Hero** — fundo verde de marca com padrão de losangos, "Do básico ao
   acabamento", CTA duplo (Simular ambiente / Falar no WhatsApp), nota 4,8 no
   Google, 23,1 mil seguidores e imagens em recorte de losango.
2. **Simulador de ambientes** — sala, cozinha, banheiro e área externa
   renderizados em 3D; troca de piso e revestimento com transição suave e
   orçamento da combinação pelo WhatsApp.
3. **Catálogo filtrável** — categoria, ambiente e faixa de preço; cards com
   profundidade, hover com zoom e troca para o material aplicado; "Ver no
   ambiente" abre o produto no simulador.
4. **A loja** — contadores animados (22 anos, 23,1 mil, 4,8) e diferenciais
   em cards com selo em losango.
5. **Avaliações** — nota real do Google em destaque; depoimentos reais apenas
   via integração (nada inventado); bloco do Instagram.
6. **Dúvidas** — acordeão em cards.
7. **Contato e rodapé** — telefone, WhatsApp, horário, mapa, formulário que
   abre o WhatsApp e botão flutuante sempre visível.

## Como o simulador funciona

Os ambientes são **renders 3D** (não são fotos da loja) feitos com three.js em
um navegador headless, com modelos de licença livre (ver [CREDITOS.md](CREDITOS.md)).
Para cada ambiente o render gera camadas alinhadas pixel a pixel
(`public/ambientes/<ambiente>/`):

| Camada | Uso no site |
| --- | --- |
| `beauty` | imagem-base (parede pintada) |
| `fg` | móveis e objetos recortados, por cima de tudo |
| `floor-mask`, `wall-mask` | onde o piso e as paredes revestíveis aparecem |
| `shade` | luz e sombra reais sobre piso/parede (`mix-blend-mode: multiply`) |
| `light` | manchas de sol (`screen`) |
| `refl`, `refl-soft` | reflexo do ambiente no piso, com Fresnel (`screen`, intensidade conforme o brilho do produto) |

A textura do produto é aplicada **em escala real (cm)** e projetada em
perspectiva com uma homografia (`matrix3d`) calculada a partir da câmera do
render (`src/content/ambientes.json`). O resultado: o mesmo piso ganha as
sombras dos móveis, a luz da janela e, se for polido, o reflexo do ambiente.
Cada camada existe em 1600 px e em 960 px (celular).

Regerar os ambientes (opcional; as imagens já estão no repositório):

```bash
node render/run.mjs preview sala           # prévia rápida em render/.out/
node render/run.mjs render                 # render final (≈ 4 min por ambiente)
node render/postprocess.mjs                # só converte as camadas para WebP
SITE_URL=http://localhost:3000 node render/hero.mjs   # imagens do hero
```

Requer Chromium (Playwright). Os modelos são baixados para `render/.cache/`
(fora do git).

**Evolução natural:** usar texturas reais dos fornecedores (basta informar
`src` e `size` em `src/content/textures.json`) e, depois, permitir que o
cliente envie a foto do próprio ambiente — marcando os cantos do piso, a mesma
homografia se aplica.

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Dados da loja, horário, WhatsApp, redes, `indexable` | `src/content/site.ts` |
| Produtos, preços e faixas de preço | `src/content/products.ts` |
| Perguntas frequentes | `src/content/faq.ts` |
| Texturas (tamanho em cm, arquivo real) | `src/content/textures.json` + `public/texturas/` |
| Cores, fontes, sombras, gradientes | `src/app/globals.css` |
| Marca (losango com "G") | `src/components/brand/Brand.tsx` |

## Avaliações do Google (opcional)

1. No Google Cloud, ative a **Places API (New)** e crie uma chave restrita a ela.
2. Descubra o **Place ID** da ficha da loja (ferramenta "Place ID Finder").
3. Configure `GOOGLE_PLACES_API_KEY` e `GOOGLE_PLACE_ID` (ver `.env.example`).

Com as variáveis, o site mostra nota, total e até 3 avaliações públicas reais,
com autor e link, revalidando uma vez por dia (`src/lib/google-reviews.ts`).
Sem elas, mostra a nota informada (4,8 / ~1.280) e o bloco do Instagram — nunca
depoimentos inventados.

## Deploy

Antes da publicação oficial: resolver [CONTEUDO-PENDENTE.md](CONTEUDO-PENDENTE.md)
e mudar `indexable` para `true` em `src/content/site.ts`.

### Vercel (recomendado)

1. Suba o repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório — o
   framework Next.js é detectado sozinho.
3. Em *Settings → Environment Variables*, adicione `NEXT_PUBLIC_SITE_URL` e,
   se quiser, as variáveis do Google.
4. Em *Settings → Domains*, aponte `gigantedospisos.com.br`.

### Netlify

1. *Add new site → Import an existing project* e escolha o repositório.
2. O `netlify.toml` já define `npm run build`, pasta `.next` e Node 22; o
   runtime de Next.js da Netlify é instalado automaticamente.
3. Configure as mesmas variáveis em *Site configuration → Environment variables*.
4. Em *Domain management*, adicione o domínio próprio.

As páginas são estáticas; com a integração do Google ativa, a inicial é
revalidada a cada 24 h (ISR), suportado nas duas plataformas.

## Performance e acessibilidade

- Página estática; animações carregadas sob demanda; camadas do simulador só do
  ambiente aberto, em resolução menor no celular.
- Fontes com `next/font` (sem CLS); imagem do hero com `priority`.
- Animações respeitam `prefers-reduced-motion` e conexões lentas ("modo leve").
- Contraste de texto ≥ 4,5:1 (dourado para texto em fundo claro usa `gold-800`).
- Navegação por teclado, foco visível, `aria-*` nos controles e anúncio da
  combinação escolhida no simulador.

## Estrutura

```
src/
  app/                 layout, página, /design-system, robots, sitemap, ícone
  components/
    brand/             losango/marca, rótulos, divisores, selos, títulos de seção
    sections/          Hero, SimulatorSection, CatalogSection, Highlights,
                       SocialProof, Faq, Contact
    simulator/         cenas, compositor de camadas e interface do simulador
    catalog/           filtros, grade e card de produto
    layout/            Header, Footer, WhatsApp flutuante
    motion/            Framer Motion, crossfade, scroll reveal
    ui/                botões, estrelas, contador
  content/             dados da loja, produtos, FAQ, texturas, ambientes (JSON)
  lib/                 WhatsApp, texturas, Google Reviews, utilitários
public/ambientes       camadas renderizadas dos ambientes + hero
public/texturas        texturas ilustrativas dos produtos
render/                pipeline de renderização 3D (three.js + sharp)
scripts/               gerador de texturas
docs/DESIGN-SYSTEM.md  sistema de design
```
