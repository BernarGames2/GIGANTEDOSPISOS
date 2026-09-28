import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const TITLE = "Conteúdo a confirmar com a loja";

/** Destaca um conteúdo pendente de confirmação, ex.: [endereço completo]. */
export function Placeholder({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("ph", className)} title={TITLE}>
      {children}
    </span>
  );
}

/** Renderiza um texto destacando automaticamente os trechos entre [colchetes]. */
export function WithPlaceholders({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <Placeholder key={i}>{part}</Placeholder>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Espaço reservado para uma foto real (nunca usar banco de imagens no lugar). */
export function PlaceholderImage({
  label,
  hint,
  className,
  icon,
}: {
  label: string;
  hint?: string;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={`Espaço reservado: ${label}`}
      title={TITLE}
      className={cn("ph-image flex flex-col items-center justify-center gap-2 p-4 text-center", className)}
    >
      {icon}
      <span className="font-display text-sm font-semibold">{label}</span>
      {hint ? <span className="max-w-[28ch] text-xs opacity-75">{hint}</span> : null}
    </div>
  );
}
