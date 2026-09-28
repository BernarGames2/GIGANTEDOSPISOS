import { Clock, InstagramLogo, MapPin, NavigationArrow, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { DiamondBadge, SectionHeading } from "@/components/brand/Brand";
import { ContactForm } from "@/components/contact/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";

function InfoCard({ icon, title, children, className }: { icon: ReactNode; title: string; children: ReactNode; className?: string }) {
  return (
    <li className={`drop-deep ${className ?? ""}`}>
      <div className="card-dark chamfer chamfer-sm flex h-full gap-4 p-5">
        <DiamondBadge size="sm">{icon}</DiamondBadge>
        <div className="min-w-0">
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-gold-400">{title}</p>
          <div className="mt-1.5 text-cream-50">{children}</div>
        </div>
      </div>
    </li>
  );
}

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="surface-dark relative overflow-hidden py-24 sm:py-32">
      <div className="pattern-diamonds pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="contato-titulo"
          tone="dark"
          eyebrow="Contato"
          title="Venha ao showroom ou chame no WhatsApp"
          lead={`Estamos em ${site.city} há ${site.yearsInBusiness} anos. Atendimento por telefone, WhatsApp e na loja.`}
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="flex flex-col gap-8">
            <ul data-reveal className="grid gap-5 sm:grid-cols-2">
              <InfoCard icon={<Phone weight="bold" className="size-5" />} title="Telefone">
                <a href={site.phone.href} className="font-display text-xl font-extrabold hover:text-gold-300">
                  {site.phone.display}
                </a>
              </InfoCard>
              <InfoCard icon={<WhatsappLogo weight="bold" className="size-5" />} title="WhatsApp">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-display text-xl font-extrabold hover:text-gold-300">
                  {site.whatsapp.display}
                </a>
              </InfoCard>
              <InfoCard icon={<MapPin weight="bold" className="size-5" />} title="Showroom">
                <p className="font-display text-lg font-extrabold">{site.address.street ?? site.address.cityLine}</p>
                <p className="text-sm text-sand">Reformado em {site.showroomRenovatedIn}</p>
              </InfoCard>
              <InfoCard icon={<Clock weight="bold" className="size-5" />} title="Horário de funcionamento" className="sm:col-span-2">
                <ul className="mt-1 grid gap-x-8 gap-y-1 sm:grid-cols-3">
                  {site.hours.map((h) => (
                    <li key={h.days}>
                      <span className="block text-sm text-sand">{h.days}</span>
                      <span className="font-display font-bold">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </InfoCard>
            </ul>
            <div data-reveal>
              <ContactForm />
            </div>
          </div>

          <div data-reveal className="flex flex-col gap-4">
            <div className="drop-deep flex-1">
              <div className="chamfer chamfer-lg relative h-full min-h-96 bg-gold-500 p-[4px] lg:min-h-[36rem]">
                <div className="chamfer chamfer-lg relative size-full overflow-hidden bg-green-800">
                  {/* Fundo exibido enquanto o mapa carrega (ou se o Google estiver indisponível). */}
                  <div className="pattern-diamonds absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <DiamondBadge size="lg">
                      <MapPin weight="fill" className="size-7" />
                    </DiamondBadge>
                    <p className="font-display text-xl font-extrabold text-cream-50">{site.address.cityLine}</p>
                    <a href={site.google.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-display font-bold text-gold-400 hover:text-gold-300">
                      Abrir no Google Maps
                    </a>
                  </div>
                  <iframe
                    title={`Mapa: ${site.name} em ${site.city}`}
                    src={site.google.mapsEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 size-full border-0"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={site.google.mapsUrl} icon={<NavigationArrow weight="bold" className="size-5" aria-hidden="true" />}>
                Como chegar
              </ButtonLink>
              <ButtonLink href={site.instagram.url} variant="outline-light" icon={<InstagramLogo weight="bold" className="size-5" />}>
                {site.instagram.handle}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
