import { Hammer, Layers, Store, Truck, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { site } from "@/content/site";
import { Counter } from "@/components/ui/Counter";
import { InstagramIcon } from "@/components/ui/icons";
import { PlaceholderImage, WithPlaceholders } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";

const stats = [
  {
    value: site.yearsInBusiness,
    decimals: 0,
    unit: "anos",
    label: `de mercado em ${site.city}`,
  },
  {
    value: site.instagram.followers,
    decimals: 1,
    unit: "mil",
    label: `seguidores no Instagram (${site.instagram.handle})`,
  },
  {
    value: site.google.rating,
    decimals: 1,
    unit: "★",
    label: "de avaliação no Google, em cerca de 1.280 avaliações",
  },
];

const features: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Layers,
    title: "Do básico ao acabamento",
    text: "Materiais de construção, pisos, revestimentos e acabamentos no mesmo lugar — da base da obra aos detalhes finais.",
  },
  {
    icon: Truck,
    title: "Entrega",
    text: "A entrega faz parte do serviço. [Informar área atendida, prazos e como o frete é calculado.]",
  },
  {
    icon: Hammer,
    title: "Instalação",
    text: "A instalação pode ser combinada junto com o material. [Confirmar se é equipe própria ou parceiros.]",
  },
  {
    icon: Store,
    title: `Showroom reformado em ${site.showroomRenovatedIn}`,
    text: "Veja as peças em tamanho real, compare acabamentos lado a lado e tire dúvidas pessoalmente.",
  },
];

export function Highlights() {
  return (
    <section id="diferenciais" aria-labelledby="diferenciais-titulo" className="on-dark relative overflow-hidden bg-brand-800 py-20 text-cream-50 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 size-[30rem] rounded-full bg-brand-500/30 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            tone="dark"
            eyebrow="A loja"
            title={<span id="diferenciais-titulo">Uma loja para a obra inteira</span>}
            lead={`Pisos, revestimentos, materiais de construção e de acabamento, com o atendimento de quem está no ramo há ${site.yearsInBusiness} anos em ${site.city}.`}
          />
          <div data-reveal className="hidden w-56 lg:block">
            {site.images.mascot ? (
              <Image src={site.images.mascot} alt={`Mascote da ${site.name}`} width={224} height={224} className="h-auto w-full" />
            ) : (
              <PlaceholderImage
                label="[mascote da loja]"
                hint="Arte oficial do mascote (vermelho e amarelo)"
                className="aspect-square rounded-3xl text-cream-100"
              />
            )}
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3 lg:mt-16 lg:gap-6">
          {stats.map((s, i) => (
            <li
              key={s.unit}
              data-reveal
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
              className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur-sm sm:p-7"
            >
              <p className="flex items-baseline gap-2 font-display font-extrabold text-gold-400">
                <span className="text-display-2">
                  <Counter value={s.value} decimals={s.decimals} />
                </span>
                <span className="text-display-4 text-gold-300">{s.unit}</span>
              </p>
              <p className="mt-3 text-cream-100/80">{s.label}</p>
              {s.unit === "★" ? <Stars value={site.google.rating} className="mt-3 text-lg text-gold-400" /> : null}
              {s.unit === "mil" ? (
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-200"
                >
                  <InstagramIcon className="size-4" /> Seguir no Instagram
                </a>
              ) : null}
            </li>
          ))}
        </ul>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((f, i) => (
            <li
              key={f.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className="rounded-3xl bg-cream-50 p-6 text-ink-900"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-gold-500 text-ink-900">
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-brand-800">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-600">
                <WithPlaceholders text={f.text} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
