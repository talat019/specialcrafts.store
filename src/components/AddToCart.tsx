"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { L, type Locale } from "@/i18n/config";
import { fill } from "@/i18n";

export function AddToCart({
  kod, max, locale, labels,
}: {
  kod: string;
  max: number;
  locale: Locale;
  labels: { add: string; inCart: string; goToCart: string };
}) {
  const { add, lines } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = lines.find((l) => l.kod === kod)?.qty ?? 0;
  const full = inCart >= Math.max(1, max);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={full}
        onClick={() => {
          add(kod);
          setAdded(true);
          setTimeout(() => setAdded(false), 2200);
        }}
        className="flex items-center justify-center gap-2.5 rounded-2xl bg-emerald px-7 py-5 text-[17px] font-bold text-surface transition-colors hover:bg-emerald-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-ink-muted"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
          <path d="M6 6L5 2H2" />
        </svg>
        {full ? labels.inCart : labels.add}
      </button>
      {(added || inCart > 0) && (
        <Link
          href={L(locale, "/sebet")}
          className="text-center text-[14.5px] font-semibold text-emerald hover:text-emerald-dark"
        >
          {fill(labels.goToCart, { n: inCart })} →
        </Link>
      )}
    </div>
  );
}
