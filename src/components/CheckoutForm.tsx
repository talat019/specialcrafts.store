"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";
import { createOrderAction, resolveCartAction } from "@/lib/actions";
import type { ResolvedLine } from "@/lib/order-labels";

type Delivery = { key: string; label: string; fee: number; note: string };

export function CheckoutForm({
  providers, delivery,
}: {
  providers: { key: string; label: string }[];
  delivery: Delivery[];
}) {
  const router = useRouter();
  const { lines, ready, clear } = useCart();
  const [items, setItems] = useState<ResolvedLine[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<string>(delivery[0].key);
  const [provider, setProvider] = useState<string>(providers[0]?.key ?? "test");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!ready) return;
    if (!lines.length) { setItems([]); setSubtotal(0); setLoading(false); return; }
    resolveCartAction(lines).then((r) => {
      setItems(r.items); setSubtotal(r.subtotal); setLoading(false);
    });
  }, [lines, ready]);

  const fee = delivery.find((d) => d.key === method)?.fee ?? 0;
  const total = +(subtotal + fee).toFixed(2);

  if (!ready || loading) return <p className="mt-8 text-ink-muted">Yüklənir…</p>;

  if (!items.length) {
    return (
      <div className="mt-8 rounded-2xl border border-line bg-surface p-10 text-center">
        <p className="font-display text-[22px]">Səbət boşdur</p>
        <Link href="/kataloq?stok=var" className="mt-6 inline-block rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface">
          Stokda olanlara bax
        </Link>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({}); setFormError(null);
    const fd = new FormData(e.currentTarget);
    const form = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    startTransition(async () => {
      const res = await createOrderAction(lines, form);
      if (!res.ok) {
        setFormError(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      clear();
      router.push(res.paymentUrl);
    });
  }

  const field = "w-full rounded-xl border border-line-strong bg-surface px-4 py-3.5 text-[15px] outline-none focus:border-emerald";
  const label = "mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-ink-faint font-bold";

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-7">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-display text-[22px]">Əlaqə</legend>
          <div>
            <label className={label} htmlFor="ad">Ad, soyad</label>
            <input id="ad" name="ad" required className={field} placeholder="Nigar Əliyeva" />
            {errors.ad && <p className="mt-1 text-[13px] text-red-700">{errors.ad}</p>}
          </div>
          <div>
            <label className={label} htmlFor="telefon">Telefon (WhatsApp)</label>
            <input id="telefon" name="telefon" required className={field} placeholder="+994 50 123 45 67" />
            {errors.telefon && <p className="mt-1 text-[13px] text-red-700">{errors.telefon}</p>}
          </div>
          <div>
            <label className={label} htmlFor="email">E-poçt <span className="normal-case tracking-normal">(istəyə bağlı)</span></label>
            <input id="email" name="email" type="email" className={field} placeholder="ad@mail.com" />
            {errors.email && <p className="mt-1 text-[13px] text-red-700">{errors.email}</p>}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-display text-[22px]">Çatdırılma</legend>
          {delivery.map((d) => (
            <label key={d.key} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 ${method === d.key ? "border-emerald bg-stock-tint" : "border-line bg-surface"}`}>
              <input type="radio" name="catdirilma" value={d.key} checked={method === d.key}
                onChange={() => setMethod(d.key)} className="accent-[#1F6B5B]" />
              <span className="flex-1">
                <span className="block font-semibold">{d.label}</span>
                <span className="block text-[13.5px] text-ink-muted">{d.note}</span>
              </span>
              <span className="font-semibold tabular-nums">{d.fee === 0 ? "pulsuz" : money(d.fee)}</span>
            </label>
          ))}
          {method !== "goturme" && (
            <div className="mt-1">
              <label className={label} htmlFor="unvan">Ünvan</label>
              <textarea id="unvan" name="unvan" rows={3} className={field} placeholder="Şəhər, rayon, küçə, bina, mənzil" />
              {errors.unvan && <p className="mt-1 text-[13px] text-red-700">{errors.unvan}</p>}
            </div>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-display text-[22px]">Ödəniş üsulu</legend>
          {providers.map((p) => (
            <label key={p.key} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 ${provider === p.key ? "border-emerald bg-stock-tint" : "border-line bg-surface"}`}>
              <input type="radio" name="provayder" value={p.key} checked={provider === p.key}
                onChange={() => setProvider(p.key)} className="accent-[#1F6B5B]" />
              <span className="font-semibold">{p.label}</span>
            </label>
          ))}
        </fieldset>

        <div>
          <label className={label} htmlFor="qeyd">Qeyd <span className="normal-case tracking-normal">(istəyə bağlı)</span></label>
          <textarea id="qeyd" name="qeyd" rows={3} className={field} placeholder="Hədiyyə paketi, çatdırılma vaxtı və s." />
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-[22px]">Sifariş</h2>
        <ul className="mt-4 flex flex-col gap-3 border-b border-line pb-4">
          {items.map((i) => (
            <li key={i.kod} className="flex gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-band">
                {i.sekil && <Image src={i.sekil} alt="" fill sizes="48px" className="object-cover" />}
              </div>
              <span className="flex-1 text-[14px] leading-snug">{i.ad} <span className="text-ink-faint">× {i.qty}</span></span>
              <span className="text-[14px] font-semibold tabular-nums">{money(i.cem)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex flex-col gap-2 text-[15px]">
          <div className="flex justify-between"><dt className="text-ink-muted">Məhsullar</dt><dd className="tabular-nums">{money(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-muted">Çatdırılma</dt><dd className="tabular-nums">{fee === 0 ? "pulsuz" : money(fee)}</dd></div>
          <div className="mt-2 flex justify-between border-t border-line pt-3 font-display text-[24px]">
            <dt>Cəmi</dt><dd className="tabular-nums">{money(total)}</dd>
          </div>
        </dl>

        {formError && (
          <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-800">{formError}</p>
        )}

        <button
          type="submit" disabled={pending}
          className="mt-5 w-full rounded-xl bg-emerald px-6 py-4 font-bold text-surface transition-colors hover:bg-emerald-dark disabled:opacity-60"
        >
          {pending ? "Göndərilir…" : `Ödənişə keç — ${money(total)}`}
        </button>
        <p className="mt-3 text-center text-[13px] text-ink-faint">
          Düyməyə basdıqda ödəniş səhifəsinə yönləndirilirsiniz.
        </p>
      </aside>
    </form>
  );
}
