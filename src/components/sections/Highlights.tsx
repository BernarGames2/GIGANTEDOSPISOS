import { CalendarCheck, InstagramLogo, Stack, Star, Storefront, Truck, Wrench } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { DiamondBadge, DiamondDivider, SectionHeading } from "@/components/brand/Brand";
import { Counter } from "@/components/ui/Counter";
import { site } from "@/content/site";

const stats: { value: number; decimals: number; unit: string; label: string; icon: ReactNode; href?: string }[] = [
  {
    value: site.yearsInBusiness,
    decimals: 0,
    unit: "anos",
    label: `de mercado em ${site.city}`,
    icon: <CalendarCheck weight="bold" className="size-6" />,
  },
  {
    value: site.instagram.followers,
    decimals: 1,
    unit: "mil",
    label: `seguidores no Instagram ${site.instagram.handle}`,
    icon: <InstagramLogo weight="bold" className="size-6" />,
    href: site.instagram.url,
  },
  {
    value: site.google.rating,
    decimals: 1,
    unit: "★",
    label: "de nota no Google, em cerca de 1.280 avaliações",
    icon: <Star weight="fill" className="size-6" />,
    href: site.google.mapsUrl,
  },
];

const features: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <Stack weight="bold" className="size-6" />,
    title: "Do básico ao acabamento",
    text: "Materiais de construção, pisos, revestimentos, argamassas, rejuntes e acabamentos em um só lugar.",
  },
  {
    icon: <Truck weight="bold" className="size-6" />,
    title: "Entrega na obra",
    text: "O material vai até você em Uberlândia e região, com data combinada no orçamento.",
  },
  {
    icon: <Wrench weight="bold" className="size-6" />,
    title: "Instalação",
    text: "Contrate a instalação junto com o material e resolva a obra com um único orçamento.",
  },
  {
    icon: <Storefront weight="bold" className="size-6" />,
    title: `Showroom renovado em ${site.showroomRenovatedIn}`,
    text: "Veja as peças em tamanho real, compare acabamentos lado a lado e tire dúvidas com a equipe.",
  },
];

export function Highlights() {
  return (
    <section id="diferenciais" aria-labelledby="diferenciais-titulo" className="relative overflow-hidden bg-cream-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="diferenciais-titulo"
          eyebrow="A loja"
          title={`${site.yearsInBusiness} anos de ${site.city}, do básico ao acabamento`}
          lead="Tudo o que a obra precisa em um só lugar, com atendimento de quem acompanha cada etapa — da base ao último rodapé."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-3">
          {stats.map((s, i) => {
            const inner = (
              <>
                <DiamondBadge size="sm">{s.icon}</DiamondBadge>
                <p className="mt-6 flex items-baseline gap-2 font-display font-extrabold text-green-900">
                  <span className="text-display-2">
                    <Counter value={s.value} decimals={s.decimals} />
                  </span>
                  <span className="text-display-4 text-gold-800">{s.unit}</span>
                </p>
                <p className="mt-2 text-ink-600">{s.label}</p>
              </>
            );
            return (
              <li
                key={s.unit}
                data-reveal
                style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}
                className="drop-card"
              >
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-light chamfer block h-full p-7 transition-transform duration-300 hover:-translate-y-1"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="card-light chamfer h-full p-7">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <DiamondDivider className="my-16" />

        <ul className="grid gap-x-6 gap-y-12 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <li
              key={f.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className="drop-deep relative"
            >
              <div className="card-dark chamfer h-full px-6 pb-7 pt-12">
                <h3 className="font-display text-lg font-extrabold text-cream-50">{f.title}</h3>
                <p className="mt-2.5 text-sand">{f.text}</p>
              </div>
              <span className="absolute -top-7 left-6">
                <DiamondBadge>{f.icon}</DiamondBadge>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
