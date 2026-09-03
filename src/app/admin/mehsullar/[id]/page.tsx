import { notFound } from "next/navigation";
import Link from "next/link";
import { adminCategories, adminProduct } from "@/lib/admin-actions";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function MehsulRedakte({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [data, cats] = await Promise.all([adminProduct(id), adminCategories()]);
  if (!data) notFound();
  const { product: p, images } = data;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[30px]">{p.name}</h1>
        <Link href={`/mehsul/${p.code.toLowerCase()}`} target="_blank" className="text-[14px] text-emerald hover:underline">
          Saytda bax →
        </Link>
      </div>
      <ProductForm
        id={p.id}
        cats={cats}
        images={images.map((i) => ({ id: i.id, url: i.url }))}
        initial={{
          code: p.code, name: p.name, categoryKey: p.categoryKey,
          price: p.price == null ? "" : String(Number(p.price)),
          stock: p.stock, stockQty: p.stockQty, description: p.description,
          material: (p.material ?? []).join(", "),
          colorOptions: (p.colorOptions ?? []).join(", "),
          isUnique: p.isUnique, engraving: p.engraving, active: p.active,
        }}
      />
    </>
  );
}
