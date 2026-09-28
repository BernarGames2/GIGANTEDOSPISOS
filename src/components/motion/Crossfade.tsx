"use client";

import * as m from "motion/react-m";
import { useState, type ReactNode } from "react";

interface Entry<T> {
  id: number;
  value: T;
}

/**
 * Troca de conteúdo com fusão: o novo estado entra por cima do anterior, que
 * só sai de cena quando a transição termina (sem "piscar" o fundo).
 */
export function Crossfade<T>({
  value,
  render,
  duration = 0.5,
  className = "absolute inset-0",
}: {
  value: T;
  render: (value: T) => ReactNode;
  duration?: number;
  className?: string;
}) {
  const [prev, setPrev] = useState(value);
  const [stack, setStack] = useState<Entry<T>[]>(() => [{ id: 0, value }]);

  if (prev !== value) {
    setPrev(value);
    setStack((s) => [...s, { id: s[s.length - 1].id + 1, value }]);
  }

  return (
    <>
      {stack.map((entry) => (
        <m.div
          key={entry.id}
          className={className}
          initial={entry.id === 0 ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={() => setStack((s) => s.filter((e) => e.id >= entry.id))}
        >
          {render(entry.value)}
        </m.div>
      ))}
    </>
  );
}
