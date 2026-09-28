"use client";

import { Bath, CookingPot, PaintRoller, ScanLine, Sofa, Trees } from "lucide-react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import {
  environmentLabels,
  getProduct,
  products,
  BRAND_PLACEHOLDER,
  type Environment,
  type Product,
  type Surface,
} from "@/content/products";
import { Crossfade } from "@/components/motion/Crossfade";
import { useCalmMotion } from "@/components/motion/use-lite-mode";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Placeholder } from "@/components/ui/Placeholder";
import { cn } from "@/lib/cn";
import { swatchStyle } from "@/lib/textures";
import { whatsappLink } from "@/lib/whatsapp";
import { RoomScene } from "./RoomScene";
import { getRoom, rooms } from "./rooms";
import { useSimulatorBridge } from "./SimulatorBridge";

const roomIcons: Record<Environment, typeof Sofa> = {
  sala: Sofa,
  cozinha: CookingPot,
  banheiro: Bath,
  externa: Trees,
};

type Choices = Record<Environment, { floor: string; wall: string | null }>;

const initialChoices = () =>
  Object.fromEntries(rooms.map((r) => [r.id, { floor: r.defaults.floor, wall: r.defaults.wall }])) as Choices;

function optionsFor(room: Environment, surface: Surface) {
  return products.filter(
    (p) => p.texture && p.simulate?.includes(surface) && p.environments.includes(room),
  );
}

const pillTransition = { type: "spring", bounce: 0.18, duration: 0.45 } as const;

export function Simulator() {
  const { request } = useSimulatorBridge();
  const calm = useCalmMotion();
  const [roomId, setRoomId] = useState<Environment>("sala");
  const [surface, setSurface] = useState<Surface>("floor");
  const [choices, setChoices] = useState<Choices>(initialChoices);
  const [handledNonce, setHandledNonce] = useState(0);

  // Pedido vindo do catálogo ("Ver no simulador").
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

  const room = getRoom(roomId);
  const choice = choices[roomId];
  const options = optionsFor(roomId, surface);
  const selected: Product | null = (surface === "floor" ? getProduct(choice.floor) : choice.wall ? getProduct(choice.wall) : null) ?? null;

  const select = (id: string | null) =>
    setChoices((c) => ({ ...c, [roomId]: { ...c[roomId], [surface]: surface === "floor" ? (id ?? c[roomId].floor) : id } }));

  const floorName = getProduct(choice.floor)?.name;
  const wallName = choice.wall ? getProduct(choice.wall)?.name : "Pintura lisa";

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
      <div className="min-w-0">
        <div
          role="group"
          aria-label="Escolha o ambiente"
          className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {rooms.map((r) => {
            const Icon = roomIcons[r.id];
            const active = r.id === roomId;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={active}
                onClick={() => setRoomId(r.id)}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2.5 font-display text-sm font-semibold transition-colors",
                  active ? "text-cream-50" : "bg-white/70 text-ink-700 ring-1 ring-ink-900/10 hover:bg-white",
                )}
              >
                {active ? (
                  <m.span layoutId="sim-room-pill" transition={pillTransition} className="absolute inset-0 rounded-full bg-brand-800" />
                ) : null}
                <span className="relative flex items-center gap-2">
                  <Icon className="size-4" aria-hidden="true" />
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>

        <figure className="m-0">
          <div
            className="relative aspect-[10/7] overflow-hidden rounded-3xl bg-cream-200 shadow-lift ring-1 ring-ink-900/5"
            aria-label={`${room.label} com piso ${floorName} e parede: ${wallName}`}
            role="img"
          >
            <Crossfade
              value={roomId}
              duration={0.45}
              render={(id) => {
                const r = getRoom(id);
                const c = choices[id];
                const f = getProduct(c.floor);
                const w = c.wall ? getProduct(c.wall) : null;
                return <RoomScene room={r} floor={f!.texture!} wall={w?.texture ?? null} gloss={f?.gloss ?? 0} />;
              }}
            />
            <span className="absolute left-3 top-3 rounded-full bg-ink-900/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cream-50 backdrop-blur-sm">
              Ambiente ilustrativo
            </span>
            <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/90 px-3 py-1.5 font-medium text-ink-900 shadow-soft backdrop-blur-sm">
                <span className="text-ink-500">Piso:</span> {floorName}
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1.5 font-medium text-ink-900 shadow-soft backdrop-blur-sm">
                <span className="text-ink-500">Parede:</span> {wallName}
              </span>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {room.label}: piso {floorName}; parede {wallName}.
          </p>
          <figcaption className="mt-3 text-xs text-ink-500">
            Imagem ilustrativa: cores, brilho e proporções variam conforme a tela. Confira as peças reais no showroom.
          </figcaption>
        </figure>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-ink-900/5 sm:p-6">
        <div role="group" aria-label="Superfície" className="inline-flex rounded-full bg-cream-100 p-1">
          {(["floor", "wall"] as const).map((s) => {
            const active = s === surface;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => setSurface(s)}
                className={cn(
                  "relative rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors",
                  active ? "text-brand-800" : "text-ink-500 hover:text-ink-900",
                )}
              >
                {active ? (
                  <m.span layoutId="sim-surface-pill" transition={pillTransition} className="absolute inset-0 rounded-full bg-white shadow-soft" />
                ) : null}
                <span className="relative">{s === "floor" ? "Piso" : "Parede"}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-sm font-medium text-ink-600" id="sim-options-label">
          {surface === "floor" ? "Pisos" : "Revestimentos"} indicados para {environmentLabels[roomId].toLowerCase()}
        </p>
        <m.ul
          key={`${roomId}-${surface}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          aria-labelledby="sim-options-label"
          className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-3"
        >
          {surface === "wall" ? (
            <li>
              <SwatchButton active={!choice.wall} label="Pintura lisa" onClick={() => select(null)}>
                <span className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: room.paint }}>
                  <PaintRoller className="size-6 text-ink-500" aria-hidden="true" />
                </span>
              </SwatchButton>
            </li>
          ) : null}
          {options.map((p) => (
            <li key={p.id}>
              <SwatchButton active={selected?.id === p.id} label={p.name} onClick={() => select(p.id)}>
                <span
                  className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
                  style={swatchStyle(p.texture!)}
                />
              </SwatchButton>
            </li>
          ))}
        </m.ul>

        <div className="mt-6 rounded-2xl bg-cream-50 p-4 ring-1 ring-ink-900/5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            {surface === "floor" ? "Piso selecionado" : "Parede selecionada"}
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-brand-800">
            {selected?.name ?? "Pintura lisa (sem revestimento)"}
          </p>
          {selected ? (
            <p className="mt-1 text-sm text-ink-600">
              {selected.format} · {selected.finish} · <Placeholder>{BRAND_PLACEHOLDER}</Placeholder>
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-600">Escolha um revestimento para ver a parede transformada.</p>
          )}
          <ButtonLink
            variant="whatsapp"
            className="mt-4 w-full"
            href={whatsappLink(
              `Olá! Vi no simulador do site: ${environmentLabels[roomId]} com piso "${floorName}" e parede "${wallName}". Pode me passar um orçamento?`,
            )}
            icon={<WhatsAppIcon className="size-5" />}
          >
            Orçar esta combinação
          </ButtonLink>
        </div>
      </div>

      <div
        data-reveal
        className="flex flex-col gap-4 rounded-3xl border border-dashed border-brand-300 bg-white/60 p-5 sm:flex-row sm:items-center lg:col-span-2"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-800 text-gold-400">
          <ScanLine className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display font-semibold text-brand-800">
            Evolução prevista: simular com a foto do próprio ambiente
          </p>
          <p className="mt-1 text-sm text-ink-600">
            Nesta primeira versão os ambientes são ilustrativos. Na próxima fase, o cliente poderá enviar uma foto do
            cômodo e ver o piso aplicado — usando as texturas reais dos produtos da loja.
          </p>
        </div>
      </div>
    </div>
  );
}

function SwatchButton({
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
    <button type="button" aria-pressed={active} onClick={onClick} className="group w-full text-left">
      <span
        className={cn(
          "relative block aspect-square overflow-hidden rounded-xl ring-2 ring-offset-2 transition",
          active ? "ring-gold-500" : "ring-transparent group-hover:ring-brand-200",
        )}
      >
        {children}
        {active ? (
          <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-ink-900 shadow">
            ✓
          </span>
        ) : null}
      </span>
      <span className={cn("mt-1.5 block text-xs leading-snug", active ? "font-semibold text-ink-900" : "text-ink-600")}>
        {label}
      </span>
    </button>
  );
}
