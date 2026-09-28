import Link from "next/link";
import { navLinks, site } from "@/content/site";
import { InstagramIcon } from "@/components/ui/icons";
import { Placeholder, WithPlaceholders } from "@/components/ui/Placeholder";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="on-dark bg-brand-950 pb-28 pt-16 text-cream-100/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm">
              {site.tagline}: pisos, revestimentos, materiais de construção e de acabamento em {site.city} há{" "}
              {site.yearsInBusiness} anos.
            </p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cream-50 hover:text-gold-300"
            >
              <InstagramIcon className="size-5" /> {site.instagram.handle}
            </a>
          </div>

          <nav aria-label="Rodapé">
            <p className="font-display text-sm font-semibold text-cream-50">Navegue</p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={`/${l.href}`} className="hover:text-gold-300">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-display text-sm font-semibold text-cream-50">Fale com a loja</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={site.phone.href} className="hover:text-gold-300">
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">
                  WhatsApp
                </a>
              </li>
              <li>
                <WithPlaceholders text={site.address.street} />
              </li>
              <li>{site.address.cityLine}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · <Placeholder>{site.legal.companyName}</Placeholder> · CNPJ{" "}
            <Placeholder>{site.legal.cnpj}</Placeholder>
          </p>
          {site.pitchMode ? (
            <p>
              Proposta de site ·{" "}
              <Link href="/design-system" className="underline decoration-white/30 underline-offset-4 hover:text-gold-300">
                Sistema de design
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
