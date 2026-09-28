"use client";

import { Plus } from "@phosphor-icons/react";
import * as m from "motion/react-m";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Acordeão acessível em cards (um aberto por vez), com abertura suave. */
export function FaqList({ items }: { items: { question: string; answer: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="grid gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <li key={item.question} className={cn("transition-[filter] duration-300", isOpen ? "drop-deep" : "drop-card")}>
            <div className={cn("chamfer chamfer-sm transition-colors duration-300", isOpen ? "card-dark" : "card-light")}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-[1.05rem] font-bold sm:px-7 sm:text-lg",
                    isOpen ? "text-cream-50" : "text-green-900",
                  )}
                >
                  {item.question}
                  <span
                    className={cn(
                      "diamond flex size-10 shrink-0 items-center justify-center transition duration-300",
                      isOpen ? "btn-gold text-ink" : "bg-green-900 text-gold-400",
                    )}
                    aria-hidden="true"
                  >
                    <Plus weight="bold" className={cn("size-4 transition-transform duration-300", isOpen && "rotate-45")} />
                  </span>
                </button>
              </h3>
              {/* Painéis ficam sempre no HTML (bom para SEO); fechados = altura 0 e inert. */}
              <m.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                inert={!isOpen}
                initial={false}
                animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-3 px-6 pb-6 text-sand sm:px-7">{item.answer}</div>
              </m.div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
