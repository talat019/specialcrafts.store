import Link from "next/link";
import { notFound } from "next/navigation";
import { adminOrder } from "@/lib/admin-actions";
import { deliveryOptions, orderStatusLabels, paymentStatusLabels } from "@/lib/orders";
import { OrderControls } from "@/components/admin/OrderControls";
import { money } from "@/lib/money";

export default async function SifarisDetal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await adminOrder(id);
  if (!data) notFound();
  const { order, items } = data;
  const delivery = deliveryOptions.find((d) => d.key === order.deliveryMethod);

  const rows: [string, string][] = [
    ["Müştəri", order.customerName],
    ["Telefon", order.customerPhone],
    ["E-poçt", order.customerEmail ?? "—"],
    ["Çatdırılma", delivery?.label ?? order.deliveryMethod],
    ["Ünvan", order.address ?? "—"],
    ["Qeyd", order.note ?? "—"],
    ["Ödəniş üsulu", order.paymentProvider ?? "—"],
    ["Ödəniş statusu", paymentStatusLabels[order.paymentStatus] ?? order.paymentStatus],
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[30px]">Sifariş <span className="code text-[22px]">{order.reference}</span></h1>
        <Link href="/admin/sifarisler" className="text-[14px] text-ink-muted hover:text-ink">← Bütün sifarişlər</Link>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-[20px]">Məhsullar</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4 border-b border-line pb-3 last:border-0">
                <span>
                  <Link href={`/mehsul/${i.code.toLowerCase()}`} target="_blank" className="font-semibold hover:text-emerald">{i.name}</Link>
                  <span className="code ml-2 text-[12px] text-ink-faint">{i.code}</span>
                  <span className="block text-[13.5px] text-ink-muted">{money(i.unitPrice)} × {i.qty}</span>
                </span>
                <span className="tabular-nums font-semibold">{money(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 flex flex-col gap-1.5 border-t border-line pt-4 text-[15px]">
            <div className="flex justify-between"><dt className="text-ink-muted">Məhsullar</dt><dd className="tabular-nums">{money(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Çatdırılma</dt><dd className="tabular-nums">{money(order.deliveryFee)}</dd></div>
            <div className="mt-1 flex justify-between font-display text-[24px]"><dt>Cəmi</dt><dd className="tabular-nums">{money(order.total)}</dd></div>
          </dl>

          <h2 className="mt-8 font-display text-[20px]">Müştəri</h2>
          <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">{k}</dt>
                <dd className="text-[15px]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <OrderControls id={order.id} status={order.status} paymentStatus={order.paymentStatus} />
      </div>
    </>
  );
}
