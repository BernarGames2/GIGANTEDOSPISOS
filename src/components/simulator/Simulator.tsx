"use client";
/* eslint-disable @next/next/no-img-element -- miniaturas pequenas e estáticas dos renders */

import { PaintRoller, Scan, WhatsappLogo } from "@phosphor-icons/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { DiamondBadge } from "@/components/brand/Brand";
import { Crossfade } from "@/components/motion/Crossfade";
import { useCalmMotion } from "@/components/motion/use-lite-mode";
import { ButtonLink } from "@/components/ui/Button";
import {
  environmentLabels,
  formatPrice,
  getProduct,
  products,
  type Environment,
  type Product,
  type Surface,
} from "@/content/products";
import { cn } from "@/lib/cn";
import { swatchStyle } from "@/lib/textures";
import { whatsappLink } from "@/lib/whatsapp";
import { RoomScene } from "./RoomScene";
import { sceneAsset, sceneInfo, scenes } from "./scenes";
import { useSimulatorBridge } from "./SimulatorBridge";

type Choices = Record<Environment, { floor: string; wall: string | null }>;

const initialChoices = () =>
  Object.fromEntries(sceneInfo.map((r) => [r.id, { ...r.defaults }])) as Choices;

function optionsFor(room: Environment, surface: Surface) {
  return products.filter((p) => p.texture && p.simulate?.includes(surface) && p.environments.includes(room));
}

export function Simulator() {
  const { request } = useSimulatorBridge();
  const calm = useCalmMotion();
  const [roomId, setRoomId] = useState<Environment>("sala");
  const [surface, setSurface] = useState<Surface>("floor");
  const [choices, setChoices] = useState<Choices>(initialChoices);
  const [handledNonce, setHandledNonce] = useState(0);

  // Pedido vindo do catálogo ("Ver no ambiente").
  if (request && request.nonce !== handledNonce) {
    setHandledNonce(request.nonce);
    const p = getProduct(request.productId);
    if (p?.texture && p.simulate?.length) {
      const nextRoom = p.environments.includes(roomId) ? roomId : p.environments[0];
      const nextSurface = p.simulate.includes(surface) ? surface : p.simulate[0];
      setRoomId(nextRoom);
      setSurface(nextSurface);
      setChoices((c) => ({ ...c, [nextRoom]: { ...c[nextRoom], [nextSurface]: p.id } }));
    }
  }

  useEffect(() => {
    if (!request) return;
    document.getElementById("simulador")?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  }, [request, calm]);

  const room = sceneInfo.find((r) => r.id === roomId)!;
  const choice = choices[roomId];
  const options = optionsFor(roomId, surface);
  const floorProduct = getProduct(choice.floor)!;
  const wallProduct = choice.wall ? getProduct(choice.wall) : null;
  const selected: Product | null = surface === "floor" ? floorProduct : (wallProduct ?? null);

  const select = (id: string | null) =>
    setChoices((c) => ({ ...c, [roomId]: { ...c[roomId], [surface]: surface === "floor" ? (id ?? c[roomId].floor) : id } }));

  const wallName = wallProduct?.name ?? "Pintura lisa";
  const hasWalls = scenes[roomId].wallSurfaces.length > 0;

  return (
    <div className="mt-12 lg:mt-14">
      <div role="group" aria-label="Escolha o ambiente" className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0">
        {sceneInfo.map((r) => {
          const active = r.id === roomId;
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={active}
              onClick={() => setRoomId(r.id)}
              className={cn("group w-40 shrink-0 text-left sm:w-auto", active ? "drop-card" : "")}
            >
              <span
                className={cn(
                  "chamfer chamfer-sm relative block aspect-[16/10] overflow-hidden p-[3px] transition-colors",
                  active ? "bg-gold-500" : "bg-cream-200 group-hover:bg-gold-300",
                )}
              >
                <img
                  src={sceneAsset(r.id, "thumb")}
                  alt=""
                  loading="lazy"
                  className="chamfer chamfer-sm size-full object-cover transition duration-500 group-hover:scale-105"
                />
              </span>
              <span className="mt-2.5 flex items-center gap-2 font-display text-sm font-bold text-green-900 sm:text-base">
                <span className={cn("diamond size-2 transition-colors", active ? "bg-red-500" : "bg-cream-300")} aria-hidden="true" />
                {r.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8">
        <figure className="drop-deep m-0 min-w-0 lg:sticky lg:top-28 lg:self-start">
          <div
            className="chamfer chamfer-lg relative aspect-[16/10] overflow-hidden bg-green-900"
            role="img"
            aria-label={`${room.label} com piso ${floorProduct.name} e parede: ${wallName}`}
          >
            <Crossfade
              value={roomId}
              duration={0.5}
              render={(id) => <RoomScene room={id} floor={choices[id].floor} wall={choices[id].wall} />}
            />
            <div data-scene-labels className="absolute inset-x-4 bottom-4 hidden flex-wrap gap-2 text-sm sm:flex">
              <span className="rounded-md bg-green-950/80 px-3 py-2 text-sand shadow-lg backdrop-blur-sm">
                <span className="font-display font-bold text-gold-400">Piso</span> · {floorProduct.name}
              </span>
              {hasWalls ? (
                <span className="rounded-md bg-green-950/80 px-3 py-2 text-sand shadow-lg backdrop-blur-sm">
                  <span className="font-display font-bold text-gold-400">Parede</span> · {wallName}
                </span>
              ) : null}
            </div>
          </div>
          <p className="mt-3 text-sm text-ink-600 sm:sr-only" aria-live="polite">
            <span className="font-display font-bold text-green-900">Piso:</span> {floorProduct.name}
            {hasWalls ? (
              <>
                {" · "}
                <span className="font-display font-bold text-green-900">Parede:</span> {wallName}
              </>
            ) : null}
          </p>
        </figure>

        <div className="drop-deep">
          <div className="card-dark chamfer h-full p-6 sm:p-7">
            <div role="group" aria-label="Superfície" className="grid grid-cols-2 gap-1 rounded-lg bg-green-950/70 p-1.5">
              {(["floor", "wall"] as const).map((s) => {
                const active = s === surface;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSurface(s)}
                    className={cn(
                      "relative rounded-md py-2.5 font-display text-sm font-bold transition-colors",
                      active ? "text-ink" : "text-sand hover:text-cream-50",
                    )}
                  >
                    {active ? (
                      <m.span
                        layoutId="sim-surface"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                        className="btn-gold absolute inset-0 rounded-md"
                      />
                    ) : null}
                    <span className="relative">{s === "floor" ? "Piso" : "Parede"}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.16em] text-gold-400" id="sim-opcoes">
              {surface === "floor" ? "Pisos" : "Revestimentos"} para {environmentLabels[roomId].toLowerCase()}
            </p>
            <m.ul
              key={`${roomId}-${surface}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              aria-labelledby="sim-opcoes"
              className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-5 lg:grid-cols-4"
            >
              {surface === "wall" ? (
                <li>
                  <Swatch active={!choice.wall} label="Pintura lisa" onClick={() => select(null)}>
                    <span className="flex size-full items-center justify-center bg-cream-100">
                      <PaintRoller weight="bold" className="size-6 text-green-900" aria-hidden="true" />
                    </span>
                  </Swatch>
                </li>
              ) : null}
              {options.map((p) => (
                <li key={p.id}>
                  <Swatch active={selected?.id === p.id} label={p.name} onClick={() => select(p.id)}>
                    <span className="block size-full" style={swatchStyle(p.texture!)} />
                  </Swatch>
                </li>
              ))}
            </m.ul>

            <div className="mt-7 border-t border-sand/15 pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sand-muted">
                {surface === "floor" ? "Piso escolhido" : "Parede escolhida"}
              </p>
              <p className="mt-1.5 font-display text-xl font-extrabold text-cream-50">
                {selected?.name ?? "Pintura lisa (sem revestimento)"}
              </p>
              {selected ? (
                <p className="mt-1 text-sand">
                  {selected.format} · {selected.finish} ·{" "}
                  <span className="font-bold text-gold-400">a partir de {formatPrice(selected.price)}/{selected.unit}</span>
                </p>
              ) : (
                <p className="mt-1 text-sand">Escolha um revestimento para transformar a parede.</p>
              )}
              <ButtonLink
                variant="whatsapp"
                className="mt-5 w-full"
                href={whatsappLink(
                  `Olá! Montei no simulador do site: ${environmentLabels[roomId]} com piso "${floorProduct.name}" e parede "${wallName}". Pode me passar um orçamento?`,
                )}
                icon={<WhatsappLogo weight="bold" className="size-5" />}
              >
                Orçar esta combinação
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <div data-reveal className="card-light chamfer mt-8 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
        <DiamondBadge>
          <Scan weight="bold" className="size-6" aria-hidden="true" />
        </DiamondBadge>
        <div>
          <p className="font-display text-lg font-extrabold text-green-900">Em breve: simule na foto do seu ambiente</p>
          <p className="mt-1 text-ink-600">
            Envie uma foto do cômodo e veja o piso aplicado com a mesma perspectiva e iluminação usadas aqui.
          </p>
        </div>
      </div>
    </div>
  );
}

function Swatch({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className="group flex w-full flex-col items-center text-center">
      <span
        className={cn(
          "diamond relative block aspect-square w-[82%] p-[3px] transition duration-300",
          active ? "bg-gold-500" : "bg-sand/25 group-hover:bg-gold-300",
        )}
      >
        <span className="diamond block size-full overflow-hidden transition-transform duration-500 group-hover:scale-[1.04]">
          {children}
        </span>
      </span>
      <span className={cn("mt-2 text-xs leading-snug", active ? "font-bold text-cream-50" : "text-sand")}>{label}</span>
    </button>
  );
}
