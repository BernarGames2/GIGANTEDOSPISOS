"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { textureStyle, type TextureId } from "@/lib/textures";
import { Crossfade } from "@/components/motion/Crossfade";
import { pointsAttr, SCENE_H, SCENE_W, SURFACE_PX_PER_CM, type Shape } from "./geometry";
import type { Plane, Room, WallId } from "./rooms";

function PlaneLayer({ plane, texture, color }: { plane: Plane; texture: TextureId | null; color: string }) {
  const style: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: plane.widthCm * SURFACE_PX_PER_CM,
    height: plane.heightCm * SURFACE_PX_PER_CM,
    transformOrigin: "0 0",
    transform: plane.transform,
    backgroundColor: color,
    ...(texture ? { ...textureStyle(texture, SURFACE_PX_PER_CM), backgroundPosition: "0 100%" } : null),
  };
  return <div style={style} />;
}

function ShapeEl({ s }: { s: Shape }) {
  switch (s.kind) {
    case "poly":
      return <polygon points={pointsAttr(s.pts)} fill={s.fill} opacity={s.opacity} stroke={s.stroke} strokeWidth={s.strokeWidth} />;
    case "ellipse":
      return <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={s.fill} opacity={s.opacity} />;
    case "line":
      return <line x1={s.a[0]} y1={s.a[1]} x2={s.b[0]} y2={s.b[1]} stroke={s.stroke} strokeWidth={s.width} opacity={s.opacity} strokeLinecap="round" />;
    case "rect":
      return <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} fill={s.fill} opacity={s.opacity} stroke={s.stroke} strokeWidth={s.strokeWidth} />;
  }
}

const Shapes = ({ list }: { list: Shape[] }) => (
  <>
    {list.map((s, i) => (
      <ShapeEl key={i} s={s} />
    ))}
  </>
);

/** Detalhes estáticos do ambiente: teto, sombreamento, móveis e decoração. */
function RoomOverlay({ room, gloss }: { room: Room; gloss: number }) {
  const { floor, back, left, right } = room.planes;
  const edges: [number, number, number, number][] = [
    [floor.quad[0][0], floor.quad[0][1], floor.quad[1][0], floor.quad[1][1]],
    [floor.quad[0][0], floor.quad[0][1], floor.quad[3][0], floor.quad[3][1]],
    [floor.quad[1][0], floor.quad[1][1], floor.quad[2][0], floor.quad[2][1]],
    [back.quad[0][0], back.quad[0][1], back.quad[3][0], back.quad[3][1]],
    [back.quad[1][0], back.quad[1][1], back.quad[2][0], back.quad[2][1]],
    [back.quad[0][0], back.quad[0][1], back.quad[1][0], back.quad[1][1]],
  ];
  return (
    <svg
      className="absolute inset-0"
      width={SCENE_W}
      height={SCENE_H}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sim-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9cfe4" />
          <stop offset="1" stopColor="#eef4ec" />
        </linearGradient>
        <linearGradient id="sim-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1a16" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#1c1a16" stopOpacity="0.05" />
          <stop offset="1" stopColor="#1c1a16" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sim-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1a16" stopOpacity="0.1" />
          <stop offset="1" stopColor="#1c1a16" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sim-vignette" cx="0.5" cy="0.48" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </radialGradient>
        <filter id="sim-blur-s" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="sim-blur-l" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>

      <Shapes list={room.layers.ceiling} />
      <polygon points={pointsAttr(left.quad)} fill="#1c1a16" opacity={0.1} />
      <polygon points={pointsAttr(right.quad)} fill="#1c1a16" opacity={0.05} />
      <polygon points={pointsAttr(back.quad)} fill="url(#sim-wall)" />
      <polygon points={pointsAttr(floor.quad)} fill="url(#sim-floor)" />

      <g filter="url(#sim-blur-s)" opacity={0.35}>
        {edges.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1c1a16" strokeWidth={9} />
        ))}
      </g>

      <Shapes list={room.layers.decor} />

      <g filter="url(#sim-blur-l)" style={{ mixBlendMode: "screen", transition: "opacity .6s ease" }} opacity={0.12 + gloss * 0.5}>
        <Shapes list={room.sheen} />
      </g>

      <g filter="url(#sim-blur-s)">
        <Shapes list={room.layers.shadows} />
      </g>
      <Shapes list={room.layers.furniture} />

      <rect width={SCENE_W} height={SCENE_H} fill="url(#sim-vignette)" />
    </svg>
  );
}

const WALLS: WallId[] = ["back", "left", "right"];

/**
 * Cena do simulador. A cena é desenhada em 1000×700 "px de projeto" e
 * escalada para a largura disponível.
 */
export function RoomScene({
  room,
  floor,
  wall,
  gloss,
}: {
  room: Room;
  floor: TextureId;
  wall: TextureId | null;
  gloss: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / SCENE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden" style={{ backgroundColor: room.paint }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: SCENE_W,
          height: SCENE_H,
          transform: scale ? `scale(${scale})` : undefined,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        <Crossfade
          value={wall}
          duration={0.55}
          render={(w) =>
            WALLS.map((id) => (
              <PlaneLayer
                key={id}
                plane={room.planes[id]}
                texture={room.wallSurfaces.includes(id) ? w : null}
                color={room.paint}
              />
            ))
          }
        />
        <Crossfade value={floor} duration={0.55} render={(f) => <PlaneLayer plane={room.planes.floor} texture={f} color="#cfc6b6" />} />
        <RoomOverlay room={room} gloss={gloss} />
      </div>
    </div>
  );
}
