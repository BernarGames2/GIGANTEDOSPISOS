import { ArrowUpRight, Images, Quote } from "lucide-react";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import { Placeholder, PlaceholderImage } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { cn } from "@/lib/cn";
import type { GoogleReviewsData } from "@/lib/google-reviews";

const formatRating = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function SocialProof({ google }: { google: GoogleReviewsData | null }) {
  const rating = google?.rating ?? site.google.rating;
  const count = google?.count ?? site.google.reviewCount;
  const mapsUrl = google?.mapsUrl ?? site.google.mapsUrl;
  const reviews = google?.reviews ?? [];

  return (
    <section id="avaliacoes" aria-labelledby="avaliacoes-titulo" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Quem já comprou"
          title={<span id="avaliacoes-titulo">A opinião de quem já passou pela loja</span>}
          lead="Avaliações publicadas por clientes no Google e obras entregues com materiais da loja."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[340px_1fr] lg:gap-8">
          <div data-reveal className="flex flex-col rounded-3xl bg-brand-800 p-7 text-cream-50 shadow-lift">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-400">Google</p>
            <p className="mt-4 font-display text-[4.5rem] font-extrabold leading-none">{formatRating(rating)}</p>
            <Stars value={rating} className="mt-3 text-2xl text-gold-400" />
            <p className="mt-3 text-cream-100/80">
              {google ? "" : "cerca de "}
              {count.toLocaleString("pt-BR")} avaliações
            </p>
            <p className="mt-1 text-xs text-cream-100/60">
              {google
                ? "Dados do Google, atualizados diariamente."
                : "Dados de set/2026. Com a integração ativa, a nota passa a ser atualizada automaticamente."}
            </p>
            <ButtonLink
              href={mapsUrl}
              variant="primary"
              className="mt-8"
              icon={<ArrowUpRight className="order-last size-4" aria-hidden="true" />}
            >
              Ver avaliações no Google
            </ButtonLink>
          </div>

          <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {reviews.length > 0
              ? reviews.slice(0, 3).map((r, i) => (
                  <li
                    key={`${r.author}-${i}`}
                    data-reveal
                    style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
                    className="flex flex-col rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink-900/5"
                  >
                    <Stars value={r.rating} className="text-gold-500" />
                    <p className="mt-4 line-clamp-6 text-ink-700">“{r.text}”</p>
                    <div className="mt-auto flex items-center gap-3 pt-6">
                      {r.authorPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element -- foto servida pelo Google, exibida como fornecida
                        <img src={r.authorPhoto} alt="" width={36} height={36} className="size-9 rounded-full" loading="lazy" referrerPolicy="no-referrer" />
                      ) : null}
                      <div className="text-sm">
                        <a href={r.authorUrl ?? r.url ?? mapsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink-900 hover:underline">
                          {r.author}
                        </a>
                        <p className="text-ink-500">
                          {r.relativeTime} · no Google
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              : [0, 1, 2].map((i) => (
                  <li
                    key={i}
                    data-reveal
                    style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
                    className="flex flex-col rounded-3xl border-2 border-dashed border-cream-300 bg-white/60 p-6"
                  >
                    <Quote className="size-7 text-cream-300" aria-hidden="true" />
                    <p className="mt-4 text-ink-600">
                      <Placeholder>[Avaliação real publicada no Google — texto integral, sem edição]</Placeholder>
                    </p>
                    <div className="mt-auto pt-6 text-sm">
                      <p className="font-semibold text-ink-700">
                        <Placeholder>[nome do cliente]</Placeholder>
                      </p>
                      <p className="mt-1 text-ink-500">
                        <Placeholder>[data]</Placeholder> · no Google
                      </p>
                    </div>
                  </li>
                ))}
          </ul>
        </div>

        <div className="mt-20">
          <div data-reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h3 className="font-display text-display-4 font-bold text-brand-800">Obras e ambientes entregues</h3>
              <p className="mt-2 max-w-xl text-ink-600">
                Fotos de projetos reais feitos com materiais da loja — publicadas com autorização dos clientes.
              </p>
            </div>
            <ButtonLink
              href={site.instagram.url}
              variant="outline-dark"
              icon={<InstagramIcon className="size-4" />}
            >
              Mais no Instagram
            </ButtonLink>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
            {Array.from({ length: 5 }, (_, i) => (
              <li
                key={i}
                data-reveal
                style={{ "--reveal-delay": `${(i % 4) * 80}ms` } as React.CSSProperties}
                className={cn(i === 0 && "col-span-2 row-span-2")}
              >
                <PlaceholderImage
                  label="[foto de obra entregue]"
                  hint={i === 0 ? "Enviada pela loja ou autorizada pelo cliente — nunca banco de imagens" : undefined}
                  icon={<Images className="size-6 text-ink-300" aria-hidden="true" />}
                  className={cn("h-full rounded-2xl text-ink-500", i === 0 ? "min-h-64 sm:min-h-96" : "min-h-36 sm:min-h-44")}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
