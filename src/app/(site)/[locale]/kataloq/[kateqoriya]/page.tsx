import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import {
  getCategories, getCategory, getCategoryCounts, getProducts, getProductsIn,
} from "@/lib/products";
import { isLocale, type Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; kateqoriya: string }> }): Promise<Metadata> {
  const { locale, kateqoriya } = await params;
  if (!isLocale(locale)) return {};
  const cat = await getCategory(locale, kateqoriya);
  if (!cat) return {};
  const t = getDictionary(locale);
  return { title: cat.ad, description: `${cat.ad} — ${t.meta.tagline}. ${t.meta.description}` };
}

export default async function KateqoriyaPage({
  params,
}: { params: Promise<{ locale: string; kateqoriya: string }> }) {
  const { locale, kateqoriya } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = getDictionary(l);

  const cat = await getCategory(l, kateqoriya);
  if (!cat) notFound();

  const [all, categories, counts, total] = await Promise.all([
    getProductsIn(l, kateqoriya), getCategories(l), getCategoryCounts(),
    getProducts(l).then((p) => p.length),
  ]);
  if (!all.length) notFound();

  return (
    <Suspense>
      <Catalog
        all={all}
        activeCategory={kateqoriya}
        title={cat.ad}
        intro={fill(t.catalog.introCategory, { n: all.length, code: cat.kod })}
        categories={categories}
        categoryCounts={counts}
        totalCount={total}
        locale={l}
        t={t}
      />
    </Suspense>
  );
}
