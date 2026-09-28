import { ArrowUpRight, GoogleLogo } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/brand/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { site } from "@/content/site";
import type { GoogleReviewsData } from "@/lib/google-reviews";

/**
 * Prova social: só dados reais. A nota e o total de avaliações são os números
 * da loja em site.ts (os mesmos do resto do site). Depoimentos só aparecem
 * quando a integração com o Google devolve avaliações reais — texto e autor
 * exatamente como estão no Google, nunca inventados ou editados.
 */
export function SocialProof({ google }: { google: GoogleReviewsData | null }) {
  const mapsUrl = google?.mapsUrl ?? site.google.mapsUrl;
  const reviews = (google?.reviews ?? []).filter((r) => r.rating >= 4).slice(0, 3);

  return (
    <section id="avaliacoes" aria-labelledby="avaliacoes-titulo" className="surface-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="avaliacoes-titulo"
          tone="dark"
          eyebrow="Avaliações"
          title="A nota de quem já comprou na loja"
          lead="Avaliação pública no Google, dada por clientes da loja."
        />

        <div data-reveal className="card-dark mt-12 grid gap-8 rounded-2xl p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-sand-muted">
              <GoogleLogo weight="bold" className="size-5" aria-hidden="true" /> Google
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2">
              <p className="font-display text-[4.5rem] font-semibold leading-none text-cream-50 sm:text-[5.5rem]">
                {site.google.ratingLabel}
                <span className="sr-only"> de 5 estrelas</span>
              </p>
              <div className="pb-2">
                <Stars value={site.google.rating} className="text-2xl text-gold-400" />
                <p className="mt-1.5 text-sand">{site.google.reviewCountLabel}</p>
              </div>
            </div>
          </div>

          <div className="border-sand/15 lg:border-l lg:pl-16">
            <p className="max-w-xl text-lg text-sand text-pretty">
              São {site.yearsInBusiness} anos atendendo {site.city} e região. A nota média da loja no Google Maps é{" "}
              <strong className="font-semibold text-cream-50">{site.google.ratingLabel} de 5</strong>, com{" "}
              {site.google.reviewCountLabel} de clientes.
            </p>
            <ButtonLink
              href={mapsUrl}
              variant="outline-light"
              className="mt-7 w-full max-sm:h-auto max-sm:min-h-12 max-sm:whitespace-normal max-sm:py-3 sm:w-auto"
              iconAfter={<ArrowUpRight weight="bold" className="size-5" aria-hidden="true" />}
            >
              Ler as avaliações no Google
            </ButtonLink>
          </div>
        </div>

        {reviews.length > 0 ? (
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <li
                key={`${r.author}-${i}`}
                data-reveal
                style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}
                className="card-dark flex flex-col rounded-2xl p-6"
              >
                <Stars value={r.rating} className="text-gold-400" />
                <blockquote className="mt-3 line-clamp-5 text-sand">“{r.text}”</blockquote>
                <p className="mt-auto pt-4 text-sm">
                  <a
                    href={r.authorUrl ?? r.url ?? mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-cream-50 hover:text-gold-300"
                  >
                    {r.author}
                  </a>
                  <span className="text-sand-muted"> · {r.relativeTime} · avaliação no Google</span>
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
