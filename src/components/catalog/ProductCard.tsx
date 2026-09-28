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
    <div className="drop-deep group h-full transition-transform duration-300 ease-out hover:-translate-y-1.5">
      <article className="card-dark chamfer flex h-full flex-col">
        <div className="chamfer relative aspect-[4/3] overflow-hidden bg-green-950 [--chamfer:22px]">
          {product.texture ? (
            <>
              <div
                className="absolute inset-0 transition duration-700 ease-out group-hover:scale-110 group-hover:opacity-0"
                style={swatchStyle(product.texture)}
              />
              <div className="absolute inset-0 scale-105 opacity-0 transition duration-700 ease-out group-hover:scale-100 group-hover:opacity-100">
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
                className="object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:opacity-0"
              />
              <Image
                src={product.illustration.hoverSrc}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="scale-105 object-cover opacity-0 transition duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
              />
            </>
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_33_21/0.55),transparent_45%)]" />
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-green-950/85 px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-gold-400 backdrop-blur-sm">
            <span className="diamond size-1.5 bg-red-500" aria-hidden="true" />
            {categorySingular[product.category]}
          </span>
        </div>

        <div className="@container flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="font-display text-[1rem] font-bold leading-snug text-cream-50 sm:text-[1.05rem]">{product.name}</h3>
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
            <span className="text-xs uppercase tracking-[0.12em] text-sand-muted">a partir de</span>
            <span className="block font-display text-2xl font-extrabold leading-tight text-gold-400">
              {formatPrice(product.price)}
              <span className="text-sm font-bold text-sand">/{product.unit}</span>
            </span>
          </p>

          <div className="mt-4 flex flex-col gap-2 @[17rem]:flex-row">
            {simulable ? (
              <button
                type="button"
                onClick={() => simulate(product.id)}
                className="btn-gold inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 font-display text-sm font-bold @[17rem]:flex-1"
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
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-sand/30 px-3 font-display text-sm font-bold text-cream-50 transition hover:border-whatsapp hover:bg-whatsapp/15 @[17rem]:flex-1"
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
