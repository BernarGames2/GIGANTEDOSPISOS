"use client";
/* eslint-disable @next/next/no-img-element -- miniaturas pequenas e estáticas dos renders */

import { Info, PaintRoller, WhatsappLogo } from "@phosphor-icons/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
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

const disclaimer =
  "Ambiente ilustrativo com mobília genérica, montado para mostrar os materiais. Cores e tamanhos podem variar em relação à peça real — confira no showroom.";

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
              className="group w-40 shrink-0 text-left sm:w-auto"
            >
              <span
                className={cn(
                  "relative block aspect-[16/10] overflow-hidden rounded-xl ring-offset-2 ring-offset-cream-50 transition",
                  active ? "ring-2 ring-green-900" : "ring-1 ring-green-900/10 group-hover:ring-green-900/40",
                )}
              >
                <img src={sceneAsset(r.id, "thumb")} alt="" loading="lazy" className="size-full object-cover" />
              </span>
              <span
                className={cn(
                  "mt-2.5 block text-sm sm:text-base",
                  active ? "font-semibold text-green-900" : "font-medium text-ink-600 group-hover:text-green-900",
                )}
              >
                {r.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8">
        {/* No celular a cena fica presa no topo enquanto a pessoa escolhe o piso. */}
        <figure className="sticky top-[5.25rem] z-10 m-0 min-w-0 self-start sm:static lg:sticky lg:top-28">
          <div
            data-scene
            className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-green-900 shadow-[var(--shadow-lift)]"
            role="img"
            aria-label={`${room.label} com piso ${floorProduct.name} e parede: ${wallName}`}
          >
            <Crossfade
              value={roomId}
              duration={0.4}
              render={(id) => <RoomScene room={id} floor={choices[id].floor} wall={choices[id].wall} />}
            />
            <span
              data-scene-badge
              className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-green-950/75 px-2.5 py-1 text-xs font-medium text-sand backdrop-blur-sm sm:left-4 sm:top-4"
            >
              <Info weight="bold" className="size-3.5" aria-hidden="true" />
              Ambiente ilustrativo
            </span>
            <div data-scene-labels className="absolute inset-x-4 bottom-4 hidden flex-wrap gap-2 text-sm sm:flex">
              <span className="rounded-md bg-green-950/80 px-3 py-1.5 text-sand backdrop-blur-sm">
                <span className="font-semibold text-cream-50">Piso:</span> {floorProduct.name}
              </span>
              {hasWalls ? (
                <span className="rounded-md bg-green-950/80 px-3 py-1.5 text-sand backdrop-blur-sm">
                  <span className="font-semibold text-cream-50">Parede:</span> {wallName}
                </span>
              ) : null}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            Piso: {floorProduct.name}
            {hasWalls ? `; parede: ${wallName}` : null}
          </p>
          <figcaption className="mt-3 hidden text-sm text-ink-500 sm:block">{disclaimer}</figcaption>
        </figure>

        <div>
          <div className="card-dark h-full rounded-2xl p-6 sm:p-7">
            <div role="group" aria-label="Superfície" className="grid grid-cols-2 gap-1 rounded-lg bg-green-950/70 p-1">
              {(["floor", "wall"] as const).map((s) => {
                const active = s === surface;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSurface(s)}
                    className={cn(
                      "relative rounded-md py-2.5 text-sm font-semibold transition-colors",
                      active ? "text-green-900" : "text-sand hover:text-cream-50",
                    )}
                  >
                    {active ? (
                      <m.span
                        layoutId="sim-surface"
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="absolute inset-0 rounded-md bg-cream-50"
                      />
                    ) : null}
                    <span className="relative">{s === "floor" ? "Piso" : "Parede"}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-sand-muted" id="sim-opcoes">
              {surface === "floor" ? "Pisos" : "Revestimentos"} para {environmentLabels[roomId].toLowerCase()}
            </p>
            <m.ul
              key={`${roomId}-${surface}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              aria-labelledby="sim-opcoes"
              className="mt-4 grid grid-cols-3 gap-x-2.5 gap-y-4 min-[360px]:grid-cols-4 sm:grid-cols-5 sm:gap-x-3 lg:grid-cols-4"
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
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sand-muted">
                {surface === "floor" ? "Piso escolhido" : "Parede escolhida"}
              </p>
              <p className="mt-1.5 font-display text-xl font-semibold text-cream-50">
                {selected?.name ?? "Pintura lisa (sem revestimento)"}
              </p>
              {selected ? (
                <p className="mt-1 text-sand">
                  {selected.format} · {selected.finish} ·{" "}
                  <span className="font-semibold text-cream-50">a partir de {formatPrice(selected.price)}/{selected.unit}</span>
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
      <p className="mt-4 text-sm text-ink-500 sm:hidden">{disclaimer}</p>
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
          "relative block aspect-square w-full overflow-hidden rounded-lg ring-offset-2 ring-offset-green-800 transition",
          active ? "ring-2 ring-gold-400" : "ring-1 ring-sand/20 group-hover:ring-sand/60",
        )}
      >
        {children}
      </span>
      <span className={cn("mt-1.5 text-[11px] leading-snug sm:mt-2 sm:text-xs", active ? "font-semibold text-cream-50" : "text-sand")}>{label}</span>
    </button>
  );
}
