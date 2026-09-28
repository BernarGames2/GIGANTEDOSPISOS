import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Placeholder, WithPlaceholders } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whatsappLink } from "@/lib/whatsapp";

function InfoRow({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-800 text-gold-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{title}</p>
        <div className="mt-1 text-ink-900">{children}</div>
      </div>
    </li>
  );
}

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contato"
          title={<span id="contato-titulo">Venha ao showroom ou fale com a gente</span>}
          lead={`Estamos em ${site.city} (${site.state}). Atendimento por telefone, WhatsApp e na loja.`}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div data-reveal className="flex flex-col gap-8">
            <ul className="grid gap-6 sm:grid-cols-2">
              <InfoRow icon={<Phone className="size-5" aria-hidden="true" />} title="Telefone">
                <a href={site.phone.href} className="font-display text-lg font-semibold hover:text-brand-600">
                  {site.phone.display}
                </a>
              </InfoRow>
              <InfoRow icon={<WhatsAppIcon className="size-5" />} title="WhatsApp">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand-600">
                  Iniciar conversa
                </a>
                <p className="text-sm text-ink-500">
                  <WithPlaceholders text={site.whatsapp.display} />
                </p>
              </InfoRow>
              <InfoRow icon={<MapPin className="size-5" aria-hidden="true" />} title="Endereço">
                <p>
                  <WithPlaceholders text={site.address.street} />
                </p>
                <p className="text-sm text-ink-600">
                  {site.address.cityLine} · CEP <Placeholder>{site.address.zip}</Placeholder>
                </p>
              </InfoRow>
              <InfoRow icon={<Clock className="size-5" aria-hidden="true" />} title="Horário de funcionamento">
                <ul className="space-y-0.5 text-sm">
                  {site.hours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-3">
                      <span className="text-ink-600">{h.days}</span>
                      <span className="font-medium">
                        <WithPlaceholders text={h.time} />
                      </span>
                    </li>
                  ))}
                </ul>
              </InfoRow>
            </ul>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={site.instagram.url} variant="outline-dark" icon={<InstagramIcon className="size-4" />}>
                {site.instagram.handle}
              </ButtonLink>
              {site.otherSocials.map((s) => (
                <ButtonLink key={s.url} href={s.url} variant="outline-dark">
                  {s.name}
                </ButtonLink>
              ))}
            </div>
            <ContactForm />
          </div>

          <div data-reveal className="flex flex-col gap-3">
            <div className="relative min-h-80 flex-1 overflow-hidden rounded-3xl bg-cream-200 shadow-soft ring-1 ring-ink-900/5 lg:min-h-[32rem]">
              <iframe
                title={`Mapa: ${site.name} em ${site.city}`}
                src={site.google.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-ink-500">
                <Placeholder>[Confirmar o pino no mapa e trocar pelo embed oficial da ficha no Google]</Placeholder>
              </p>
              <ButtonLink href={site.google.mapsUrl} variant="ghost" icon={<Navigation className="size-4" aria-hidden="true" />}>
                Como chegar
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
