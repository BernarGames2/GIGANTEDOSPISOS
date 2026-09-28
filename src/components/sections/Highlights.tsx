import { CalendarCheck, InstagramLogo, Stack, Star, Storefront, Truck, Wrench } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { IconBox, SectionHeading } from "@/components/brand/Brand";
import { site } from "@/content/site";

/** Números da loja — sempre os mesmos do hero (vêm de site.ts, sem animação). */
const stats: { value: string; unit: string; label: string; icon: ReactNode; href?: string }[] = [
  {
    value: String(site.yearsInBusiness),
    unit: "anos",
    label: `de mercado em ${site.city}`,
    icon: <CalendarCheck weight="bold" className="size-6" />,
  },
  {
    value: site.instagram.followers,
    unit: "mil",
    label: `seguidores no Instagram ${site.instagram.handle}`,
    icon: <InstagramLogo weight="bold" className="size-6" />,
    href: site.instagram.url,
  },
  {
    value: site.google.ratingLabel,
    unit: "★",
    label: `de nota no Google, com ${site.google.reviewCountLabel}`,
    icon: <Star weight="bold" className="size-6" />,
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
    title: `Showroom reformado em ${site.showroomRenovatedIn}`,
    text: "Veja as peças em tamanho real, compare acabamentos lado a lado e tire dúvidas com a equipe.",
  },
];

export function Highlights() {
  return (
    <section id="diferenciais" aria-labelledby="diferenciais-titulo" className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="diferenciais-titulo"
          eyebrow="A loja"
          title={`${site.yearsInBusiness} anos em ${site.city}, do básico ao acabamento`}
          lead="Tudo o que a obra precisa em um só lugar, com atendimento de quem acompanha cada etapa — da base ao último rodapé."
        />

        <ul data-reveal className="card-light mt-12 grid overflow-hidden rounded-2xl sm:grid-cols-3">
          {stats.map((s) => {
            const inner = (
              <>
                <span className="text-green-700" aria-hidden="true">
                  {s.icon}
                </span>
                <p className="mt-4 flex items-baseline gap-2 font-display font-semibold text-green-900">
                  <span className="text-display-2 tabular-nums">{s.value}</span>
                  <span className="text-display-4 text-gold-800">{s.unit}</span>
                </p>
                <p className="mt-1.5 text-ink-600">{s.label}</p>
              </>
            );
            return (
              <li key={s.unit} className="border-green-900/10 not-first:border-t sm:not-first:border-l sm:not-first:border-t-0">
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full p-7 transition-colors hover:bg-green-900/[0.03] sm:p-8"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="h-full p-7 sm:p-8">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {features.map((f, i) => (
            <li key={f.title} data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
              <IconBox>{f.icon}</IconBox>
              <h3 className="mt-4 font-display text-lg font-semibold text-green-900">{f.title}</h3>
              <p className="mt-2 text-ink-600">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
