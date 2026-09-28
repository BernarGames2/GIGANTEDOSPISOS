import { useId } from "react";
import { cn } from "@/lib/cn";

/** Estrelas com preenchimento parcial (ex.: 4,8 = 4 cheias + 80% da quinta). */
export function Stars({ value, className }: { value: number; className?: string }) {
  const id = useId();
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} viewBox="0 0 20 20" className="size-[1em]">
            <defs>
              <linearGradient id={`${id}-${i}`}>
                <stop offset={fill} stopColor="currentColor" />
                <stop offset={fill} stopColor="currentColor" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${id}-${i})`}
              d="M10 1.6l2.57 5.2 5.74.84-4.15 4.05.98 5.71L10 14.7l-5.14 2.7.98-5.71L1.7 7.64l5.74-.84L10 1.6z"
            />
          </svg>
        );
      })}
    </span>
  );
}
