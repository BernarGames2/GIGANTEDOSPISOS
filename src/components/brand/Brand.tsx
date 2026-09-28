import Image from "next/image";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Logo da loja (arquivo em public/marca, definido em site.images.logo).
 * A altura é controlada por `className` (ex.: "h-16"); a largura acompanha.
 */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  const { src, width, height } = site.images.logo;
  return (
    <Image
      src={src}
      alt={site.name}
      width={width}
      height={height}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      className={cn("h-16 w-auto", className)}
    />
  );
}

/** Rótulo curto acima dos títulos de seção. */
export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.16em]",
        tone === "dark" ? "text-gold-300" : "text-gold-800",
        className,
      )}
    >
      <span className={cn("h-px w-8", tone === "dark" ? "bg-gold-300/60" : "bg-gold-800/50")} aria-hidden="true" />
      {children}
    </p>
  );
}

/** Ícone em uma caixa discreta (substitui os antigos selos em losango). */
export function IconBox({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-lg",
        tone === "dark" ? "bg-green-950/55 text-gold-300 ring-1 ring-sand/10" : "bg-green-900/[0.06] text-green-800",
        className,
      )}
      aria-hidden="true"
    >
      {children}
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
          "mt-4 font-display text-display-3 font-semibold text-balance",
          tone === "dark" ? "text-cream-50" : "text-green-900",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className={cn("mt-4 max-w-2xl text-lg text-pretty", tone === "dark" ? "text-sand" : "text-ink-600")}>{lead}</p>
      ) : null}
    </div>
  );
}
