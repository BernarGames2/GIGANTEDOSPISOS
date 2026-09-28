import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { DiamondBadge, Eyebrow } from "@/components/brand/Brand";
import { FaqList } from "@/components/faq/FaqList";
import { ButtonLink } from "@/components/ui/Button";
import { faq } from "@/content/faq";
import { whatsappLink } from "@/lib/whatsapp";

export function Faq() {
  const items = faq.map((f) => ({
    question: f.question,
    answer: f.answer.map((paragraph) => <p key={paragraph}>{paragraph}</p>),
  }));

  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="bg-cream-50 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.5fr] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div data-reveal>
            <Eyebrow>Dúvidas frequentes</Eyebrow>
            <h2 id="duvidas-titulo" className="mt-4 font-display text-display-2 font-extrabold text-green-900 text-balance">
              Antes de fechar a sua obra
            </h2>
            <p className="mt-5 text-lg text-ink-600">Entrega, instalação, pagamento e prazos — respondidos sem enrolação.</p>
          </div>
          <div data-reveal className="drop-deep mt-10">
            <div className="card-dark chamfer p-7">
              <DiamondBadge size="sm">
                <WhatsappLogo weight="bold" className="size-5" />
              </DiamondBadge>
              <p className="mt-5 font-display text-xl font-extrabold text-cream-50">Ficou alguma dúvida?</p>
              <p className="mt-1 text-sand">Fale direto com a equipe da loja.</p>
              <ButtonLink
                href={whatsappLink("Olá! Tenho uma dúvida sobre produtos/serviços da loja.")}
                variant="whatsapp"
                className="mt-6 w-full sm:w-auto"
                icon={<WhatsappLogo weight="bold" className="size-5" />}
              >
                Perguntar no WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
        <div data-reveal>
          <FaqList items={items} />
        </div>
      </div>
    </section>
  );
}
