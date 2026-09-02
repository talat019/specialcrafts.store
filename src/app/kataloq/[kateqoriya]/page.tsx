import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/Catalog";
import { categories, categoryByKey, productsIn } from "@/lib/products";

export function generateStaticParams() {
  return categories.map((c) => ({ kateqoriya: c.acar }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kateqoriya: string }>;
}): Promise<Metadata> {
  const { kateqoriya } = await params;
  const cat = categoryByKey(kateqoriya);
  if (!cat) return {};
  return {
    title: cat.ad,
    description: `Əl ilə hazırlanmış ${cat.ad.toLowerCase()} — epoksid qatrandan, tək nüsxə. Stokda olanlar dərhal göndərilir.`,
  };
}

export default async function KateqoriyaPage({
  params,
}: {
  params: Promise<{ kateqoriya: string }>;
}) {
  const { kateqoriya } = await params;
  const cat = categoryByKey(kateqoriya);
  if (!cat) notFound();
  const all = productsIn(kateqoriya);

  return (
    <Suspense>
      <Catalog
        all={all}
        activeCategory={kateqoriya}
        title={cat.ad}
        intro={`${all.length} iş · kod prefiksi ${cat.kod}`}
      />
    </Suspense>
  );
}
