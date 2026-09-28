import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Placeholder, PlaceholderImage } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import textures from "@/content/textures.json";
import { swatchStyle, type TextureId } from "@/lib/textures";

export const metadata: Metadata = {
  title: "Sistema de design",
  description: "Cores, tipografia e componentes do site da Gigante dos Pisos.",
  robots: { index: false, follow: false },
};

const palette: { group: string; items: { name: string; token: string; hex: string; use: string; dark?: boolean }[] }[] = [
  {
    group: "Verde da marca",
    items: [
      { name: "brand-800", token: "--color-brand-800", hex: "#17301F", use: "Fundo escuro principal, títulos", dark: true },
      { name: "brand-700", token: "--color-brand-700", hex: "#1E3D28", use: "Tom secundário, hover", dark: true },
      { name: "brand-950", token: "--color-brand-950", hex: "#0C1A11", use: "Rodapé", dark: true },
      { name: "brand-100", token: "--color-brand-100", hex: "#DDE8DF", use: "Hover sutil em fundos claros" },
    ],
  },
  {
    group: "Destaques",
    items: [
      { name: "gold-500", token: "--color-gold-500", hex: "#F0B429", use: "CTA principal, destaques" },
      { name: "gold-400", token: "--color-gold-400", hex: "#F4C551", use: "Texto de destaque sobre verde" },
      { name: "mascot-500", token: "--color-mascot-500", hex: "#C6432A", use: "Acento do mascote — com moderação", dark: true },
      { name: "whatsapp", token: "--color-whatsapp", hex: "#1DA851", use: "Somente ações de WhatsApp", dark: true },
    ],
  },
  {
    group: "Neutros",
    items: [
      { name: "cream-50", token: "--color-cream-50", hex: "#FAF6EC", use: "Fundo claro principal" },
      { name: "cream-100", token: "--color-cream-100", hex: "#F4EEDF", use: "Seções alternadas, filtros" },
      { name: "ink-900", token: "--color-ink-900", hex: "#16241C", use: "Texto principal", dark: true },
      { name: "ink-600", token: "--color-ink-600", hex: "#4A5A50", use: "Texto secundário", dark: true },
    ],
  },
];

const typeScale = [
  { cls: "text-display-1", label: "Display 1 · 96 px", sample: "Do básico ao acabamento." },
  { cls: "text-display-2", label: "Display 2 · 64 px", sample: "22 anos de Uberlândia" },
  { cls: "text-display-3", label: "Display 3 · 44 px", sample: "Títulos de seção" },
  { cls: "text-display-4", label: "Display 4 · 32 px", sample: "Subtítulos" },
  { cls: "text-title", label: "Title · 24 px", sample: "Títulos de card" },
];

function Block({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="border-t border-ink-900/10 py-14">
      <h2 className="font-display text-display-4 font-bold text-brand-800">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-ink-600">{description}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  const textureIds = Object.keys(textures).filter((k) => !k.startsWith("$")) as TextureId[];

  return (
    <>
      <header className="bg-brand-800">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-cream-50 hover:text-gold-300">
            <ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Gigante dos Pisos</p>
        <h1 className="mt-3 font-display text-display-2 font-extrabold text-brand-800">Sistema de design</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-600">
          Referência viva das cores, da tipografia e dos componentes do site. Os tokens ficam em{" "}
          <code className="rounded bg-cream-100 px-1.5 py-0.5 text-sm">src/app/globals.css</code> e a documentação em{" "}
          <code className="rounded bg-cream-100 px-1.5 py-0.5 text-sm">docs/DESIGN-SYSTEM.md</code>.
        </p>

        <Block title="Cores" description="Paleta baseada na identidade observada no Instagram e no site atual: verde escuro, amarelo/dourado e toques de vermelho do mascote.">
          <div className="grid gap-10">
            {palette.map((g) => (
              <div key={g.group}>
                <h3 className="font-display font-semibold text-ink-900">{g.group}</h3>
                <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {g.items.map((c) => (
                    <li key={c.name} className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-900/5">
                      <div className="flex h-24 items-end p-3" style={{ backgroundColor: c.hex }}>
                        <span className={c.dark ? "text-xs font-semibold text-white" : "text-xs font-semibold text-ink-900"}>
                          {c.hex}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="font-display text-sm font-semibold">{c.name}</p>
                        <p className="mt-1 text-xs text-ink-500">{c.use}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Tipografia" description="Poppins (600–800) para títulos e Inter (400–600) para textos. Escala fluida: os tamanhos indicados são os do desktop.">
          <ul className="space-y-6">
            {typeScale.map((t) => (
              <li key={t.cls} className="grid gap-2 md:grid-cols-[200px_1fr] md:items-baseline">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{t.label}</span>
                <span className={`font-display font-bold text-brand-800 ${t.cls}`}>{t.sample}</span>
              </li>
            ))}
            <li className="grid gap-2 md:grid-cols-[200px_1fr] md:items-baseline">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">Texto · Inter 18/16 px</span>
              <p className="max-w-2xl text-lg text-ink-700">
                Pisos, revestimentos e materiais de acabamento para a sua obra, em um só lugar. Tom de voz direto,
                confiável e regional — sem exagero publicitário.
              </p>
            </li>
          </ul>
        </Block>

        <Block title="Botões" description="Um CTA principal por bloco (dourado). WhatsApp sempre em verde próprio.">
          <div className="flex flex-wrap items-center gap-4">
            <Button icon={<ArrowRight className="order-last size-4" aria-hidden="true" />}>Primário</Button>
            <Button variant="whatsapp" icon={<WhatsAppIcon className="size-4" />}>
              WhatsApp
            </Button>
            <Button variant="outline-dark">Contorno</Button>
            <Button variant="ghost" icon={<Phone className="size-4" aria-hidden="true" />}>
              Discreto
            </Button>
            <Button size="lg">Grande</Button>
          </div>
          <div className="on-dark mt-6 flex flex-wrap items-center gap-4 rounded-3xl bg-brand-800 p-6">
            <ButtonLink href="#">Primário</ButtonLink>
            <ButtonLink href="#" variant="outline-light">
              Contorno claro
            </ButtonLink>
          </div>
        </Block>

        <Block
          title="Conteúdo a confirmar"
          description="Regra principal do projeto: nada de dados, depoimentos ou fotos inventados. O que não foi confirmado pela loja aparece entre colchetes e destacado."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink-900/5">
              <p className="text-ink-700">
                Endereço: <Placeholder>[endereço completo]</Placeholder> · Horário: <Placeholder>[horário]</Placeholder>
              </p>
              <p className="mt-3 text-sm text-ink-500">
                Em textos do conteúdo basta escrever entre colchetes — o componente{" "}
                <code className="rounded bg-cream-100 px-1">WithPlaceholders</code> destaca automaticamente.
              </p>
            </div>
            <PlaceholderImage label="[foto do showroom]" hint="Foto real fornecida pela loja" className="min-h-40 rounded-3xl text-ink-500" />
          </div>
        </Block>

        <Block title="Cabeçalho de seção">
          <SectionHeading eyebrow="Rótulo" title="Título da seção" lead="Texto de apoio com uma ou duas frases, no máximo." />
        </Block>

        <Block title="Indicadores" description="Contador animado (respeita movimento reduzido) e estrelas com preenchimento parcial.">
          <div className="flex flex-wrap items-center gap-10">
            <p className="font-display text-display-2 font-extrabold text-brand-800">
              <Counter value={22} /> <span className="text-display-4 text-gold-600">anos</span>
            </p>
            <div>
              <p className="font-display text-display-3 font-extrabold text-brand-800">4,8</p>
              <Stars value={4.8} className="text-2xl text-gold-500" />
            </div>
          </div>
        </Block>

        <Block title="Texturas ilustrativas" description="Geradas por script (npm run textures). Substituir por fotos/texturas reais dos produtos quando disponíveis.">
          <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {textureIds.map((id) => (
              <li key={id}>
                <div className="aspect-square rounded-xl ring-1 ring-ink-900/10" style={swatchStyle(id)} />
                <p className="mt-1.5 text-[11px] leading-tight text-ink-500">{id}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Forma e profundidade">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-soft">
              <p className="font-display font-semibold">shadow-soft</p>
              <p className="text-sm text-ink-500">Cards em repouso · rounded-2xl</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-lift">
              <p className="font-display font-semibold">shadow-lift</p>
              <p className="text-sm text-ink-500">Hover e destaques · rounded-3xl</p>
            </div>
            <div className="rounded-full bg-gold-500 p-6 text-center shadow-gold">
              <p className="font-display font-semibold">shadow-gold</p>
              <p className="text-sm">CTA principal</p>
            </div>
          </div>
        </Block>
      </main>
    </>
  );
}
