import Link from "next/link";
import { adminOrders, adminStats } from "@/lib/admin-actions";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/orders";
import { money } from "@/lib/money";

export default async function AdminHome() {
  const [stats, orders] = await Promise.all([adminStats(), adminOrders()]);
  const recent = orders.slice(0, 8);

  const cards = [
    { label: "Məhsul", value: stats.products.hamisi, note: `${stats.products.stokda} stokda` },
    { label: "Qiyməti olmayan", value: stats.products.qiymetsiz, note: "səbətə atıla bilmir", warn: stats.products.qiymetsiz > 0 },
    { label: "Sifariş", value: stats.orders.hamisi, note: `${stats.orders.yeni} yeni` },
    { label: "Ödənilmiş", value: money(Math.round(stats.orders.mebleg)), note: `${stats.orders.odenilib} sifariş` },
  ];

  return (
    <>
      <h1 className="font-display text-[30px]">İcmal</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl border bg-surface p-5 ${c.warn ? "border-order-line" : "border-line"}`}>
            <span className="text-[12px] uppercase tracking-[0.16em] text-ink-faint">{c.label}</span>
            <p className="mt-2 font-display text-[32px] leading-none">{c.value}</p>
            <p className={`mt-2 text-[13px] ${c.warn ? "text-gold-dark" : "text-ink-muted"}`}>{c.note}</p>
          </div>
        ))}
      </div>

      {stats.products.qiymetsiz > 0 && (
        <p className="mt-6 rounded-xl border border-order-line bg-order-tint px-4 py-3 text-[14.5px] text-gold-dark">
          <b>{stats.products.qiymetsiz} məhsulun qiyməti yoxdur.</b> Qiyməti olmayan məhsul səbətə
          atıla bilmir — müştəri yalnız WhatsApp-dan yaza bilər.{" "}
          <Link href="/admin/mehsullar" className="underline">Qiymətləri əlavə edin →</Link>
        </p>
      )}

      <h2 className="mt-10 font-display text-[22px]">Son sifarişlər</h2>
      {recent.length === 0 ? (
        <p className="mt-3 text-ink-muted">Hələ sifariş yoxdur.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[640px] text-[14.5px]">
            <thead className="bg-band text-left text-[12px] uppercase tracking-[0.12em] text-ink-faint">
              <tr><th className="px-4 py-3">Nömrə</th><th className="px-4 py-3">Müştəri</th><th className="px-4 py-3">Məbləğ</th><th className="px-4 py-3">Ödəniş</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="px-4 py-3"><Link href={`/admin/sifarisler/${o.id}`} className="code font-semibold hover:text-emerald">{o.reference}</Link></td>
                  <td className="px-4 py-3">{o.customerName}<br /><span className="text-[13px] text-ink-faint">{o.customerPhone}</span></td>
                  <td className="px-4 py-3 tabular-nums">{money(o.total)}</td>
                  <td className="px-4 py-3">{paymentStatusLabels[o.paymentStatus] ?? o.paymentStatus}</td>
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
