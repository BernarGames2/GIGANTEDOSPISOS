import { ArrowRight, InstagramLogo, Star, Storefront, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Eyebrow } from "@/components/brand/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Imagens do hero: ambientes renderizados com produtos do catálogo aplicados
 * (gerados por render/hero.mjs). Não são fotos da loja — trocar pelas fotos
 * reais do showroom quando disponíveis (site.images.showroom).
 */
const heroMain = site.images.showroom ?? "/ambientes/hero-sala.webp";
const heroSecond = "/ambientes/hero-cozinha.webp";

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-titulo" className="surface-dark relative overflow-hidden">
      <div className="pattern-diamonds pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/2 size-[46rem] -translate-y-1/2 rotate-45 border-[3px] border-gold-500/15"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <Eyebrow tone="dark" className="animate-rise">
            {site.city} – {site.state} · {site.yearsInBusiness} anos de mercado
          </Eyebrow>
          <h1
            id="hero-titulo"
            className="mt-6 animate-rise font-display text-display-1 font-extrabold text-cream-50 text-balance [animation-delay:80ms]"
          >
            Do básico ao <span className="text-gold-500">acabamento.</span>
          </h1>
          <p className="mt-7 max-w-xl animate-rise text-lg text-sand text-pretty [animation-delay:160ms] sm:text-xl">
            Pisos, revestimentos e materiais de construção para a obra inteira, em um só lugar. Simule o piso no seu
            ambiente e fale direto com quem entende do assunto há {site.yearsInBusiness} anos em {site.city}.
          </p>
          <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <ButtonLink href="#simulador" size="lg" iconAfter={<ArrowRight weight="bold" className="size-5" aria-hidden="true" />}>
              Simular ambiente
            </ButtonLink>
            <ButtonLink href={whatsappLink()} size="lg" variant="whatsapp" icon={<WhatsappLogo weight="bold" className="size-6" />}>
              Falar no WhatsApp
            </ButtonLink>
          </div>

          <ul className="mt-10 grid animate-rise gap-4 [animation-delay:320ms] sm:grid-cols-3">
            <li>
              <a href={site.google.mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                <span className="flex items-center gap-1 font-display text-3xl font-extrabold text-cream-50">
                  4,8 <Star weight="fill" className="size-6 text-gold-500" />
                </span>
                <span className="whitespace-nowrap text-sm leading-snug text-sand group-hover:text-cream-50">
                  no Google
                  <br />
                  ~1.280 avaliações
                </span>
              </a>
            </li>
            <li>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                <InstagramLogo weight="bold" className="size-8 text-gold-500" />
                <span className="text-sm leading-snug text-sand group-hover:text-cream-50">
                  <strong className="font-display text-base font-extrabold text-cream-50">{site.instagram.followersLabel}</strong>
                  <br />
                  seguidores
                </span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Storefront weight="bold" className="size-8 text-gold-500" />
              <span className="text-sm leading-snug text-sand">
                <strong className="font-display text-base font-extrabold text-cream-50">Showroom</strong>
                <br />
                reformado em {site.showroomRenovatedIn}
              </span>
            </li>
          </ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[34rem] animate-rise [animation-delay:200ms]">
          {/* Losango principal */}
          <div className="drop-deep absolute inset-[6%]">
            <div className="diamond relative size-full bg-gold-500 p-[6px]">
              <div className="diamond relative size-full overflow-hidden">
                <Image
                  src={heroMain}
                  alt="Sala de estar com porcelanato polido marmorizado"
                  fill
                  priority
                  sizes="(min-width: 1024px) 34rem, 90vw"
                  className="origin-[55%_78%] scale-[1.35] object-cover"
                />
              </div>
            </div>
          </div>
          {/* Losango secundário */}
          <div className="drop-deep absolute bottom-[2%] left-[-4%] w-[42%] sm:left-[-8%]">
            <div className="diamond aspect-square bg-cream-50 p-[5px]">
              <div className="diamond relative size-full overflow-hidden">
                <Image src={heroSecond} alt="Cozinha com revestimento metrô verde" fill sizes="16rem" className="origin-[50%_55%] scale-[1.2] object-cover" />
              </div>
            </div>
          </div>
          <span className="diamond absolute right-[4%] top-[4%] size-10 bg-red-500 shadow-lg" aria-hidden="true" />
          <span className="diamond absolute right-[14%] top-[1%] size-5 bg-gold-500" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
