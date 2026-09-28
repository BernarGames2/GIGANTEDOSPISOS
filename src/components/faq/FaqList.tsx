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
          <li key={item.question}>
            <div className={cn("card-light rounded-xl transition-shadow duration-200", isOpen && "shadow-[var(--shadow-lift)]")}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-6 px-5 py-5 text-left font-display text-[1.05rem] font-semibold text-green-900 sm:px-7 sm:text-lg",
                  )}
                >
                  {item.question}
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                      isOpen ? "bg-green-900 text-cream-50" : "bg-green-900/[0.07] text-green-900",
                    )}
                    aria-hidden="true"
                  >
                    <Plus weight="bold" className={cn("size-4 transition-transform duration-200", isOpen && "rotate-45")} />
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
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-3 px-5 pb-6 text-ink-600 sm:px-7">{item.answer}</div>
              </m.div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
