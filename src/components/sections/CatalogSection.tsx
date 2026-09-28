import { SectionHeading } from "@/components/brand/Brand";
import { Catalog } from "@/components/catalog/Catalog";

export function CatalogSection() {
  return (
    <section id="catalogo" aria-labelledby="catalogo-titulo" className="border-y border-green-900/[0.06] bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="catalogo-titulo"
          eyebrow="Catálogo"
          title="Pisos, revestimentos e acabamentos"
          lead="Filtre por categoria, ambiente e faixa de preço. No computador, passe o mouse sobre um produto para vê-lo aplicado — ou abra direto no simulador."
        />
        <Catalog />
      </div>
    </section>
  );
}
