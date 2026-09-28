"use client";

import { ChevronDown } from "lucide-react";
import * as m from "motion/react-m";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Acordeão acessível (um item aberto por vez) com abertura/fechamento suave. */
export function FaqList({ items }: { items: { question: string; answer: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="divide-y divide-ink-900/10 overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-900/5">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <li key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left font-display font-semibold text-ink-900 transition-colors hover:bg-cream-50 sm:px-7 sm:text-lg"
              >
                {item.question}
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full transition duration-300",
                    isOpen ? "rotate-180 bg-gold-500 text-ink-900" : "bg-cream-100 text-brand-700",
                  )}
                  aria-hidden="true"
                >
                  <ChevronDown className="size-5" />
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
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-3 px-5 pb-6 text-ink-600 sm:px-7">{item.answer}</div>
            </m.div>
          </li>
        );
      })}
    </ul>
  );
}
