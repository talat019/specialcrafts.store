import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Kataloq",
  description:
    "Epoksid əl işlərinin tam kataloqu — divar saatları, şahmat və domino dəstləri, xəttatlıq pannoları. Stokda olanlar və sifarişlə hazırlananlar.",
};

export default function KataloqPage() {
  return (
    <Suspense>
      <Catalog
        all={products}
        activeCategory={null}
        title="Kataloq"
        intro={`${products.length} iş · hər biri tək nüsxə`}
      />
    </Suspense>
  );
}
