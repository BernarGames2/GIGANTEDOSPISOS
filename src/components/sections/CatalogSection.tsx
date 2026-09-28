import { Catalog } from "@/components/catalog/Catalog";
import { Placeholder } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CatalogSection() {
  return (
    <section id="catalogo" aria-labelledby="catalogo-titulo" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Catálogo"
          title={<span id="catalogo-titulo">Pisos, revestimentos e acabamentos</span>}
          lead={
            <>
              Filtre por categoria, ambiente e faixa de preço. Passe o mouse sobre um item para vê-lo aplicado.{" "}
              <Placeholder>
                [Catálogo demonstrativo: itens, fotos, marcas e preços serão substituídos pelo mix real da loja.]
              </Placeholder>
            </>
          }
        />
        <Catalog />
      </div>
    </section>
  );
}
