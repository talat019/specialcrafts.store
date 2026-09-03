import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import {
  getCategory, getProductByCode, getRelated, priceLabel, leadTimeLabel, isBuyable, days, type Product,
} from "@/lib/products";
import { money } from "@/lib/money";
import { waProduct } from "@/lib/whatsapp";
import { StatusBar } from "@/components/StatusBadge";
import { ProductCard } from "@/components/ProductCard";
import { AddToCart } from "@/components/AddToCart";
import { WhatsAppIcon } from "@/components/Icons";
import { L, isLocale, type Locale } from "@/i18n/config";
import { fill, getDictionary, type Dictionary } from "@/i18n";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; kod: string }> }): Promise<Metadata> {
  const { locale, kod } = await params;
  if (!isLocale(locale)) return {};
  const p = await getProductByCode(locale, kod);
  if (!p) return {};
  return {
    title: p.ad,
    description: p.tesvir,
    openGraph: { title: p.ad, description: p.tesvir, images: p.sekiller.slice(0, 1) },
  };
}

function specs(p: Product, t: Dictionary, unit: string, stockDays: string) {
  const rows: [string, string][] = [[t.product.specMaterial, p.material.join(", ")]];
  const dim = t.product.dimensions as Record<string, string>;
  for (const [k, v] of Object.entries(p.olcu)) {
    if (v != null && dim[k]) rows.push([dim[k], String(v)]);
  }
  rows.push([t.product.specUnique, p.teksNusxe ? t.product.specUniqueOne : t.product.specSet]);
  rows.push([
    p.stok === "var" ? t.product.specDelivery : t.product.specLead,
    leadTimeLabel(p, t.common.workingDays, site.stockDays),
  ]);
  return rows;
}

export default async function MehsulPage({
  params,
}: { params: Promise<{ locale: string; kod: string }> }) {
  const { locale, kod } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = getDictionary(l);

  const p = await getProductByCode(l, kod);
  if (!p) notFound();

  const [cat, relatedItems] = await Promise.all([getCategory(l, p.kateqoriya), getRelated(l, p)]);
  const sold = p.stok === "satilib";
  const buyable = isBuyable(p);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.ad,
    sku: p.kod,
    description: p.tesvir,
    image: p.sekiller.map((s) => `${site.url}${s}`),
    material: p.material.join(", "),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: p.valyuta,
      ...(p.qiymet != null ? { price: p.qiymet } : {}),
      availability:
        p.stok === "var" ? "https://schema.org/InStock"
        : p.stok === "satilib" ? "https://schema.org/SoldOut"
        : "https://schema.org/PreOrder",
      url: `${site.url}${L(l, `/mehsul/${p.kod.toLowerCase()}`)}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <nav className="mx-auto max-w-[1440px] px-5 pt-6 text-[13.5px] text-ink-faint lg:px-14">
        <Link href={L(l, "/kataloq")} className="hover:text-ink">{t.catalog.title}</Link>
        {" · "}
        <Link href={L(l, `/kataloq/${p.kateqoriya}`)} className="hover:text-ink">{cat?.ad ?? p.kateqoriya}</Link>
        {" · "}
        <span className="text-ink">{p.ad}</span>
      </nav>

      <div className="mx-auto grid max-w-[1440px] items-start gap-8 px-5 pt-6 lg:grid-cols-2 lg:gap-14 lg:px-14">
        <div className="flex flex-col gap-3.5">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-band lg:aspect-[4/5]">
            <Image src={p.sekiller[0]} alt={p.ad} fill sizes="(max-width: 1024px) 100vw, 640px" priority
              className={`object-cover ${sold ? "grayscale-[0.35] opacity-80" : ""}`} />
          </div>
          {p.sekiller.length > 1 && (
            <div className="grid grid-cols-4 gap-3.5">
              {p.sekiller.slice(1).map((s) => (
                <div key={s} className="relative aspect-square overflow-hidden rounded-xl bg-band">
                  <Image src={s} alt={p.ad} fill sizes="160px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-[32px] leading-tight lg:text-[44px]">{p.ad}</h1>
          <span className="code mt-2.5 text-[12.5px] text-ink-faint">{p.kod}</span>

          {p.qiymet == null ? (
            <p className="mt-5 text-[17px] font-semibold text-ink-muted">
              {t.common.priceVaries} <span className="text-emerald">{t.common.priceVariesLink}</span>
            </p>
          ) : (
            <p className={`mt-5 font-display text-[32px] lg:text-[38px] ${sold ? "text-ink-faint line-through" : ""}`}>
              {money(p.qiymet)}
            </p>
          )}

          <div className="mt-5">
            <StatusBar stok={p.stok} t={t} lead={leadTimeLabel(p, t.common.workingDays, site.stockDays)} stockLabel={days(site.stockDays, t.common.workingDays)} />
          </div>

          <p className="mt-6 leading-relaxed text-ink-muted lg:text-[16.5px]">{p.tesvir}</p>

          {p.stok === "sifarisle" && (p.rengSecimleri.length > 0 || p.hekkMumkun) && (
            <div className="mt-8 flex flex-col gap-6">
              {p.rengSecimleri.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="eyebrow text-[11px] text-ink-faint">{t.product.colours}</span>
                  <div className="flex flex-wrap gap-2.5">
                    {p.rengSecimleri.map((r, i) => (
                      <span key={r} className={`rounded-xl border px-4 py-2.5 text-[14.5px] ${
                        i === 0 ? "border-emerald bg-stock-tint font-semibold text-emerald" : "border-line-strong bg-surface"}`}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {p.hekkMumkun && <p className="text-[15px] text-ink-muted">{t.product.engraving}</p>}
            </div>
          )}

          {p.stok === "var" && (
            <div className="mt-7 rounded-xl border border-dashed border-line-strong bg-surface px-5 py-4">
              <p className="text-[14.5px] leading-relaxed text-ink-muted">{t.product.readyNoOptions}</p>
              <Link href={L(l, "/ferdi-sifaris")} className="mt-2 inline-block text-[14.5px] font-semibold text-emerald hover:text-emerald-dark">
                {t.product.wantCustom}
              </Link>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            {buyable ? (
              <>
                <AddToCart kod={p.kod} max={p.stokSayi} locale={l}
                  labels={{ add: t.product.addToCart, inCart: t.product.inCart, goToCart: t.product.goToCart }} />
                <a href={waProduct(p)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl border border-line-strong px-7 py-4 text-[15px] font-semibold transition-colors hover:border-ink">
                  <WhatsAppIcon className="size-[18px]" />
                  {t.product.orderOnWhatsapp}
                </a>
              </>
            ) : (
              <>
                <a href={waProduct(p)} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2.5 rounded-2xl px-7 py-5 text-[17px] font-bold transition-colors ${
                    sold ? "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-surface" : "bg-emerald text-surface hover:bg-emerald-dark"}`}>
                  {!sold && <WhatsAppIcon className="size-5" />}
                  {sold ? t.product.orderSimilar : t.product.order}
                </a>
                <p className="text-center text-[13.5px] text-ink-faint">
                  {sold ? fill(t.product.soldNote, { lead: days(site.leadDays, t.common.workingDays) })
                    : p.qiymet == null ? t.product.priceNote : t.product.whatsappNote}
                </p>
              </>
            )}
            {buyable && p.stokSayi <= 1 && (
              <p className="text-center text-[13.5px] font-semibold text-stock-dark">{t.common.onePieceLeft}</p>
            )}
          </div>

          <ul className="mt-7 flex flex-wrap gap-2">
            {[t.product.trustHandmade,
              p.teksNusxe ? t.product.specUniqueOne : t.product.specSet,
              t.product.trustGiftBox,
              fill(t.product.trustDelivery, { city: site.city })].map((x) => (
              <li key={x} className="rounded-full border border-line bg-surface px-4 py-1.5 text-[13px]">{x}</li>
            ))}
          </ul>

          <div className="mt-9">
            <span className="eyebrow text-[11px] text-ink-faint">{t.product.specs}</span>
            <dl className="mt-3">
              {specs(p, t, t.common.workingDays, site.stockDays).map(([k, v], i, arr) => (
                <div key={k} className={`flex justify-between gap-6 py-3.5 text-[15px] ${i < arr.length - 1 ? "border-b border-line" : ""}`}>
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-5 pb-28 pt-16 lg:px-14 lg:pb-24 lg:pt-24">
        <h2 className="mb-6 text-[26px] lg:text-[32px]">{t.product.related}</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {relatedItems.map((r) => <ProductCard key={r.kod} p={r} locale={l} t={t} />)}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3.5 border-t border-line bg-ground/97 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex shrink-0 flex-col">
          {p.qiymet != null && (
            <span className={`font-display text-[22px] leading-none ${sold ? "text-ink-faint line-through" : ""}`}>
              {priceLabel(p)}
            </span>
          )}
          <span className={`flex items-center gap-1.5 eyebrow text-[10px] ${
            p.stok === "var" ? "text-stock-dark" : p.stok === "satilib" ? "text-sold" : "text-gold-dark"}`}>
            <span className={`block size-1.5 rounded-full ${
              p.stok === "var" ? "bg-stock" : p.stok === "satilib" ? "bg-sold" : "border-2 border-gold"}`} aria-hidden="true" />
            {p.stok === "var" ? t.status.inStock : p.stok === "satilib" ? t.status.sold : t.status.made}
          </span>
        </div>
        {buyable ? (
          <div className="flex-1">
            <AddToCart kod={p.kod} max={p.stokSayi} locale={l}
              labels={{ add: t.product.addToCart, inCart: t.product.inCart, goToCart: t.product.goToCart }} />
          </div>
        ) : (
          <a href={waProduct(p)} target="_blank" rel="noopener noreferrer"
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold ${
              sold ? "border-[1.5px] border-ink text-ink" : "bg-emerald text-surface"}`}>
            {!sold && <WhatsAppIcon className="size-[19px]" />}
            {sold ? t.product.orderSimilar : t.product.order}
          </a>
        )}
      </div>
    </>
  );
}
