import Image from "next/image";
import Link from "next/link";
import { adminCategories, adminProducts } from "@/lib/admin-actions";
import { StockControls } from "@/components/admin/StockControls";

export default async function AdminProducts() {
  const [items, cats] = await Promise.all([adminProducts(), adminCategories()]);
  const catName = Object.fromEntries(cats.map((c) => [c.key, c.name]));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[30px]">Məhsullar <span className="text-ink-faint">{items.length}</span></h1>
        <Link href="/admin/mehsullar/yeni" className="rounded-xl bg-emerald px-5 py-3 font-semibold text-surface hover:bg-emerald-dark">
          + Yeni məhsul
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[860px] text-[14.5px]">
          <thead className="bg-band text-left text-[12px] uppercase tracking-[0.12em] text-ink-faint">
            <tr>
              <th className="px-4 py-3">Məhsul</th><th className="px-4 py-3">Kateqoriya</th>
              <th className="px-4 py-3">Qiymət</th><th className="px-4 py-3">Stok</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className={`border-t border-line ${p.active ? "" : "opacity-50"}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-band">
                      {p.image && <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />}
                    </div>
                    <div>
                      <Link href={`/admin/mehsullar/${p.id}`} className="font-semibold hover:text-emerald">{p.name}</Link>
                      <div className="code text-[11px] text-ink-faint">{p.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{catName[p.categoryKey] ?? p.categoryKey}</td>
                <td className={`px-4 py-3 tabular-nums ${p.price == null ? "text-gold-dark" : ""}`}>
                  {p.price == null ? "yoxdur" : `${Number(p.price)} ₼`}
                </td>
                <td className="px-4 py-3"><StockControls id={p.id} stock={p.stock} qty={p.stockQty} /></td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/mehsullar/${p.id}`} className="text-[13.5px] text-emerald hover:underline">Redaktə</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
