import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/whatsapp";

/** Botão fixo de WhatsApp. A pulsação é CSS puro, limitada e desligada em movimento reduzido. */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Gigante dos Pisos no WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-7 sm:right-7"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-900 opacity-0 shadow-lift transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
        Fale com a gente
      </span>
      <span className="relative flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-transform duration-300 group-hover:scale-105 sm:size-16">
        <span className="wa-ring absolute inset-0 rounded-full bg-whatsapp opacity-0" aria-hidden="true" />
        <WhatsAppIcon className="relative size-7 sm:size-8" />
      </span>
    </a>
  );
}
