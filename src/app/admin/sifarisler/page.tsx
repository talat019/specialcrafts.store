import Link from "next/link";
import { adminOrders } from "@/lib/admin-actions";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/orders";

const payTone: Record<string, string> = {
  odenilib: "bg-stock-tint text-stock-dark border-stock-line",
  gozlenilir: "bg-order-tint text-gold-dark border-order-line",
  ugursuz: "bg-red-50 text-red-800 border-red-200",
  legv: "bg-sold-tint text-sold border-sold-line",
};

export default async function AdminOrders() {
  const items = await adminOrders();
  return (
    <>
      <h1 className="font-display text-[30px]">Sifarişlər <span className="text-ink-faint">{items.length}</span></h1>
      {items.length === 0 ? (
        <p className="mt-4 text-ink-muted">Hələ sifariş yoxdur. Test rejimində sifariş verib yoxlaya bilərsiniz.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[820px] text-[14.5px]">
            <thead className="bg-band text-left text-[12px] uppercase tracking-[0.12em] text-ink-faint">
              <tr>
                <th className="px-4 py-3">Nömrə</th><th className="px-4 py-3">Tarix</th>
                <th className="px-4 py-3">Müştəri</th><th className="px-4 py-3">Məbləğ</th>
                <th className="px-4 py-3">Ödəniş</th><th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <Link href={`/admin/sifarisler/${o.id}`} className="code font-semibold hover:text-emerald">{o.reference}</Link>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {new Intl.DateTimeFormat("az-AZ", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }).format(o.createdAt)}
                  </td>
                  <td className="px-4 py-3">{o.customerName}<br /><span className="text-[13px] text-ink-faint">{o.customerPhone}</span></td>
                  <td className="px-4 py-3 tabular-nums">{o.total} ₼</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-[12px] font-semibold ${payTone[o.paymentStatus] ?? "border-line"}`}>
                      {paymentStatusLabels[o.paymentStatus] ?? o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">{orderStatusLabels[o.status] ?? o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
