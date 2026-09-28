"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import {
  BRAND_PLACEHOLDER,
  categorySingular,
  environmentLabels,
  PRICE_PLACEHOLDER,
  priceTierLabels,
  type Product,
} from "@/content/products";
import { useSimulatorBridge } from "@/components/simulator/SimulatorBridge";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Placeholder } from "@/components/ui/Placeholder";
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
        <div className="absolute inset-x-0 top-[74%] h-[3%] bg-[#f4efe6]" />
        <div className="absolute inset-x-0 bottom-0 h-[23%] bg-[linear-gradient(#c9b89c,#b9a684)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.12),transparent_30%,transparent_70%,rgb(0_0_0/0.1))]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[linear-gradient(#efe9dd,#e0d7c5)] [container-type:inline-size]">
      <div className="absolute inset-x-0 top-[40%] h-[3%] bg-[#f7f3eb] shadow-[0_2px_6px_rgb(0_0_0/0.15)]" />
      <div className="absolute inset-x-0 bottom-0 top-[43%] overflow-hidden [perspective:80cqw] [perspective-origin:50%_0%]">
        <div
          className="absolute -left-[10%] -right-[10%] top-0 h-[75cqw] origin-top [transform:rotateX(62deg)]"
          style={bg(320)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(0_0_0/0.22),transparent_60%)]" />
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { simulate } = useSimulatorBridge();
  const tier = priceTierLabels[product.priceTier];
  const simulable = Boolean(product.texture && product.simulate?.length);
  const previewSurface = product.simulate?.[0] ?? (product.category === "revestimento" ? "wall" : "floor");

  return (
    <article className="group @container flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-within:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-cream-100">
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
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-800 shadow-sm backdrop-blur-sm">
          {categorySingular[product.category]}
        </span>
        <span className="absolute bottom-2 left-2 rounded bg-ink-900/60 px-1.5 py-0.5 text-[10px] font-medium text-cream-50 backdrop-blur-sm">
          [foto real do produto]
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-[0.95rem] font-semibold leading-snug text-ink-900 sm:text-base">{product.name}</h3>
        <p className="mt-1 text-xs text-ink-500 sm:text-sm">
          {product.format} · {product.finish}
        </p>
        <p className="mt-1 text-xs text-ink-500">
          <Placeholder>{BRAND_PLACEHOLDER}</Placeholder>
        </p>
        <p className="mt-3 flex flex-wrap gap-1">
          {product.environments.map((env) => (
            <span key={env} className="rounded-full bg-cream-100 px-2 py-0.5 text-[11px] text-ink-600">
              {environmentLabels[env]}
            </span>
          ))}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p className="text-sm text-ink-700">
            <Placeholder>{PRICE_PLACEHOLDER}</Placeholder>
            <span className="text-ink-500">/{product.unit}</span>
          </p>
          <span
            className="font-display text-sm font-bold text-gold-600"
            title={`Faixa ${tier.label.toLowerCase()} (limites a definir)`}
          >
            {tier.symbol}
            <span className="sr-only"> — faixa {tier.label.toLowerCase()}</span>
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2 @3xs:flex-row">
          {simulable ? (
            <button
              type="button"
              onClick={() => simulate(product.id)}
              className="inline-flex h-10 items-center @3xs:flex-1 justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand-800 px-3 text-xs font-semibold text-cream-50 transition hover:bg-brand-700 sm:text-sm"
            >
              <Eye className="size-4" aria-hidden="true" />
              Simular
            </button>
          ) : null}
          <a
            href={whatsappLink(`Olá! Tenho interesse em: ${product.name} (${product.format}). Pode me passar preço e disponibilidade?`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Pedir orçamento de ${product.name} no WhatsApp`}
            className="inline-flex h-10 items-center @3xs:flex-1 justify-center gap-1.5 whitespace-nowrap rounded-full border border-ink-900/15 px-3 text-xs font-semibold text-ink-900 transition hover:border-whatsapp hover:text-whatsapp-dark sm:text-sm"
          >
            <WhatsAppIcon className="size-4" />
            Orçar
          </a>
        </div>
      </div>
    </article>
  );
}
