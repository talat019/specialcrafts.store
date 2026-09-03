"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { L, type Locale } from "@/i18n/config";

export function CartButton({ locale, label }: { locale: Locale; label: string }) {
  const { count, ready } = useCart();
  if (!ready || count === 0) return null;
  return (
    <Link
      href={L(locale, "/sebet")}
      className="relative flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:border-line-strong"
      aria-label={`${label} — ${count}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
        <path d="M6 6L5 2H2" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
      <span className="flex size-5 items-center justify-center rounded-full bg-emerald text-[11px] font-bold text-surface">
        {count}
      </span>
    </Link>
  );
}
