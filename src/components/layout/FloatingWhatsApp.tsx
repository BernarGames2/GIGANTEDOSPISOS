import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { whatsappLink } from "@/lib/whatsapp";

/** Botão fixo de WhatsApp. A pulsação é CSS puro, limitada e desligada em movimento reduzido. */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Gigante dos Pisos no WhatsApp"
      className="group fixed bottom-4 right-4 z-50 flex items-center gap-3 sm:bottom-7 sm:right-7"
    >
      <span className="card-light pointer-events-none hidden translate-x-2 rounded-lg px-4 py-2.5 font-display text-sm font-semibold opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
        Fale com a gente
      </span>
      <span className="btn-whatsapp relative flex size-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 sm:size-16">
        <span className="wa-ring absolute inset-0 rounded-full bg-whatsapp opacity-0" aria-hidden="true" />
        <WhatsappLogo weight="fill" className="relative size-8" />
      </span>
    </a>
  );
}
