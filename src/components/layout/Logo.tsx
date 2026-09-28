import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Marca PROVISÓRIA (texto + ícone de peças). Assim que a loja enviar o logotipo
 * oficial (com o mascote), informe o arquivo em `site.images.logo`.
 */
export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  if (site.images.logo) {
    return (
      <Image src={site.images.logo} alt={site.name} width={180} height={48} className={cn("h-10 w-auto", className)} priority />
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} title="Marca provisória — substituir pelo logotipo oficial">
      <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden="true">
        <rect x="1" y="1" width="14" height="14" rx="3" fill="#f0b429" />
        <rect x="17" y="1" width="14" height="14" rx="3" fill={tone === "light" ? "#faf6ec" : "#17301f"} />
        <rect x="1" y="17" width="14" height="14" rx="3" fill={tone === "light" ? "#faf6ec" : "#17301f"} />
        <rect x="17" y="17" width="14" height="14" rx="3" fill="#c6432a" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.15rem] font-extrabold tracking-[-0.02em]",
            tone === "light" ? "text-cream-50" : "text-brand-800",
          )}
        >
          Gigante
        </span>
        <span
          className={cn(
            "font-display text-[0.7rem] font-semibold uppercase tracking-[0.2em]",
            tone === "light" ? "text-gold-400" : "text-brand-600",
          )}
        >
          dos Pisos
        </span>
      </span>
    </span>
  );
}
