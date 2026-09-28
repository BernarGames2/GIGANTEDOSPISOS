"use client";

import { useSyncExternalStore } from "react";

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * "Modo leve": conexões lentas, economia de dados ou aparelhos com pouca
 * memória. Nesses casos as animações são reduzidas ao mínimo.
 */
export function detectLite() {
  const nav = navigator as Navigator & { connection?: NetworkInformation; deviceMemory?: number };
  const conn = nav.connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && ["slow-2g", "2g"].includes(conn.effectiveType)) return true;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return true;
  return false;
}

const subscribe = () => () => {};

export function useLiteMode() {
  return useSyncExternalStore(subscribe, detectLite, () => false);
}

const reducedQuery = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(reducedQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** true quando o visitante pediu menos movimento OU está no modo leve. */
export function useCalmMotion() {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
  const lite = useLiteMode();
  return reduced || lite;
}
