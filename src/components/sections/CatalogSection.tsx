import { SectionHeading } from "@/components/brand/Brand";
import { Catalog } from "@/components/catalog/Catalog";

export function CatalogSection() {
  return (
    <section id="catalogo" aria-labelledby="catalogo-titulo" className="surface-dark relative overflow-hidden py-24 sm:py-32">
      <div className="pattern-diamonds pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="catalogo-titulo"
          tone="dark"
          eyebrow="Catálogo"
          title="Pisos, revestimentos e acabamentos"
          lead="Filtre por categoria, ambiente e faixa de preço. Passe o mouse sobre um produto para vê-lo aplicado — ou abra direto no simulador."
        />
        <Catalog />
      </div>
    </section>
  );
}
