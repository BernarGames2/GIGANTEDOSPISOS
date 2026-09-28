"use client";

import { useEffect, useRef, useState } from "react";
import { useCalmMotion } from "@/components/motion/use-lite-mode";

const format = (n: number, decimals: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Número que conta a partir de zero quando entra na tela. O HTML do servidor
 * já traz o valor final (SEO, leitores de tela e visitantes sem JS).
 */
export function Counter({ value, decimals = 0, duration = 1600 }: { value: number; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const calm = useCalmMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || calm) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // já visível: não reinicia

    let raf = 0;
    setShown(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(value * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, calm]);

  // Com movimento reduzido (detectado só após a hidratação), mostra sempre o valor final.
  const display = calm ? value : shown;

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {format(display, decimals)}
      </span>
      <span className="sr-only">{format(value, decimals)}</span>
    </span>
  );
}
