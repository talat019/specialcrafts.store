"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category, Product, Stock } from "@/lib/product-view";
import { ProductCard } from "./ProductCard";
import { waGeneral } from "@/lib/whatsapp";

type Props = {
  /** Bu səhifənin bütün məhsulları — filtrləmə brauzerdə olur. */
  all: Product[];
  activeCategory: string | null;
  title: string;
  intro: string;
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalCount: number;
};

function parseStock(v: string | null): Stock | null {
  return v === "var" || v === "sifarisle" || v === "satilib" ? v : null;
}

function countStock(list: Product[], s: Stock) {
  return list.filter((p) => p.stok === s).length;
}

export function Catalog({ all, activeCategory, title, intro, categories, categoryCounts, totalCount }: Props) {
  const activeStock = parseStock(useSearchParams().get("stok"));
  const items = activeStock ? all.filter((p) => p.stok === activeStock) : all;
  const base = activeCategory ? `/kataloq/${activeCategory}` : "/kataloq";

  const tabs: { key: Stock | null; label: string; count: number; tone: string }[] = [
    { key: null, label: "Hamısı", count: all.length, tone: "text-ink" },
    { key: "var", label: "Stokda var", count: countStock(all, "var"), tone: "text-stock-dark" },
    { key: "sifarisle", label: "Sifarişlə", count: countStock(all, "sifarisle"), tone: "text-gold-dark" },
  ];

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 pt-10 lg:px-14 lg:pt-14">
        <h1 className="text-[34px] lg:text-[46px]">{title}</h1>
        <p className="mt-2 text-ink-muted lg:text-[16.5px]">{intro}</p>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-b border-line">
          <div className="flex gap-6 lg:gap-8">
            {tabs.map((t) => {
              const on = activeStock === t.key;
              return (
                <Link
                  key={t.label}
                  href={t.key ? `${base}?stok=${t.key}` : base}
                  scroll={false}
                  className={`flex items-center gap-2 pb-3 text-[15px] lg:text-base ${
                    on ? "border-b-2 border-ink font-semibold" : "font-medium"
                  } ${t.tone}`}
                >
                  {t.key === "var" && <span className="block size-2 rounded-full bg-stock" aria-hidden="true" />}
                  {t.key === "sifarisle" && (
                    <span className="block size-2 rounded-full border-2 border-gold" aria-hidden="true" />
                  )}
                  {t.label} <span className="font-normal text-ink-faint">{t.count}</span>
                </Link>
              );
            })}
          </div>
          <span className="pb-3 text-sm text-ink-muted">
            Sıralama: <b className="font-semibold text-ink">Stokda olanlar əvvəl</b>
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-20 pt-8 lg:grid-cols-[228px_1fr] lg:gap-11 lg:px-14">
        <aside>
          <details className="lg:hidden">
            <summary className="mb-4 cursor-pointer list-none rounded-xl border border-line bg-surface px-4 py-3 font-semibold">
              Kateqoriyalar
            </summary>
            <CategoryList active={activeCategory} activeStock={activeStock} categories={categories} counts={categoryCounts} total={totalCount} />
          </details>
          <div className="hidden lg:block">
            <CategoryList active={activeCategory} activeStock={activeStock} categories={categories} counts={categoryCounts} total={totalCount} />
          </div>
        </aside>

        <div>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-10 text-center">
              <p className="font-display text-[22px]">Bu filtrlə iş tapılmadı</p>
              <p className="mx-auto mt-3 max-w-[46ch] text-ink-muted">
                {activeStock === "var"
                  ? "Hazırda bu kateqoriyada stokda iş yoxdur — sifarişlə 5–7 günə hazırlayırıq."
                  : "İstədiyinizi WhatsApp-da yazın, hazırlayaq."}
              </p>
              <a
                href={waGeneral("Kataloqda tapmadığım bir iş üçün yazıram:")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface transition-colors hover:bg-emerald-dark"
              >
                WhatsApp-da yazın
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
              {items.map((p, i) => (
                <ProductCard key={p.kod} p={p} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CategoryList({
  active, activeStock, categories, counts, total,
}: {
  active: string | null; activeStock: Stock | null;
  categories: Category[]; counts: Record<string, number>; total: number;
}) {
  const q = activeStock ? `?stok=${activeStock}` : "";
  return (
    <nav className="flex flex-col gap-3">
      <span className="eyebrow text-[11px] text-ink-faint">Kateqoriya</span>
      <Link
        href={`/kataloq${q}`}
        className={`flex items-center justify-between text-[14.5px] ${active === null ? "font-semibold text-emerald" : "text-ink"}`}
      >
        Hamısı <span className="text-ink-faint">{total}</span>
      </Link>
      {categories.map((c) => (
        <Link
          key={c.acar}
          href={`/kataloq/${c.acar}${q}`}
          className={`flex items-center justify-between text-[14.5px] ${active === c.acar ? "font-semibold text-emerald" : "text-ink"}`}
        >
          {c.ad} <span className="text-ink-faint">{counts[c.acar] ?? 0}</span>
        </Link>
      ))}
    </nav>
  );
}
