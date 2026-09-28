import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Marca: losango dourado com "G" vermelho. Desenho feito a partir da
 * descrição da mancheta da loja — substituir pelo arquivo oficial quando a
 * loja enviar (site.images.logo).
 */
export function DiamondMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id="gp-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8d98a" />
          <stop offset="0.5" stopColor="#f0b429" />
          <stop offset="1" stopColor="#d89a15" />
        </linearGradient>
      </defs>
      <path d="M24 1.5 46.5 24 24 46.5 1.5 24Z" fill="url(#gp-gold)" />
      <path d="M24 6.5 41.5 24 24 41.5 6.5 24Z" fill="none" stroke="#c6432a" strokeWidth="2.2" />
      <text
        x="24"
        y="31.2"
        textAnchor="middle"
        fontSize="21"
        fontWeight="800"
        fill="#c6432a"
        style={{ fontFamily: "var(--font-display)" }}
      >
        G
      </text>
    </svg>
  );
}

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <DiamondMark className="size-11" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.28rem] font-extrabold uppercase tracking-[-0.01em]",
            tone === "dark" ? "text-cream-50" : "text-green-900",
          )}
        >
          Gigante
        </span>
        <span
          className={cn(
            "mt-1 font-display text-[0.66rem] font-bold uppercase tracking-[0.34em]",
            tone === "dark" ? "text-gold-400" : "text-gold-800",
          )}
        >
          dos Pisos
        </span>
      </span>
    </span>
  );
}

/** Rótulo de seção com losango. */
export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-xs font-bold uppercase tracking-[0.22em]",
        tone === "dark" ? "text-gold-400" : "text-gold-800",
        className,
      )}
    >
      <span className="diamond size-2.5 bg-red-500" aria-hidden="true" />
      {children}
    </p>
  );
}

/** Divisor: linha — ◆ ◆ ◆ — linha. */
export function DiamondDivider({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const line = tone === "dark" ? "bg-sand/20" : "bg-green-900/15";
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden="true">
      <span className={cn("h-px flex-1", line)} />
      <span className="diamond size-2 bg-gold-500" />
      <span className="diamond size-3 bg-red-500" />
      <span className="diamond size-2 bg-gold-500" />
      <span className={cn("h-px flex-1", line)} />
    </div>
  );
}

/** Ícone dentro de um losango dourado com sombra. */
export function DiamondBadge({ children, size = "md", className }: { children: ReactNode; size?: "sm" | "md" | "lg"; className?: string }) {
  const s = { sm: "size-11", md: "size-14", lg: "size-16" }[size];
  return (
    <span className={cn("drop-card relative inline-flex shrink-0 items-center justify-center", s, className)}>
      <span className="diamond btn-gold absolute inset-0" />
      <span className="relative text-ink">{children}</span>
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div data-reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn(
          "mt-4 font-display text-display-3 font-extrabold text-balance",
          tone === "dark" ? "text-cream-50" : "text-green-900",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className={cn("mt-5 text-lg text-pretty", tone === "dark" ? "text-sand" : "text-ink-600")}>{lead}</p>
      ) : null}
    </div>
  );
}
