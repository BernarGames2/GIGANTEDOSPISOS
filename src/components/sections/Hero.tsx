import { ArrowRight, Star, Storefront, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Imagens do hero: ambientes renderizados com produtos do catálogo aplicados
 * (gerados por render/hero.mjs). Não são fotos da loja — por isso levam o
 * selo "Imagem ilustrativa". Trocar pelas fotos reais do showroom quando
 * disponíveis (site.images.showroom).
 */
const heroMain = site.images.showroom ?? "/ambientes/hero-sala.webp";
const heroSecond = "/ambientes/hero-cozinha.webp";

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-titulo" className="surface-dark relative overflow-hidden">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          {/* Selo de destaque: o vermelho do mascote como segundo acento da marca. */}
          <p className="inline-flex animate-rise items-center gap-2 rounded-full bg-red-500 py-1.5 pl-3 pr-4 text-[0.8125rem] font-semibold text-cream-50 shadow-[0_6px_16px_-8px_rgb(198_67_42/0.8)]">
            <Storefront weight="fill" className="size-4" aria-hidden="true" />
            Showroom reformado em {site.showroomRenovatedIn}
          </p>
          <h1
            id="hero-titulo"
            className="mt-5 animate-rise font-display text-display-1 font-semibold text-cream-50 text-balance [animation-delay:60ms]"
          >
            Do básico ao <span className="text-gold-400">acabamento.</span>
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg text-sand text-pretty [animation-delay:120ms] sm:text-xl sm:leading-relaxed">
            Pisos, revestimentos e materiais de construção para a obra inteira, em {site.city} – {site.state}. Veja o
            piso aplicado no ambiente e fale direto com a equipe da loja.
          </p>
          <div className="mt-8 flex animate-rise flex-col gap-3 [animation-delay:180ms] sm:flex-row">
            <ButtonLink href="#simulador" size="lg" iconAfter={<ArrowRight weight="bold" className="size-5" aria-hidden="true" />}>
              Simular ambiente
            </ButtonLink>
            <ButtonLink
              href={whatsappLink()}
              size="lg"
              variant="outline-light"
              icon={<WhatsappLogo weight="fill" className="size-6 text-[#3fd17a]" aria-hidden="true" />}
            >
              Falar no WhatsApp
            </ButtonLink>
          </div>

          <dl className="mt-10 grid animate-rise grid-cols-1 gap-y-4 border-t border-sand/15 pt-7 [animation-delay:240ms] min-[440px]:grid-cols-3 min-[440px]:divide-x min-[440px]:divide-sand/15">
            <div className="flex items-baseline gap-3 min-[440px]:block min-[440px]:pr-5">
              <dt className="sr-only">Tempo de mercado</dt>
              <dd className="font-display text-2xl font-semibold text-cream-50 sm:text-[1.75rem]">{site.yearsInBusiness} anos</dd>
              <dd className="text-sm text-sand min-[440px]:mt-1">de mercado em {site.city}</dd>
            </div>
            <div className="flex items-baseline gap-3 min-[440px]:block min-[440px]:px-5">
              <dt className="sr-only">Nota no Google</dt>
              <dd className="flex items-center gap-1.5 font-display text-2xl font-semibold text-cream-50 sm:text-[1.75rem]">
                {site.google.ratingLabel}
                <Star weight="fill" className="size-5 text-gold-400" aria-hidden="true" />
                <span className="sr-only">estrelas</span>
              </dd>
              <dd className="text-sm text-sand min-[440px]:mt-1">
                <a href={site.google.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-cream-50 hover:underline">
                  no Google, {site.google.reviewCountLabel}
                </a>
              </dd>
            </div>
            <div className="flex items-baseline gap-3 min-[440px]:block min-[440px]:pl-5">
              <dt className="sr-only">Instagram</dt>
              <dd className="font-display text-2xl font-semibold text-cream-50 sm:text-[1.75rem]">{site.instagram.followersLabel}</dd>
              <dd className="text-sm text-sand min-[440px]:mt-1">
                <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-cream-50 hover:underline">
                  seguidores no Instagram
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative animate-rise pb-10 [animation-delay:120ms] sm:pb-12 lg:pb-14">
          <figure className="relative m-0 overflow-hidden rounded-2xl shadow-[var(--shadow-deep)] ring-1 ring-sand/10">
            <div className="relative aspect-[4/3]">
              <Image
                src={heroMain}
                alt="Sala de estar com porcelanato polido marmorizado (imagem ilustrativa)"
                fill
                priority
                sizes="(min-width: 1024px) 38rem, 92vw"
                className="object-cover object-[50%_70%]"
              />
            </div>
            {site.images.showroom ? null : (
              <figcaption className="absolute right-3 top-3 rounded-md bg-green-950/75 px-2.5 py-1 text-xs font-medium text-sand backdrop-blur-sm">
                Imagem ilustrativa
              </figcaption>
            )}
          </figure>
          <div className="absolute bottom-0 left-4 w-[44%] overflow-hidden rounded-xl shadow-[var(--shadow-deep)] ring-4 ring-green-900 sm:left-6 lg:-left-8">
            <div className="relative aspect-[4/3]">
              <Image
                src={heroSecond}
                alt="Cozinha com revestimento metrô verde (imagem ilustrativa)"
                fill
                sizes="(min-width: 1024px) 17rem, 44vw"
                className="object-cover object-[50%_55%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
