import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";
import { getCategories, getCategoryCounts, getProducts } from "@/lib/products";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Kataloq",
  description:
    "Epoksid əl işlərinin tam kataloqu — divar saatları, şahmat və domino dəstləri, xəttatlıq pannoları, aksesuar və suvenirlər.",
};

export default async function KataloqPage() {
  const [all, categories, counts] = await Promise.all([
    getProducts(),
    getCategories(),
    getCategoryCounts(),
  ]);

  return (
    <Suspense>
      <Catalog
        all={all}
        activeCategory={null}
        title="Kataloq"
        intro={`${all.length} iş · əksəriyyəti tək nüsxə`}
        categories={categories}
        categoryCounts={counts}
        totalCount={all.length}
      />
    </Suspense>
  );
}
