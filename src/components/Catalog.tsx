"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category, Product, Stock } from "@/lib/product-view";
import { L, type Locale } from "@/i18n/config";
import { fill, type Dictionary } from "@/i18n";
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
  locale: Locale;
  t: Dictionary;
};

function parseStock(v: string | null): Stock | null {
  return v === "var" || v === "sifarisle" || v === "satilib" ? v : null;
}

function countStock(list: Product[], s: Stock) {
  return list.filter((p) => p.stok === s).length;
}

export function Catalog({
  all, activeCategory, title, intro, categories, categoryCounts, totalCount, locale, t,
}: Props) {
  const activeStock = parseStock(useSearchParams().get("stok"));
  const items = activeStock ? all.filter((p) => p.stok === activeStock) : all;
  const base = activeCategory ? L(locale, `/kataloq/${activeCategory}`) : L(locale, "/kataloq");

  const tabs: { key: Stock | null; label: string; count: number; tone: string }[] = [
    { key: null, label: t.common.all, count: all.length, tone: "text-ink" },
    { key: "var", label: t.status.inStock, count: countStock(all, "var"), tone: "text-stock-dark" },
    { key: "sifarisle", label: t.status.made, count: countStock(all, "sifarisle"), tone: "text-gold-dark" },
  ];

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 pt-10 lg:px-14 lg:pt-14">
        <h1 className="text-[34px] lg:text-[46px]">{title}</h1>
        <p className="mt-2 text-ink-muted lg:text-[16.5px]">{intro}</p>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-b border-line">
          <div className="flex gap-6 lg:gap-8">
            {tabs.map((tab) => {
              const on = activeStock === tab.key;
              return (
                <Link
                  key={tab.label}
                  href={tab.key ? `${base}?stok=${tab.key}` : base}
                  scroll={false}
                  className={`flex items-center gap-2 pb-3 text-[15px] lg:text-base ${
                    on ? "border-b-2 border-ink font-semibold" : "font-medium"
                  } ${tab.tone}`}
                >
                  {tab.key === "var" && <span className="block size-2 rounded-full bg-stock" aria-hidden="true" />}
                  {tab.key === "sifarisle" && (
                    <span className="block size-2 rounded-full border-2 border-gold" aria-hidden="true" />
                  )}
                  {tab.label} <span className="font-normal text-ink-faint">{tab.count}</span>
                </Link>
              );
            })}
          </div>
          <span className="pb-3 text-sm text-ink-muted">
            {t.common.sortBy}: <b className="font-semibold text-ink">{t.common.sortInStockFirst}</b>
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-20 pt-8 lg:grid-cols-[228px_1fr] lg:gap-11 lg:px-14">
        <aside>
          <details className="lg:hidden">
            <summary className="mb-4 cursor-pointer list-none rounded-xl border border-line bg-surface px-4 py-3 font-semibold">
              {t.common.category}
            </summary>
            <CategoryList {...{ activeCategory, activeStock, categories, categoryCounts, totalCount, locale, t }} />
          </details>
          <div className="hidden lg:block">
            <CategoryList {...{ activeCategory, activeStock, categories, categoryCounts, totalCount, locale, t }} />
          </div>
        </aside>

        <div>
          {items.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-10 text-center">
              <p className="font-display text-[22px]">{t.catalog.emptyTitle}</p>
              <p className="mx-auto mt-3 max-w-[46ch] text-ink-muted">
                {activeStock === "var" ? t.catalog.emptyInStock : t.catalog.emptyOther}
              </p>
              <a
                href={waGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface transition-colors hover:bg-emerald-dark"
              >
                {t.catalog.emptyCta}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
              {items.map((p, i) => (
                <ProductCard key={p.kod} p={p} locale={locale} t={t} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CategoryList({
  activeCategory, activeStock, categories, categoryCounts, totalCount, locale, t,
}: {
  activeCategory: string | null;
  activeStock: Stock | null;
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  locale: Locale;
  t: Dictionary;
}) {
  const q = activeStock ? `?stok=${activeStock}` : "";
  return (
    <nav className="flex flex-col gap-3">
      <span className="eyebrow text-[11px] text-ink-faint">{t.common.category}</span>
      <Link
        href={`${L(locale, "/kataloq")}${q}`}
        className={`flex items-center justify-between text-[14.5px] ${activeCategory === null ? "font-semibold text-emerald" : "text-ink"}`}
      >
        {t.common.all} <span className="text-ink-faint">{totalCount}</span>
      </Link>
      {categories.map((c) => (
        <Link
          key={c.acar}
          href={`${L(locale, `/kataloq/${c.acar}`)}${q}`}
          className={`flex items-center justify-between text-[14.5px] ${activeCategory === c.acar ? "font-semibold text-emerald" : "text-ink"}`}
        >
          {c.ad} <span className="text-ink-faint">{categoryCounts[c.acar] ?? 0}</span>
        </Link>
      ))}
    </nav>
  );
}

// fill() lüğət şablonları üçün ehtiyatda saxlanılır
void fill;
