import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}
    >
      <p
        className={cn(
          "mb-3 inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.18em]",
          tone === "dark" ? "text-gold-400" : "text-brand-600",
        )}
      >
        <span className="h-px w-6 bg-current" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display text-display-3 font-bold text-balance",
          tone === "dark" ? "text-cream-50" : "text-brand-800",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p className={cn("mt-4 text-lg text-pretty", tone === "dark" ? "text-cream-100/80" : "text-ink-600")}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
