import { site } from "@/content/site";

/** Link para conversa no WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(message: string = site.whatsapp.defaultMessage) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
