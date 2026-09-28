import { ArrowUpRight, GoogleLogo, InstagramLogo, Quotes, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { DiamondBadge, SectionHeading } from "@/components/brand/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { site } from "@/content/site";
import type { GoogleReviewsData } from "@/lib/google-reviews";
import { swatchStyle, type TextureId } from "@/lib/textures";

const formatRating = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Mosaico decorativo (texturas do catálogo) do bloco do Instagram.
const mosaic: TextureId[] = [
  "porcelanato-madeira-freijo",
  "ladrilho-hidraulico",
  "revestimento-metro-verde",
  "porcelanato-polido-marmorizado",
  "porcelanato-terrazzo",
  "revestimento-sextavado",
];

/**
 * Prova social: só dados reais. A nota/total vêm do Google (API, quando
 * configurada) ou dos números informados pela loja; depoimentos aparecem
 * apenas quando a integração devolve avaliações reais — nunca inventados.
 */
export function SocialProof({ google }: { google: GoogleReviewsData | null }) {
  const rating = google?.rating ?? site.google.rating;
  const count = google?.count ?? site.google.reviewCount;
  const mapsUrl = google?.mapsUrl ?? site.google.mapsUrl;
  const reviews = google?.reviews.slice(0, 3) ?? [];

  return (
    <section id="avaliacoes" aria-labelledby="avaliacoes-titulo" className="surface-dark relative overflow-hidden py-24 sm:py-32">
      <div className="pattern-diamonds pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="avaliacoes-titulo"
          tone="dark"
          eyebrow="Avaliações"
          title="Quem compra, recomenda"
          lead="A reputação construída em mais de duas décadas de atendimento aparece na nota dos clientes no Google."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div data-reveal className="drop-deep">
            <div className="card-dark chamfer chamfer-lg relative flex h-full flex-col overflow-hidden p-8 sm:p-10">
              <span className="diamond absolute -right-16 -top-16 size-56 bg-gold-500/10" aria-hidden="true" />
              <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.18em] text-gold-400">
                <GoogleLogo weight="bold" className="size-5" /> Avaliações no Google
              </p>
              <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
                <p className="font-display text-[5.5rem] font-extrabold leading-none text-cream-50 sm:text-[7rem]">{formatRating(rating)}</p>
                <div className="pb-3">
                  <Stars value={rating} className="text-3xl text-gold-500" />
                  <p className="mt-2 text-lg text-sand">
                    {google ? "" : "cerca de "}
                    <strong className="font-display font-extrabold text-cream-50">{count.toLocaleString("pt-BR")}</strong> avaliações
                  </p>
                </div>
              </div>
              <ul className="mb-9 mt-8 grid gap-3 text-sand sm:grid-cols-2">
                <li className="flex items-center gap-3">
                  <SealCheck weight="fill" className="size-6 shrink-0 text-gold-500" />
                  Nota pública, dada por clientes reais
                </li>
                <li className="flex items-center gap-3">
                  <SealCheck weight="fill" className="size-6 shrink-0 text-gold-500" />
                  {site.yearsInBusiness} anos de loja em {site.city}
                </li>
              </ul>
              <ButtonLink
                href={mapsUrl}
                className="mt-9 self-start lg:mt-auto"
                iconAfter={<ArrowUpRight weight="bold" className="size-5" aria-hidden="true" />}
              >
                Ler as avaliações no Google
              </ButtonLink>
            </div>
          </div>

          {reviews.length > 0 ? (
            <ul className="grid gap-6">
              {reviews.map((r, i) => (
                <li key={`${r.author}-${i}`} data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties} className="drop-deep">
                  <div className="card-dark chamfer p-6">
                    <div className="flex items-center justify-between gap-4">
                      <Stars value={r.rating} className="text-gold-500" />
                      <Quotes weight="fill" className="size-7 text-gold-500/40" />
                    </div>
                    <p className="mt-3 line-clamp-4 text-sand">“{r.text}”</p>
                    <p className="mt-4 text-sm">
                      <a href={r.authorUrl ?? r.url ?? mapsUrl} target="_blank" rel="noopener noreferrer" className="font-display font-bold text-cream-50 hover:text-gold-300">
                        {r.author}
                      </a>
                      <span className="text-sand-muted"> · {r.relativeTime} · Google</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div data-reveal className="drop-deep">
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-dark chamfer chamfer-lg group relative flex h-full flex-col overflow-hidden p-8 sm:p-10"
              >
                <div className="grid grid-cols-3 gap-3" aria-hidden="true">
                  {mosaic.map((t, i) => (
                    <span
                      key={t}
                      className="diamond aspect-square transition-transform duration-500 group-hover:scale-105"
                      style={{ ...swatchStyle(t), transitionDelay: `${i * 40}ms` }}
                    />
                  ))}
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <DiamondBadge>
                    <InstagramLogo weight="bold" className="size-6" />
                  </DiamondBadge>
                  <div>
                    <p className="font-display text-xl font-extrabold text-cream-50">{site.instagram.handle}</p>
                    <p className="text-sand">{site.instagram.followersLabel} seguidores</p>
                  </div>
                </div>
                <p className="mt-6 text-sand">Acompanhe as novidades, os produtos e as obras da loja no Instagram.</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-7 font-display font-bold text-gold-400 group-hover:text-gold-300">
                  Seguir no Instagram <ArrowUpRight weight="bold" className="size-5" aria-hidden="true" />
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
