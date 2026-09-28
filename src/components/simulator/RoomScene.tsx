"use client";
/* eslint-disable @next/next/no-img-element -- camadas de composição alinhadas pixel a pixel (tamanho fixo, com blend e máscara); next/image não se aplica */

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Environment } from "@/content/products";
import { getProduct } from "@/content/products";
import { Crossfade } from "@/components/motion/Crossfade";
import { getTexture, type TextureId } from "@/lib/textures";
import { rectToQuadTransform, SURFACE_PX_PER_CM } from "./geometry";
import { sceneAsset, scenes, type LayerName, type ScenePlane } from "./scenes";

/** Textura do produto em escala real, projetada na superfície. */
function PlaneLayer({ plane, texture }: { plane: ScenePlane; texture: TextureId }) {
  const t = getTexture(texture);
  const w = plane.widthCm * SURFACE_PX_PER_CM;
  const h = plane.heightCm * SURFACE_PX_PER_CM;
  const style: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: w,
    height: h,
    transformOrigin: "0 0",
    transform: rectToQuadTransform(w, h, plane.quad),
    backgroundImage: `url(${t.src})`,
    backgroundSize: `${t.widthCm * SURFACE_PX_PER_CM}px ${t.heightCm * SURFACE_PX_PER_CM}px`,
    backgroundPosition: plane.align,
    backgroundRepeat: "repeat",
  };
  return <div style={style} />;
}

function Layer({ src, blend, opacity }: { src: string; blend?: CSSProperties["mixBlendMode"]; opacity?: number }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      decoding="async"
      className="pointer-events-none absolute inset-0 size-full select-none"
      style={{ mixBlendMode: blend, opacity }}
    />
  );
}

function Masked({ mask, children }: { mask: string; children: ReactNode }) {
  const m = `url(${mask})`;
  return (
    <div
      className="absolute inset-0"
      style={{ maskImage: m, WebkitMaskImage: m, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", maskRepeat: "no-repeat" }}
    >
      {children}
    </div>
  );
}

/**
 * Ambiente com o piso/revestimento aplicado. Camadas (de baixo para cima):
 * render base → parede (textura × sombra + luz) → piso (textura × sombra +
 * luz + reflexo conforme o brilho) → móveis e objetos (render recortado).
 */
export function RoomScene({ room, floor, wall }: { room: Environment; floor: string; wall: string | null }) {
  const data = scenes[room];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<{ scale: number; small: boolean } | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const scale = el.clientWidth / data.width;
      // Camadas de 960 px quando a cena aparece pequena (celular): menos memória de GPU.
      setView({ scale, small: el.clientWidth * (window.devicePixelRatio || 1) <= 1150 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data.width]);

  const small = view?.small ?? false;
  const src = (layer: LayerName) => sceneAsset(room, layer, small);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-green-900">
      {view ? (
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: data.width, height: data.height, transform: `scale(${view.scale})` }}
        >
          <Layer src={src("beauty")} />

          <Masked mask={src("wall-mask")}>
            <Crossfade
              value={wall ?? "pintura"}
              duration={0.55}
              render={(id) => {
                const texture = id === "pintura" ? undefined : getProduct(id)?.texture;
                if (!texture) return <Layer src={src("beauty")} />;
                return (
                  <div className="absolute inset-0 isolate">
                    {data.wallSurfaces.map((wid) => (
                      <PlaneLayer key={wid} plane={data.planes[wid]} texture={texture} />
                    ))}
                    <Layer src={src("shade")} blend="multiply" />
                    <Layer src={src("light")} blend="screen" opacity={0.85} />
                  </div>
                );
              }}
            />
          </Masked>

          <Masked mask={src("floor-mask")}>
            <Crossfade
              value={floor}
              duration={0.55}
              render={(id) => {
                const p = getProduct(id);
                if (!p?.texture) return <Layer src={src("beauty")} />;
                const gloss = p.gloss ?? 0.3;
                return (
                  <div className="absolute inset-0 isolate">
                    <PlaneLayer plane={data.planes.floor} texture={p.texture} />
                    <Layer src={src("shade")} blend="multiply" />
                    <Layer src={src("light")} blend="screen" opacity={0.9} />
                    {gloss > 0.05 ? (
                      <Layer src={src(gloss >= 0.8 ? "refl" : "refl-soft")} blend="screen" opacity={Math.min(1, 0.2 + gloss * 0.8)} />
                    ) : null}
                  </div>
                );
              }}
            />
          </Masked>

          <Layer src={src("fg")} />
        </div>
      ) : null}
    </div>
  );
}
