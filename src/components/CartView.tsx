"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";
import { resolveCartAction } from "@/lib/actions";
import type { ResolvedLine } from "@/lib/order-labels";
import { L, type Locale } from "@/i18n/config";
import { fill, type Dictionary } from "@/i18n";

export function CartView({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { lines, ready, setQty, remove } = useCart();
  const [items, setItems] = useState<ResolvedLine[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!lines.length) {
      setItems([]); setRemoved([]); setSubtotal(0); setLoading(false);
      return;
    }
    let live = true;
    setLoading(true);
    resolveCartAction(lines).then((r) => {
      if (!live) return;
      setItems(r.items); setRemoved(r.removed); setSubtotal(r.subtotal); setLoading(false);
    });
    return () => { live = false; };
  }, [lines, ready]);

  if (!ready || loading) {
    return <p className="mt-8 text-ink-muted">{t.common.loading}</p>;
  }

  if (!items.length) {
    return (
      <div className="mt-8 rounded-2xl border border-line bg-surface p-10 text-center">
        <p className="font-display text-[22px]">{t.cart.emptyTitle}</p>
        <p className="mx-auto mt-3 max-w-[46ch] text-ink-muted">
          {t.cart.emptyBody}
        </p>
        <Link
          href={`${L(locale, "/kataloq")}?stok=var`}
          className="mt-6 inline-block rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface transition-colors hover:bg-emerald-dark"
        >
          {t.cart.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="flex flex-col gap-3">
        {removed.length > 0 && (
          <li className="rounded-xl border border-order-line bg-order-tint px-4 py-3 text-[14.5px] text-gold-dark">
            {fill(t.cart.removedNote, { codes: removed.join(", ") })}
          </li>
        )}
        {items.map((i) => (
          <li key={i.kod} className="flex gap-4 rounded-2xl border border-line bg-surface p-3">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-band">
              {i.sekil && <Image src={i.sekil} alt={i.ad} fill sizes="96px" className="object-cover" />}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Link href={L(locale, `/mehsul/${i.kod.toLowerCase()}`)} className="font-semibold hover:text-emerald">
                {i.ad}
              </Link>
              <span className="code text-[11px] text-ink-faint">{i.kod}</span>
              <div className="mt-auto flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button" aria-label={t.common.decrease}
                    onClick={() => setQty(i.kod, i.qty - 1)}
                    className="size-8 rounded-lg border border-line-strong text-lg leading-none"
                  >−</button>
                  <span className="w-8 text-center tabular-nums">{i.qty}</span>
                  <button
                    type="button" aria-label={t.common.increase}
                    onClick={() => setQty(i.kod, i.qty + 1)}
                    className="size-8 rounded-lg border border-line-strong text-lg leading-none"
                  >+</button>
                </div>
                <span className="font-display text-[20px]">{money(i.cem)}</span>
              </div>
            </div>
            <button
              type="button" onClick={() => remove(i.kod)}
              className="self-start p-1 text-ink-faint hover:text-ink" aria-label={t.common.remove}
            >×</button>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
        <div className="flex justify-between border-b border-line pb-4">
          <span className="text-ink-muted">{t.common.subtotal}</span>
          <span className="font-semibold tabular-nums">{money(subtotal)}</span>
        </div>
        <p className="mt-4 text-[13.5px] text-ink-faint">
          {t.cart.deliveryNote}
        </p>
        <Link
          href={L(locale, "/sifaris")}
          className="mt-5 block rounded-xl bg-emerald px-6 py-4 text-center font-bold text-surface transition-colors hover:bg-emerald-dark"
        >
          {t.cart.checkout}
        </Link>
        <Link href={L(locale, "/kataloq")} className="mt-3 block text-center text-[14.5px] text-ink-muted hover:text-ink">
          {t.cart.keepShopping}
        </Link>
      </aside>
    </div>
  );
}
