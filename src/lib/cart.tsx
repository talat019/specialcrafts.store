"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { kod: string; qty: number };

const KEY = "sc_cart_v1";

type Ctx = {
  lines: CartLine[];
  count: number;
  add: (kod: string, qty?: number) => void;
  setQty: (kod: string, qty: number) => void;
  remove: (kod: string) => void;
  clear: () => void;
  ready: boolean;
};

const CartContext = createContext<Ctx | null>(null);

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l): l is CartLine =>
        typeof l === "object" && l !== null && typeof (l as CartLine).kod === "string")
      .map((l) => ({ kod: l.kod, qty: Math.max(1, Math.min(20, Number(l.qty) || 1)) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* private rejim — səbət yalnız bu səhifədə yaşayır */
    }
  }, [lines, ready]);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      ready,
      count: lines.reduce((s, l) => s + l.qty, 0),
      add: (kod, qty = 1) =>
        setLines((prev) => {
          const hit = prev.find((l) => l.kod === kod);
          if (hit) return prev.map((l) => (l.kod === kod ? { ...l, qty: Math.min(20, l.qty + qty) } : l));
          return [...prev, { kod, qty }];
        }),
      setQty: (kod, qty) =>
        setLines((prev) =>
          qty <= 0 ? prev.filter((l) => l.kod !== kod) : prev.map((l) => (l.kod === kod ? { ...l, qty } : l)),
        ),
      remove: (kod) => setLines((prev) => prev.filter((l) => l.kod !== kod)),
      clear: () => setLines([]),
    }),
    [lines, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): Ctx {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart yalnız CartProvider daxilində işləyir");
  return c;
}
