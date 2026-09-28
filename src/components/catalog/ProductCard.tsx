"use client";

import { Eye, WhatsappLogo } from "@phosphor-icons/react";
import Image from "next/image";
import { useSimulatorBridge } from "@/components/simulator/SimulatorBridge";
import { categorySingular, environmentLabels, formatPrice, type Product } from "@/content/products";
import { getTexture, swatchStyle, type TextureId } from "@/lib/textures";
import { whatsappLink } from "@/lib/whatsapp";

/** Segunda imagem (hover): o material aplicado em um mini-ambiente. */
function AppliedPreview({ texture, surface }: { texture: TextureId; surface: "floor" | "wall" }) {
  const t = getTexture(texture);
  const bg = (spanCm: number) => ({
    backgroundImage: `url(${t.src})`,
    backgroundSize: `${(t.widthCm / spanCm) * 100}% auto`,
    backgroundRepeat: "repeat",
  });

  if (surface === "wall") {
    return (
      <div className="absolute inset-0 [container-type:inline-size]">
        <div className="absolute inset-x-0 top-0 h-[74%]" style={bg(130)} />
        <div className="absolute inset-x-0 top-[74%] h-[3%] bg-cream-50" />
        <div className="absolute inset-x-0 bottom-0 h-[23%] bg-[linear-gradient(#b79c78,#9e8363)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(11_33_21/0.18),transparent_35%,transparent_70%,rgb(11_33_21/0.22))]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[linear-gradient(#ece4d4,#ddd2bd)] [container-type:inline-size]">
      <div className="absolute inset-x-0 top-[40%] h-[3%] bg-cream-50 shadow-[0_2px_6px_rgb(11_33_21/0.2)]" />
      <div className="absolute inset-x-0 bottom-0 top-[43%] overflow-hidden [perspective:80cqw] [perspective-origin:50%_0%]">
        <div className="absolute -left-[10%] -right-[10%] top-0 h-[75cqw] origin-top [transform:rotateX(62deg)]" style={bg(320)} />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(11_33_21/0.28),transparent_65%)]" />
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { simulate } = useSimulatorBridge();
  const simulable = Boolean(product.texture && product.simulate?.length);
  const previewSurface = product.simulate?.[0] ?? (product.category === "revestimento" ? "wall" : "floor");

  return (
    <div className="group h-full">
      {/* Celular: miniatura à esquerda (lista compacta). A partir de 480 px: card vertical. */}
      <article className="card-dark grid h-full grid-cols-[7rem_minmax(0,1fr)] overflow-hidden rounded-2xl ring-1 ring-sand/5 transition-shadow duration-300 group-hover:ring-sand/20 min-[480px]:flex min-[480px]:flex-col">
        <div className="relative min-h-full overflow-hidden bg-green-950 min-[480px]:aspect-[4/3] min-[480px]:min-h-0">
          {product.texture ? (
            <>
              <div
                className="absolute inset-0 transition-opacity duration-500 ease-out group-hover:opacity-0"
                style={swatchStyle(product.texture)}
              />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
                <AppliedPreview texture={product.texture} surface={previewSurface} />
              </div>
            </>
          ) : product.illustration ? (
            <>
              <Image
                src={product.illustration.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-opacity duration-500 ease-out group-hover:opacity-0"
              />
              <Image
                src={product.illustration.hoverSrc}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
            </>
          ) : null}
          <span className="absolute left-2 top-2 rounded-md bg-green-950/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-sand backdrop-blur-sm min-[480px]:left-3 min-[480px]:top-3 min-[480px]:px-2.5 min-[480px]:text-[11px] min-[480px]:tracking-[0.1em]">
            {categorySingular[product.category]}
          </span>
        </div>

        <div className="@container flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="font-display text-[1rem] font-semibold leading-snug text-cream-50 sm:text-[1.05rem]">{product.name}</h3>
          <p className="mt-1 text-sm text-sand">
            {product.format} · {product.finish}
          </p>
          <p className="mt-3 flex flex-wrap gap-1.5">
            {product.environments.map((env) => (
              <span key={env} className="rounded bg-green-950/60 px-2 py-0.5 text-[11px] font-medium text-sand">
                {environmentLabels[env]}
              </span>
            ))}
          </p>

          <p className="mt-auto pt-5 text-sand">
            <span className="text-xs uppercase tracking-[0.1em] text-sand-muted">a partir de</span>
            <span className="block font-display text-[1.375rem] font-semibold leading-tight text-cream-50">
              {formatPrice(product.price)}
              <span className="text-sm font-medium text-sand">/{product.unit}</span>
            </span>
          </p>

          <div className="mt-4 flex flex-col gap-2 @[17rem]:flex-row">
            {simulable ? (
              <button
                type="button"
                onClick={() => simulate(product.id)}
                className="btn-cream inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 font-display text-sm font-semibold transition-colors @[17rem]:flex-1"
              >
                <Eye weight="bold" className="size-5" aria-hidden="true" />
                Ver no ambiente
              </button>
            ) : null}
            <a
              href={whatsappLink(`Olá! Tenho interesse em: ${product.name} (${product.format}). Pode me passar preço e disponibilidade?`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Pedir orçamento de ${product.name} no WhatsApp`}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-sand/35 px-3 font-display text-sm font-semibold text-cream-50 transition-colors hover:border-sand/70 hover:bg-cream-50/5 @[17rem]:flex-1"
            >
              <WhatsappLogo weight="bold" className="size-5" />
              Orçar
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
