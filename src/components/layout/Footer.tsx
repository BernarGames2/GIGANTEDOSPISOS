import { InstagramLogo, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/brand/Brand";
import { navLinks, site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-sand/10 bg-green-950 pb-28 pt-16 text-sand">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo className="h-24" />
            <p className="mt-6 max-w-sm text-sand">
              {site.tagline}: pisos, revestimentos, materiais de construção e acabamento em {site.city} há{" "}
              {site.yearsInBusiness} anos.
            </p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 font-medium text-cream-50 hover:text-gold-300"
            >
              <InstagramLogo weight="bold" className="size-5 text-sand-muted" /> {site.instagram.handle}
            </a>
          </div>

          <nav aria-label="Rodapé">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cream-50">Navegue</p>
            <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={`/${l.href}`} className="text-sand hover:text-cream-50">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cream-50">Fale com a loja</p>
            <ul className="mt-5 space-y-3 text-sand">
              <li>
                <a href={site.phone.href} className="inline-flex items-center gap-2.5 hover:text-cream-50">
                  <Phone weight="bold" className="size-5 text-sand-muted" /> {site.phone.display}
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 hover:text-cream-50">
                  <WhatsappLogo weight="bold" className="size-5 text-sand-muted" /> WhatsApp
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <MapPin weight="bold" className="size-5 text-sand-muted" /> {site.address.cityLine}
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-sand/10 pt-6 text-sm text-sand-muted">
          © {new Date().getFullYear()} {site.name} · {site.address.cityLine} · Há {site.yearsInBusiness} anos do básico ao acabamento
        </p>
      </div>
    </footer>
  );
}
