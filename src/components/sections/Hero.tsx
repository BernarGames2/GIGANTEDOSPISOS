import { ArrowRight, Camera } from "lucide-react";
import Image from "next/image";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Stars } from "@/components/ui/Stars";
import { swatchStyle, type TextureId } from "@/lib/textures";
import { whatsappLink } from "@/lib/whatsapp";

// Mosaico de amostras usado enquanto não houver a foto real do showroom.
const mosaic: TextureId[] = [
  "porcelanato-polido-marmorizado",
  "porcelanato-madeira-freijo",
  "ladrilho-hidraulico",
  "revestimento-metro-verde",
  "porcelanato-terrazzo",
  "porcelanato-cimento-grafite",
  "revestimento-sextavado",
  "vinilico-carvalho-claro",
  "revestimento-filete-pedra",
  "porcelanato-acetinado-areia",
  "revestimento-metro-branco",
  "externo-pedra-antiderrapante",
];

function ShowroomVisual() {
  if (site.images.showroom) {
    return (
      <Image
        src={site.images.showroom}
        alt={`Showroom da ${site.name} em ${site.city}`}
        fill
        priority
        sizes="(min-width: 1280px) 1216px, 100vw"
        className="object-cover"
      />
    );
  }
  return (
    <div className="absolute inset-0 bg-brand-950">
      <div className="absolute inset-3 grid grid-cols-4 grid-rows-3 gap-3 sm:inset-4 sm:grid-cols-6 sm:grid-rows-2 sm:gap-4">
        {mosaic.map((t, i) => (
          <div
            key={t}
            className={i >= 12 ? "hidden" : "rounded-xl opacity-80 shadow-lg ring-1 ring-white/10"}
            style={swatchStyle(t, 1.3)}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(12_26_17/0.35),rgb(12_26_17/0.8))]" />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="max-w-sm rounded-2xl border-2 border-dashed border-gold-400/70 bg-brand-950/75 px-5 py-4 text-center backdrop-blur-sm">
          <Camera className="mx-auto size-6 text-gold-400" aria-hidden="true" />
          <p className="mt-2 font-display font-semibold text-cream-50">[foto do showroom]</p>
          <p className="mt-1 text-xs text-cream-100/75">
            Espaço reservado para a foto real do showroom reformado em {site.showroomRenovatedIn}.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-titulo" className="on-dark relative overflow-hidden bg-brand-800 text-cream-50">
      {/* Grade sutil que lembra juntas de piso */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#faf6ec_1px,transparent_1px),linear-gradient(to_bottom,#faf6ec_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_70%_20%,black,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-brand-500/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="animate-rise font-display text-xs font-semibold uppercase tracking-[0.14em] text-gold-400 sm:text-sm sm:tracking-[0.18em]">
              {site.city} · {site.state} — {site.yearsInBusiness} anos de mercado
            </p>
            <h1
              id="hero-titulo"
              className="mt-5 animate-rise font-display text-display-1 font-extrabold text-balance [animation-delay:80ms]"
            >
              Do básico ao <span className="text-gold-400">acabamento.</span>
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <p className="animate-rise text-lg text-cream-100/85 text-pretty [animation-delay:180ms] sm:text-xl">
              Pisos, revestimentos e materiais de acabamento para a sua obra, em um só lugar. Há {site.yearsInBusiness}{" "}
              anos em {site.city}, com showroom reformado em {site.showroomRenovatedIn} para você ver e comparar as
              peças antes de decidir.
            </p>
            <div className="mt-7 flex animate-rise flex-col gap-3 [animation-delay:260ms] sm:flex-row">
              <ButtonLink href="#simulador" size="lg" icon={<ArrowRight className="size-5 order-last" aria-hidden="true" />}>
                Simular ambiente
              </ButtonLink>
              <ButtonLink
                href={whatsappLink()}
                size="lg"
                variant="outline-light"
                icon={<WhatsAppIcon className="size-5 text-[#4ade80]" />}
              >
                Falar no WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="relative mt-12 animate-rise [animation-delay:340ms] lg:mt-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift ring-1 ring-white/10 sm:aspect-[16/9] lg:aspect-[21/9]">
            <ShowroomVisual />
          </div>

          <ul className="relative z-10 -mt-8 flex flex-col gap-3 px-3 sm:absolute sm:bottom-5 sm:left-5 sm:mt-0 sm:flex-row sm:px-0">
            <li>
              <a
                href={site.google.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink-900 shadow-lift transition hover:-translate-y-0.5"
              >
                <span className="font-display text-2xl font-bold text-brand-800">4,8</span>
                <span className="flex flex-col">
                  <Stars value={site.google.rating} className="text-sm text-gold-500" />
                  <span className="text-xs text-ink-600">~1.280 avaliações no Google</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink-900 shadow-lift transition hover:-translate-y-0.5"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#f0b429,#c6432a)] text-white">
                  <InstagramIcon className="size-5" />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-sm font-semibold">{site.instagram.handle}</span>
                  <span className="text-xs text-ink-600">{site.instagram.followersLabel} seguidores</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
