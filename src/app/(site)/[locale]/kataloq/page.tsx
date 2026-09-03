import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import { getCategories, getCategoryCounts, getProducts } from "@/lib/products";
import { isLocale, type Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.catalog.title, description: t.meta.description };
}

export default async function KataloqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = getDictionary(l);

  const [all, categories, counts] = await Promise.all([
    getProducts(l), getCategories(l), getCategoryCounts(),
  ]);

  return (
    <Suspense>
      <Catalog
        all={all}
        activeCategory={null}
        title={t.catalog.title}
        intro={fill(t.catalog.intro, { n: all.length })}
        categories={categories}
        categoryCounts={counts}
        totalCount={all.length}
        locale={l}
        t={t}
      />
    </Suspense>
  );
}
