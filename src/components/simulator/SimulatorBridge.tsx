"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface SimulationRequest {
  productId: string;
  nonce: number;
}

interface BridgeValue {
  request: SimulationRequest | null;
  simulate: (productId: string) => void;
}

const BridgeContext = createContext<BridgeValue>({ request: null, simulate: () => {} });

/** Liga o catálogo ao simulador ("Ver no simulador" em um card de produto). */
export function SimulatorBridge({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<SimulationRequest | null>(null);
  const simulate = useCallback((productId: string) => {
    setRequest((r) => ({ productId, nonce: (r?.nonce ?? 0) + 1 }));
  }, []);
  const value = useMemo(() => ({ request, simulate }), [request, simulate]);
  return <BridgeContext.Provider value={value}>{children}</BridgeContext.Provider>;
}

export const useSimulatorBridge = () => useContext(BridgeContext);
