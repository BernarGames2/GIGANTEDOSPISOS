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

1. **Hero** — fundo verde de marca, "Do básico ao acabamento", CTA principal
   (Simular ambiente) + WhatsApp, números da loja (4,8 no Google com cerca de
   1.280 avaliações, 23,1 mil seguidores, showroom 2025) e duas imagens com o
   selo "Imagem ilustrativa".
2. **Simulador de ambientes** — sala, cozinha, banheiro e área externa
   renderizados em 3D, com o selo "Ambiente ilustrativo"; troca de piso e
   revestimento e orçamento da combinação pelo WhatsApp. No celular a cena
   fica presa no topo enquanto a pessoa escolhe o material.
3. **Catálogo filtrável** — fundo claro; filtros de categoria, ambiente e
   faixa de preço (quebram em linhas no celular, nada escondido); lista
   compacta no celular; no computador, hover troca para o material aplicado;
   "Ver no ambiente" abre o produto no simulador.
4. **A loja** — os mesmos números do hero (22 anos, 23,1 mil, 4,8), sem
   animação, e os diferenciais.
5. **Avaliações** — só a nota agregada do Google; depoimentos reais apenas
   via integração (nada inventado).
6. **Dúvidas** — acordeão.
7. **Contato e rodapé** — telefone, WhatsApp, horário, mapa ilustrativo com
   "Como chegar" (o mapa real do Google entra quando o endereço for
   confirmado), formulário que abre o WhatsApp e botão flutuante.

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
| Dados e **números** da loja, horário, WhatsApp, redes, logo, `indexable` | `src/content/site.ts` |
| **Produtos, preços, fotos e o que entra no simulador** | **`planilha/produtos.xlsx`** (ver abaixo) |
| Faixas de preço do filtro | `src/content/products.ts` (`priceRanges`) |
| Perguntas frequentes | `src/content/faq.ts` |
| Texturas (tamanho em cm, arquivo real) | `src/content/textures.json` + `public/texturas/` |
| Cores, fontes, sombras, gradientes | `src/app/globals.css` |
| Logo (arquivo) | `public/marca/` + `site.images.logo` |
| Imagem de compartilhamento (Open Graph) | `npm run og` → `public/og-gigante-dos-pisos.png` |

## Produtos: a planilha

O catálogo e o simulador são gerados a partir de **`planilha/produtos.xlsx`**
(abre no Excel, LibreOffice ou Google Planilhas). Uma linha por produto:
mostrar no site (Sim/Não), nome, categoria, formato, acabamento, preço "a
partir de", unidade, ambientes (Sim/Não), simulador (Piso/Parede/Piso e
parede/Não), foto da peça e imagem ilustrativa. As colunas têm listas
suspensas e a aba **"Como preencher"** explica cada uma.

**Para atualizar o site (sem mexer em código):**

1. Edite a planilha e salve como `.xlsx`.
2. Fotos das peças: salve em `public/produtos/` e escreva o nome do arquivo
   na coluna "Foto da peça". Use a foto de **uma** peça, de frente; com o
   formato preenchido (ex.: `60 × 60 cm`), o simulador aplica a foto no
   tamanho real.
3. No GitHub: **Add file → Upload files**, envie a planilha para
   `planilha/produtos.xlsx` (e as fotos para `public/produtos/`) →
   **Commit changes**.
4. A Netlify/Vercel publica de novo sozinha. Antes do build, `npm run
   planilha` confere tudo e gera `src/content/produtos.json` (+
   `produtos-texturas.json` para as fotos). **Se houver erro, o build para,
   o site no ar continua como estava** e o log do deploy mostra a linha e o
   que corrigir, por exemplo:

   ```
   planilha/produtos.xlsx tem problemas — o catálogo NÃO foi atualizado:
     • Linha 23 (Porcelanato acetinado grafite): foto "grafite60x60.jpg" não encontrada em public/produtos/.
   ```

Comandos: `npm run planilha` (confere e gera o catálogo; roda sozinho antes
de `dev` e `build`) · `npm run planilha:modelo -- --forcar` (recria a
planilha a partir do catálogo atual). Não edite `produtos.json` à mão — ele é
sobrescrito pela planilha.

## SEO e compartilhamento

- **Título:** "Gigante dos Pisos | Pisos, revestimentos e acabamento em
  Uberlândia – MG"; **descrição:** `site.description` (dados reais da loja).
- **Open Graph / WhatsApp / redes:** título, descrição e a imagem
  `public/og-gigante-dos-pisos.png` (logo + números da loja, sem fotos),
  gerada por `npm run og` a partir de `src/content/site.ts`.
- **Dados estruturados** (`HomeGoodsStore`): nome, descrição, telefone,
  cidade, logo e Instagram — só dados confirmados.
- **Indexação:** enquanto `indexable` for `false`, a página sai com `noindex`
  e o `robots.txt` bloqueia robôs. Na publicação oficial, mudar para `true`.

## Avaliações do Google (opcional)

1. No Google Cloud, ative a **Places API (New)** e crie uma chave restrita a ela.
2. Descubra o **Place ID** da ficha da loja (ferramenta "Place ID Finder").
3. Configure `GOOGLE_PLACES_API_KEY` e `GOOGLE_PLACE_ID` (ver `.env.example`).

Com as variáveis, o site mostra nota, total e até 3 avaliações públicas reais,
com autor e link, revalidando uma vez por dia (`src/lib/google-reviews.ts`).
Sem elas, mostra só a nota agregada (4,8 · cerca de 1.280 avaliações) — nunca
depoimentos inventados. A nota e o total exibidos vêm sempre de
`src/content/site.ts`, para ficarem iguais em todo o site.

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
    brand/             logo, rótulos, caixas de ícone, títulos de seção
    sections/          Hero, SimulatorSection, CatalogSection, Highlights,
                       SocialProof, Faq, Contact
    simulator/         cenas, compositor de camadas e interface do simulador
    catalog/           filtros, grade e card de produto
    layout/            Header, Footer, WhatsApp flutuante
    motion/            Framer Motion, crossfade, scroll reveal
    ui/                botões, estrelas
  content/             dados da loja, produtos, FAQ, texturas, ambientes (JSON)
  lib/                 WhatsApp, texturas, Google Reviews, utilitários
public/ambientes       camadas renderizadas dos ambientes + hero
public/texturas        texturas ilustrativas dos produtos
render/                pipeline 3D (three.js + sharp), imagens do hero e Open Graph
scripts/               planilha → catálogo (planilha.mjs) e gerador de texturas
planilha/produtos.xlsx catálogo editado pela loja
public/produtos        fotos reais das peças (citadas na planilha)
docs/DESIGN-SYSTEM.md  sistema de design
```
