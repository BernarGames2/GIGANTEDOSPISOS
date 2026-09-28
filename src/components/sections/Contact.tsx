import { Clock, InstagramLogo, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { IconBox, SectionHeading } from "@/components/brand/Brand";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapCard } from "@/components/contact/MapCard";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";

function InfoCard({ icon, title, children, className }: { icon: ReactNode; title: string; children: ReactNode; className?: string }) {
  return (
    <li className={className}>
      <div className="card-dark flex h-full gap-4 rounded-xl p-5">
        <IconBox tone="dark">{icon}</IconBox>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sand-muted">{title}</p>
          <div className="mt-1.5 text-cream-50">{children}</div>
        </div>
      </div>
    </li>
  );
}

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="surface-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="contato-titulo"
          tone="dark"
          eyebrow="Contato"
          title="Venha ao showroom ou chame no WhatsApp"
          lead={`Estamos em ${site.city} há ${site.yearsInBusiness} anos. Atendimento por telefone, WhatsApp e na loja.`}
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="flex flex-col gap-8">
            <ul data-reveal className="grid gap-5 sm:grid-cols-2">
              <InfoCard icon={<Phone weight="bold" className="size-5" />} title="Telefone">
                <a href={site.phone.href} className="font-display text-xl font-semibold hover:text-gold-300">
                  {site.phone.display}
                </a>
              </InfoCard>
              <InfoCard icon={<WhatsappLogo weight="bold" className="size-5" />} title="WhatsApp">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-display text-xl font-semibold hover:text-gold-300">
                  {site.whatsapp.display}
                </a>
              </InfoCard>
              <InfoCard icon={<MapPin weight="bold" className="size-5" />} title="Showroom" className="sm:col-span-2">
                <p className="font-display text-lg font-semibold">{site.address.street ?? site.address.cityLine}</p>
                <p className="text-sm text-sand">Reformado em {site.showroomRenovatedIn}</p>
              </InfoCard>
              <InfoCard icon={<Clock weight="bold" className="size-5" />} title="Horário de funcionamento" className="sm:col-span-2">
                <ul className="mt-1 grid gap-x-8 gap-y-1 sm:grid-cols-3">
                  {site.hours.map((h) => (
                    <li key={h.days}>
                      <span className="block text-sm text-sand">{h.days}</span>
                      <span className="font-display font-semibold">{h.time}</span>
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
            <MapCard />
            <div className="flex flex-wrap gap-3">
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
