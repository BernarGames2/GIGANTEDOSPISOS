import { ArrowLeft, ArrowRight, Phone, Stack, Truck, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { DiamondBadge, DiamondDivider, DiamondMark, Eyebrow, Logo, SectionHeading } from "@/components/brand/Brand";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Stars } from "@/components/ui/Stars";
import textures from "@/content/textures.json";
import { swatchStyle, type TextureId } from "@/lib/textures";

export const metadata: Metadata = {
  title: "Sistema de design",
  description: "Cores, tipografia e componentes do site da Gigante dos Pisos.",
  robots: { index: false, follow: false },
};

const palette: { name: string; hex: string; use: string; dark?: boolean }[] = [
  { name: "green-900", hex: "#123322", use: "Base: fundo escuro principal", dark: true },
  { name: "green-800", hex: "#1E3D28", use: "Cards sobre fundo escuro", dark: true },
  { name: "gold-500", hex: "#F0B429", use: "Destaques e CTAs" },
  { name: "red-500", hex: "#C6432A", use: "Acento do mascote (moderação)", dark: true },
  { name: "cream-50", hex: "#FAF6EC", use: "Fundo claro" },
  { name: "ink", hex: "#16241C", use: "Texto escuro sobre claro", dark: true },
  { name: "sand", hex: "#D7CFBB", use: "Texto claro sobre escuro" },
  { name: "gold-800", hex: "#8A5F00", use: "Dourado para texto sobre creme", dark: true },
];

const typeScale = [
  { cls: "text-display-1", label: "Display 1 · 96 px · 800", sample: "Do básico ao acabamento." },
  { cls: "text-display-2", label: "Display 2 · 64 px · 800", sample: "22 anos de Uberlândia" },
  { cls: "text-display-3", label: "Display 3 · 44 px · 800", sample: "Títulos de seção" },
  { cls: "text-display-4", label: "Display 4 · 32 px · 800", sample: "Subtítulos" },
  { cls: "text-title", label: "Title · 24 px · 700", sample: "Títulos de card" },
];

function Block({ title, description, children, dark }: { title: string; description?: string; children: ReactNode; dark?: boolean }) {
  return (
    <section className={dark ? "surface-dark py-16" : "py-16"}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className={`font-display text-display-4 font-extrabold ${dark ? "text-cream-50" : "text-green-900"}`}>{title}</h2>
        {description ? <p className={`mt-2 max-w-2xl ${dark ? "text-sand" : "text-ink-600"}`}>{description}</p> : null}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default function DesignSystemPage() {
  const textureIds = Object.keys(textures).filter((k) => !k.startsWith("$")) as TextureId[];

  return (
    <>
      <header className="surface-dark">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link href="/" className="inline-flex items-center gap-2 font-display text-sm font-bold text-cream-50 hover:text-gold-300">
            <ArrowLeft weight="bold" className="size-4" aria-hidden="true" /> Voltar ao site
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
          <Eyebrow>Gigante dos Pisos</Eyebrow>
          <h1 className="mt-4 font-display text-display-2 font-extrabold text-green-900">Sistema de design</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-600">
            Referência viva da identidade: paleta exata da marca, Poppins forte nos títulos, losango como elemento
            recorrente e profundidade real nos cards. Tokens em <code className="rounded bg-cream-100 px-1.5">src/app/globals.css</code>.
          </p>
        </div>

        <Block title="Cores" description="Paleta obrigatória (hex exatos). Sem branco ou preto puros como fundo.">
          <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {palette.map((c) => (
              <li key={c.name} className="drop-card">
                <div className="card-light chamfer chamfer-sm overflow-hidden">
                  <div className="flex h-24 items-end p-3" style={{ backgroundColor: c.hex }}>
                    <span className={`font-display text-xs font-bold ${c.dark ? "text-cream-50" : "text-ink"}`}>{c.hex}</span>
                  </div>
                  <div className="p-3">
                    <p className="font-display text-sm font-bold">{c.name}</p>
                    <p className="mt-1 text-xs text-ink-500">{c.use}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Tipografia" description="Poppins 700–800 nos títulos; Inter 400–600 no texto.">
          <ul className="space-y-7">
            {typeScale.map((t) => (
              <li key={t.cls} className="grid gap-2 md:grid-cols-[220px_1fr] md:items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-500">{t.label}</span>
                <span className={`font-display font-extrabold text-green-900 ${t.cls}`}>{t.sample}</span>
              </li>
            ))}
            <li className="grid gap-2 md:grid-cols-[220px_1fr] md:items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-500">Texto · Inter 18/16 px</span>
              <p className="max-w-2xl text-lg text-ink-700">
                Tom direto, confiável e regional — sem exagero publicitário. Frases curtas, com o benefício na frente.
              </p>
            </li>
          </ul>
        </Block>

        <Block dark title="Losango: o elemento da marca" description="Marca, rótulos, divisores, selos de ícone, recortes de imagem e cantos chanfrados em 45°.">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <DiamondMark className="size-20" />
                <Logo />
              </div>
              <Eyebrow tone="dark">Rótulo de seção</Eyebrow>
              <DiamondDivider tone="dark" />
              <div className="flex gap-6">
                <DiamondBadge size="sm">
                  <Stack weight="bold" className="size-5" />
                </DiamondBadge>
                <DiamondBadge>
                  <Truck weight="bold" className="size-6" />
                </DiamondBadge>
                <DiamondBadge size="lg">
                  <Phone weight="bold" className="size-7" />
                </DiamondBadge>
              </div>
            </div>
            <div className="drop-deep">
              <div className="card-dark chamfer p-7">
                <p className="font-display text-title font-bold text-cream-50">Card escuro com chanfro</p>
                <p className="mt-2 text-sand">Gradiente sutil de verde, sombra profunda e cantos em 45° que ecoam o losango.</p>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Botões" description="Gradientes, cantos de 8 px, Poppins 700. Um CTA dourado por bloco; WhatsApp sempre em verde próprio.">
          <div className="flex flex-wrap items-center gap-4">
            <Button iconAfter={<ArrowRight weight="bold" className="size-5" />}>Dourado</Button>
            <Button variant="whatsapp" icon={<WhatsappLogo weight="bold" className="size-5" />}>
              WhatsApp
            </Button>
            <Button variant="green">Verde</Button>
            <Button variant="outline-dark">Contorno</Button>
            <Button size="lg">Grande</Button>
          </div>
          <div className="surface-dark chamfer mt-6 flex flex-wrap items-center gap-4 p-6">
            <ButtonLink href="#">Dourado</ButtonLink>
            <ButtonLink href="#" variant="outline-light">
              Contorno claro
            </ButtonLink>
          </div>
        </Block>

        <Block title="Cabeçalho de seção e indicadores">
          <SectionHeading eyebrow="Rótulo" title="Título da seção" lead="Texto de apoio com uma ou duas frases, no máximo." />
          <div className="mt-12 flex flex-wrap items-center gap-12">
            <p className="font-display text-display-2 font-extrabold text-green-900">
              <Counter value={22} /> <span className="text-display-4 text-gold-800">anos</span>
            </p>
            <div>
              <p className="font-display text-display-3 font-extrabold text-green-900">4,8</p>
              <Stars value={4.8} className="text-2xl text-gold-500" />
            </div>
          </div>
        </Block>

        <Block dark title="Texturas do catálogo" description="Ilustrativas, geradas por script (npm run textures). Substituir pelas fotos/texturas reais dos produtos.">
          <ul className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-6">
            {textureIds.map((id) => (
              <li key={id} className="text-center">
                <div className="diamond mx-auto aspect-square w-[85%]" style={swatchStyle(id)} />
                <p className="mt-2 text-[11px] leading-tight text-sand">{id}</p>
              </li>
            ))}
          </ul>
        </Block>
      </main>
    </>
  );
}
