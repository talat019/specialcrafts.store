"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";
import { createOrderAction, resolveCartAction } from "@/lib/actions";
import type { ResolvedLine } from "@/lib/order-labels";
import { maxTier, shippingCost, zoneForCountry, type ShipTier, type Zone } from "@/lib/shipping";
import { L, type Locale } from "@/i18n/config";
import { fill, type Dictionary } from "@/i18n";

type CountryOption = { code: string; name: string; zone: string };

export function CheckoutForm({
  providers, countries, rates, transit, locale, t,
}: {
  providers: { key: string; label: string }[];
  countries: CountryOption[];
  rates: Record<Exclude<Zone, "pickup">, Record<ShipTier, number>>;
  transit: Record<Zone, string>;
  locale: Locale;
  t: Dictionary;
}) {
  const router = useRouter();
  const { lines, ready, clear } = useCart();
  const [items, setItems] = useState<ResolvedLine[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("AZ");
  const [azMethod, setAzMethod] = useState<"baki" | "rayon" | "goturme">("baki");
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

  const domestic = country === "AZ";
  const tier = useMemo<ShipTier>(() => maxTier(items.map((i) => i.shipTier)), [items]);
  const zone = zoneForCountry(country, domestic ? (azMethod === "goturme" ? "pickup" : azMethod === "rayon" ? "region" : "baku") : "baku");
  const fee = shippingCost(zone, tier);
  const total = +(subtotal + fee).toFixed(2);

  if (!ready || loading) return <p className="mt-8 text-ink-muted">{t.common.loading}</p>;

  if (!items.length) {
    return (
      <div className="mt-8 rounded-2xl border border-line bg-surface p-10 text-center">
        <p className="font-display text-[22px]">{t.cart.emptyTitle}</p>
        <Link href={`${L(locale, "/kataloq")}?stok=var`} className="mt-6 inline-block rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface">
          {t.cart.emptyCta}
        </Link>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({}); setFormError(null);
    const fd = new FormData(e.currentTarget);
    const form = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    form.catdirilma = domestic ? azMethod : "beynelxalq";
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
  const err = "mt-1 text-[13px] text-red-700";

  const azOptions: { key: "baki" | "rayon" | "goturme"; label: string; note: string; fee: number }[] = [
    { key: "baki", label: t.zones["az-baku"], note: fill(t.checkout.transit, { days: transit["az-baku"] }), fee: rates["az-baku"][tier] },
    { key: "rayon", label: t.zones["az-region"], note: fill(t.checkout.transit, { days: transit["az-region"] }), fee: rates["az-region"][tier] },
    { key: "goturme", label: t.zones.pickup, note: t.checkout.deliveryPickupNote, fee: 0 },
  ];

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-7">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-display text-[22px]">{t.checkout.contact}</legend>
          <div>
            <label className={label} htmlFor="ad">{t.checkout.name}</label>
            <input id="ad" name="ad" required className={field} placeholder={t.checkout.namePlaceholder} />
            {errors.ad && <p className={err}>{errors.ad}</p>}
          </div>
          <div>
            <label className={label} htmlFor="telefon">{t.checkout.phone}</label>
            <input id="telefon" name="telefon" required className={field} placeholder="+994 50 123 45 67" />
            {errors.telefon && <p className={err}>{errors.telefon}</p>}
          </div>
          <div>
            <label className={label} htmlFor="email">
              {t.checkout.email} <span className="normal-case tracking-normal">({t.common.optional})</span>
            </label>
            <input id="email" name="email" type="email" className={field} placeholder="name@mail.com" />
            {errors.email && <p className={err}>{errors.email}</p>}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-display text-[22px]">{t.checkout.deliveryTitle}</legend>

          <div>
            <label className={label} htmlFor="olke">{t.checkout.country}</label>
            <select id="olke" name="olke" value={country} onChange={(e) => setCountry(e.target.value)} className={field}>
              {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
            {errors.olke && <p className={err}>{errors.olke}</p>}
            <p className="mt-1.5 text-[13px] text-ink-faint">{t.checkout.shippingCalc}</p>
          </div>

          {domestic ? (
            <div className="flex flex-col gap-3">
              {azOptions.map((d) => (
                <label key={d.key} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 ${azMethod === d.key ? "border-emerald bg-stock-tint" : "border-line bg-surface"}`}>
                  <input type="radio" name="az-usul" value={d.key} checked={azMethod === d.key}
                    onChange={() => setAzMethod(d.key)} className="accent-[#1F6B5B]" />
                  <span className="flex-1">
                    <span className="block font-semibold">{d.label}</span>
                    <span className="block text-[13.5px] text-ink-muted">{d.note}</span>
                  </span>
                  <span className="font-semibold tabular-nums">{d.fee === 0 ? t.common.free : money(d.fee)}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-surface px-4 py-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold">{t.zones[zone as keyof typeof t.zones] ?? zone}</span>
                <span className="font-semibold tabular-nums">{money(fee)}</span>
              </div>
              <span className="mt-0.5 block text-[13.5px] text-ink-muted">
                {fill(t.checkout.transit, { days: transit[zone] })}
              </span>
            </div>
          )}

          {azMethod !== "goturme" || !domestic ? (
            <>
              {!domestic && (
                <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                  <div>
                    <label className={label} htmlFor="seher">{t.checkout.city}</label>
                    <input id="seher" name="seher" className={field} />
                    {errors.seher && <p className={err}>{errors.seher}</p>}
                  </div>
                  <div>
                    <label className={label} htmlFor="indeks">{t.checkout.postalCode}</label>
                    <input id="indeks" name="indeks" className={field} />
                  </div>
                </div>
              )}
              <div>
                <label className={label} htmlFor="unvan">{t.checkout.address}</label>
                <textarea id="unvan" name="unvan" rows={3} className={field} placeholder={t.checkout.addressPlaceholder} />
                {errors.unvan && <p className={err}>{errors.unvan}</p>}
              </div>
            </>
          ) : null}

          {!domestic && (
            <div className="flex flex-col gap-2 rounded-xl border border-order-line bg-order-tint px-4 py-3.5 text-[13.5px] leading-relaxed text-gold-dark">
              <span>{t.checkout.customsNote}</span>
              <span>{t.checkout.fragileNote}</span>
            </div>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-display text-[22px]">{t.checkout.paymentTitle}</legend>
          {providers.map((p) => (
            <label key={p.key} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 ${provider === p.key ? "border-emerald bg-stock-tint" : "border-line bg-surface"}`}>
              <input type="radio" name="provayder" value={p.key} checked={provider === p.key}
                onChange={() => setProvider(p.key)} className="accent-[#1F6B5B]" />
              <span className="font-semibold">{p.label}</span>
            </label>
          ))}
        </fieldset>

        <div>
          <label className={label} htmlFor="qeyd">
            {t.checkout.note} <span className="normal-case tracking-normal">({t.common.optional})</span>
          </label>
          <textarea id="qeyd" name="qeyd" rows={3} className={field} placeholder={t.checkout.notePlaceholder} />
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-[22px]">{t.checkout.summary}</h2>
        <ul className="mt-4 flex flex-col gap-3 border-b border-line pb-4">
          {items.map((i) => (
            <li key={i.kod} className="flex gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-band">
                {i.sekil && <Image src={i.sekil} alt="" fill sizes="48px" className="object-cover" />}
              </div>
              <span className="flex-1 text-[14px] leading-snug">
                {i.ad} <span className="text-ink-faint">× {i.qty}</span>
              </span>
              <span className="text-[14px] font-semibold tabular-nums">{money(i.cem)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex flex-col gap-2 text-[15px]">
          <div className="flex justify-between"><dt className="text-ink-muted">{t.common.subtotal}</dt><dd className="tabular-nums">{money(subtotal)}</dd></div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">{t.common.delivery}</dt>
            <dd className="tabular-nums">{fee === 0 ? t.common.free : money(fee)}</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-3 font-display text-[24px]">
            <dt>{t.common.total}</dt><dd className="tabular-nums">{money(total)}</dd>
          </div>
        </dl>

        {formError && (
          <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-800">{formError}</p>
        )}

        <button type="submit" disabled={pending}
          className="mt-5 w-full rounded-xl bg-emerald px-6 py-4 font-bold text-surface transition-colors hover:bg-emerald-dark disabled:opacity-60">
          {pending ? t.checkout.sending : fill(t.checkout.payNow, { total: money(total) })}
        </button>
        <p className="mt-3 text-center text-[13px] text-ink-faint">{t.checkout.redirectNote}</p>
      </aside>
    </form>
  );
}
