import { adminCategories } from "@/lib/admin-actions";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function YeniMehsul() {
  const cats = await adminCategories();
  return (
    <>
      <h1 className="font-display text-[30px]">Yeni məhsul</h1>
      <ProductForm
        id={null}
        cats={cats}
        images={[]}
        initial={{
          code: "", name: "", categoryKey: cats[0]?.key ?? "", price: "",
          stock: "var", stockQty: 1, description: "",
          material: "Epoksid qatran", colorOptions: "",
          isUnique: true, engraving: false, active: true,
        }}
      />
    </>
  );
}
