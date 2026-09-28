import { SectionHeading } from "@/components/brand/Brand";
import { Simulator } from "@/components/simulator/Simulator";

export function SimulatorSection() {
  return (
    <section id="simulador" aria-labelledby="simulador-titulo" className="relative bg-cream-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="simulador-titulo"
          eyebrow="Simulador de ambientes"
          title="Veja o piso no ambiente antes de comprar"
          lead="Escolha o ambiente, troque o piso e o revestimento da parede e compare as combinações antes de visitar a loja."
        />
        <Simulator />
      </div>
    </section>
  );
}
