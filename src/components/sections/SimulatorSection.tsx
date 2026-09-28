import { Simulator } from "@/components/simulator/Simulator";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SimulatorSection() {
  return (
    <section id="simulador" aria-labelledby="simulador-titulo" className="bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Simulador de ambientes"
          title={<span id="simulador-titulo">Veja o piso no ambiente antes de decidir</span>}
          lead="Escolha um ambiente e troque pisos e revestimentos para comparar estilos lado a lado. É o jeito mais rápido de chegar ao showroom sabendo o que você quer."
        />
        <Simulator />
      </div>
    </section>
  );
}
