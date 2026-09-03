import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import {
  getCategories, getCategoryCounts, getFeaturedInStock, getProducts, getProductsIn, getStockCounts,
} from "@/lib/products";
import { days } from "@/lib/product-view";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "@/components/Icons";
import { L, isLocale, type Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n";

export const revalidate = 0;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = getDictionary(l);

  const [products, categories, counts, inStock, panels, stock] = await Promise.all([
    getProducts(l), getCategories(l), getCategoryCounts(),
    getFeaturedInStock(l, 5), getProductsIn(l, "panno"), getStockCounts(),
  ]);
  const hero = products.find((p) => p.kod === "SHM-005") ?? products[0];
  const panelPair = panels.slice(0, 2);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="grid items-center lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6 px-5 py-14 lg:px-14 lg:py-24">
          <span className="eyebrow text-gold">{t.home.eyebrow}</span>
          <h1 className="text-[46px] leading-[1.04] tracking-tight lg:text-[76px]">
            {t.home.h1a}<br />{t.home.h1b}
          </h1>
          <p className="max-w-[36ch] text-[17px] leading-relaxed text-ink-muted lg:text-[18.5px]">
            {fill(t.home.lede, { lead: days(site.leadDays, t.common.workingDays) })}
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href={L(l, "/kataloq")} className="rounded-full bg-emerald px-8 py-4 text-center font-semibold text-surface transition-colors hover:bg-emerald-dark">
              {t.home.ctaCatalog}
            </Link>
            <Link href={`${L(l, "/kataloq")}?stok=var`} className="flex items-center justify-center gap-2.5 rounded-full border border-ink px-8 py-4 font-semibold transition-colors hover:bg-ink hover:text-surface">
              <span className="block size-2 rounded-full bg-stock" aria-hidden="true" />
              {t.home.ctaInStock}
            </Link>
          </div>
        </div>

        <div className="relative h-[320px] lg:h-[620px]">
          <Image src={hero.sekiller[0]} alt={hero.ad} fill sizes="(max-width: 1024px) 100vw, 720px" priority className="object-cover" />
          <Link
            href={L(l, `/mehsul/${hero.kod.toLowerCase()}`)}
            className="absolute bottom-5 left-5 flex flex-col gap-1 rounded-xl bg-surface/94 px-5 py-3 backdrop-blur transition-colors hover:bg-surface lg:bottom-7 lg:left-7"
          >
            <span className="text-[14.5px] font-semibold">{hero.ad}</span>
            <span className="code text-[11.5px] text-ink-faint">{hero.kod}</span>
          </Link>
        </div>
      </section>

      {/* ---------------- KATEQORİYALAR ---------------- */}
      <section className="mx-auto max-w-[1440px] px-5 pt-16 lg:px-14 lg:pt-24">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="text-[30px] lg:text-[40px]">{t.home.whatWeMake}</h2>
          <span className="shrink-0 text-[13.5px] text-ink-faint">
            {fill(t.home.categoriesCount, { cats: categories.length, items: products.length })}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-3 lg:gap-5">
          {categories.map((c) => {
            const first = inStock.find((p) => p.kateqoriya === c.acar) ?? products.find((p) => p.kateqoriya === c.acar);
            if (!first) return null;
            return (
              <Link key={c.acar} href={L(l, `/kataloq/${c.acar}`)} className="group overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong">
                <div className="relative aspect-[4/3] overflow-hidden bg-band lg:aspect-[16/11]">
                  <Image src={first.sekiller[0]} alt="" fill sizes="(max-width: 1024px) 50vw, 440px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex items-baseline justify-between gap-2 px-4 py-3.5 lg:px-5 lg:py-4">
                  <span className="font-display text-[17px] lg:text-[22px]">{c.ad}</span>
                  <span className="shrink-0 text-[13px] text-ink-faint">{counts[c.acar] ?? 0}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------- STOKDA HAZIR ---------------- */}
      {inStock.length > 0 && (
        <section className="mt-16 bg-band py-14 lg:mt-24 lg:py-18">
          <div className="mx-auto max-w-[1440px] px-5 lg:px-14">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-2.5">
                <span className="flex items-center gap-2 eyebrow text-stock">
                  <span className="block size-2.5 rounded-full bg-stock" aria-hidden="true" />
                  {t.home.inStockEyebrow}
                </span>
                <h2 className="text-[30px] lg:text-[40px]">{t.home.inStockTitle}</h2>
                <p className="max-w-[48ch] text-ink-muted">
                  {fill(t.home.inStockLede, { days: days(site.stockDays, t.common.workingDays) })}
                </p>
              </div>
              <Link href={`${L(l, "/kataloq")}?stok=var`} className="flex shrink-0 items-center gap-2 font-semibold text-emerald transition-colors hover:text-emerald-dark">
                {fill(t.home.seeAll, { n: stock.var })} <ArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {inStock.map((p) => <ProductCard key={p.kod} p={p} locale={l} t={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- PANNO — TÜND ZOLAQ ---------------- */}
      {panelPair.length === 2 && (
        <section className="bg-dark py-16 text-dark-ink lg:py-22">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 lg:grid-cols-2 lg:gap-14 lg:px-14">
            <div className="flex flex-col items-start gap-5">
              <span className="eyebrow text-gold-bright">{t.home.panelsEyebrow}</span>
              <h2 className="text-[32px] leading-tight text-dark-ink lg:text-[44px]">{t.home.panelsTitle}</h2>
              <p className="max-w-[42ch] leading-relaxed text-dark-muted lg:text-[17px]">{t.home.panelsBody}</p>
              <Link href={L(l, "/kataloq/panno")} className="mt-1 rounded-full border border-dark-line px-7 py-3.5 font-semibold transition-colors hover:bg-dark-line">
                {t.home.panelsCta}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {panelPair.map((p, i) => (
                <Link key={p.kod} href={L(l, `/mehsul/${p.kod.toLowerCase()}`)} className={`relative aspect-[3/4] overflow-hidden rounded-2xl ${i === 1 ? "lg:mt-9" : ""}`}>
                  <Image src={p.sekiller[0]} alt={p.ad} fill sizes="(max-width: 1024px) 45vw, 320px" className="object-cover transition-transform duration-500 hover:scale-[1.03]" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- NECƏ İŞLƏYİR ---------------- */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-14 lg:py-24">
        <h2 className="mb-3 text-[30px] lg:text-[40px]">{t.home.howTitle}</h2>
        <p className="mb-9 text-ink-muted lg:text-[16.5px]">{t.home.howLede}</p>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-7 lg:p-9">
            <span className="flex items-center gap-2.5 eyebrow text-[12px] text-stock">
              <span className="block size-2.5 rounded-full bg-stock" aria-hidden="true" />
              {t.status.inStock}
            </span>
            <span className="font-display text-[24px] lg:text-[26px]">
              {fill(t.home.howStockTitle, { days: days(site.stockDays, t.common.workingDays) })}
            </span>
            <ol className="flex flex-col gap-3.5">
              {[t.home.howStock1, t.home.howStock2, t.home.howStock3].map((s, i) => (
                <li key={s} className="flex items-baseline gap-3.5">
                  <span className="min-w-[22px] font-display text-[20px] text-stock">{i + 1}</span>
                  <span className="text-[15.5px]">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-7 lg:p-9">
            <span className="flex items-center gap-2.5 eyebrow text-[12px] text-gold">
              <span className="block size-2.5 rounded-full border-2 border-gold" aria-hidden="true" />
              {t.status.made}
            </span>
            <span className="font-display text-[24px] lg:text-[26px]">
              {fill(t.home.howMadeTitle, { lead: days(site.leadDays, t.common.workingDays) })}
            </span>
            <ol className="flex flex-col gap-3.5">
              {[t.home.howMade1, t.home.howMade2, t.home.howMade3].map((s, i) => (
                <li key={s} className="flex items-baseline gap-3.5">
                  <span className="min-w-[22px] font-display text-[20px] text-gold">{i + 1}</span>
                  <span className="text-[15.5px]">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- ATELYE ---------------- */}
      <section className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-14 lg:pb-24">
        <div className="flex flex-col gap-6 rounded-3xl border border-line bg-surface p-7 lg:p-12">
          <span className="eyebrow text-gold">{t.home.studioEyebrow}</span>
          <h2 className="max-w-[22ch] text-[26px] leading-tight lg:text-[36px]">{t.home.studioTitle}</h2>
          <p className="max-w-[64ch] leading-relaxed text-ink-muted lg:text-[16.5px]">{t.home.studioBody}</p>
          <dl className="mt-1 flex flex-wrap gap-x-10 gap-y-5">
            {[
              [site.followers, t.home.statFollowers],
              [String(products.length), t.home.statItems],
              [site.leadDays, t.home.statLead],
            ].map(([v, k]) => (
              <div key={k} className="flex flex-col">
                <dt className="font-display text-[28px] lg:text-[30px]">{v}</dt>
                <dd className="text-[13px] text-ink-faint">{k}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
