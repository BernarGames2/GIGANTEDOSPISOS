"use client";

import { useLayoutEffect } from "react";
import { detectLite } from "./use-lite-mode";

/**
 * Scroll reveal leve (CSS + IntersectionObserver, sem JS por elemento).
 * Elementos com `data-reveal` ficam visíveis por padrão (HTML do servidor);
 * só depois de hidratar escondemos os que ainda estão fora da tela. Assim,
 * sem JavaScript ou com movimento reduzido, o conteúdo nunca some.
 */
export function RevealObserver() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches || detectLite();
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (calm || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const vh = window.innerHeight;
    for (const el of items) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("is-revealed");
    }
    root.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    items.forEach((el) => {
      if (!el.classList.contains("is-revealed")) io.observe(el);
    });

    return () => {
      io.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
