import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import {
  getCategories, getCategory, getCategoryCounts, getProducts, getProductsIn,
} from "@/lib/products";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kateqoriya: string }>;
}): Promise<Metadata> {
  const { kateqoriya } = await params;
  const cat = await getCategory(kateqoriya);
  if (!cat) return {};
  return {
    title: cat.ad,
    description: `Əl ilə hazırlanmış ${cat.ad.toLowerCase()} — epoksid qatrandan. Stokda olanlar dərhal göndərilir.`,
  };
}

export default async function KateqoriyaPage({
  params,
}: {
  params: Promise<{ kateqoriya: string }>;
}) {
  const { kateqoriya } = await params;
  const cat = await getCategory(kateqoriya);
  if (!cat) notFound();

  const [all, categories, counts, total] = await Promise.all([
    getProductsIn(kateqoriya),
    getCategories(),
    getCategoryCounts(),
    getProducts().then((p) => p.length),
  ]);
  if (!all.length) notFound();

  return (
    <Suspense>
      <Catalog
        all={all}
        activeCategory={kateqoriya}
        title={cat.ad}
        intro={`${all.length} iş · kod prefiksi ${cat.kod}`}
        categories={categories}
        categoryCounts={counts}
        totalCount={total}
      />
    </Suspense>
  );
}
