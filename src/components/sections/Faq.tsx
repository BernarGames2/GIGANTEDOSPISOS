import { faq } from "@/content/faq";
import { FaqList } from "@/components/faq/FaqList";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { WithPlaceholders } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whatsappLink } from "@/lib/whatsapp";

export function Faq() {
  const items = faq.map((f) => ({
    question: f.question,
    answer: f.answer.map((paragraph) => (
      <p key={paragraph}>
        <WithPlaceholders text={paragraph} />
      </p>
    )),
  }));

  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title={<span id="duvidas-titulo">Entrega, instalação, pagamento e prazos</span>}
            lead="As respostas para o que mais perguntam antes de fechar a compra."
          />
          <div data-reveal className="mt-8 rounded-3xl bg-brand-800 p-6 text-cream-50">
            <p className="font-display text-lg font-semibold">Não achou a sua dúvida?</p>
            <p className="mt-1 text-sm text-cream-100/80">Mande uma mensagem e fale direto com a equipe.</p>
            <ButtonLink
              href={whatsappLink("Olá! Tenho uma dúvida sobre produtos/serviços da loja.")}
              variant="whatsapp"
              className="mt-5"
              icon={<WhatsAppIcon className="size-5" />}
            >
              Perguntar no WhatsApp
            </ButtonLink>
          </div>
        </div>
        <div data-reveal>
          <FaqList items={items} />
        </div>
      </div>
    </section>
  );
}
