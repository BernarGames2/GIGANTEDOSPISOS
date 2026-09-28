"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { useEffect } from "react";
import { useLiteMode } from "./use-lite-mode";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Framer Motion (pacote `motion`) com carregamento sob demanda e respeito a
 * `prefers-reduced-motion`. No modo leve, só transições de opacidade rodam.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const lite = useLiteMode();

  useEffect(() => {
    document.documentElement.toggleAttribute("data-lite", lite);
  }, [lite]);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={lite ? "always" : "user"}>{children}</MotionConfig>
    </LazyMotion>
  );
}
