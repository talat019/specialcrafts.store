"use client";

import { useTransition } from "react";
import { setStockAction } from "@/lib/admin-actions";

const options = [
  { key: "var", label: "Stokda", cls: "bg-stock-tint text-stock-dark border-stock-line" },
  { key: "sifarisle", label: "Sifarişlə", cls: "bg-order-tint text-gold-dark border-order-line" },
  { key: "satilib", label: "Satılıb", cls: "bg-sold-tint text-sold border-sold-line" },
];

export function StockControls({ id, stock, qty }: { id: string; stock: string; qty: number }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center gap-1.5">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          disabled={pending}
          onClick={() => start(() => { void setStockAction(id, o.key, o.key === "var" ? Math.max(1, qty) : 0); })}
          className={`rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-opacity disabled:opacity-50 ${
            stock === o.key ? o.cls : "border-line bg-ground text-ink-faint"
          }`}
        >
          {o.label}
        </button>
      ))}
      {stock === "var" && <span className="ml-1 text-[12.5px] text-ink-faint tabular-nums">{qty} ədəd</span>}
    </div>
  );
}
