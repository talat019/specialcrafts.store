import { notFound, redirect } from "next/navigation";
import { getOrder, markOrderPaid, markOrderPaymentFailed } from "@/lib/orders";
import { isTestMode } from "@/lib/payment";
import { money } from "@/lib/money";

export const metadata = { title: "Test ödənişi", robots: { index: false } };

/**
 * Bank açarları gələnə qədər ödəniş axınını yoxlamaq üçün saxta ödəniş səhifəsi.
 * PAYMENT_MODE=canli olduqda bu səhifə bağlanır.
 */
export default async function TestOdenisPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isTestMode()) notFound();
  const { id } = await params;
  const data = await getOrder(id);
  if (!data) notFound();
  const { order, items } = data;

  async function pay() {
    "use server";
    await markOrderPaid(id, "test");
    redirect(`/odenis/netice/${order.reference}`);
  }

  async function fail() {
    "use server";
    await markOrderPaymentFailed(id, "legv");
    redirect(`/odenis/netice/${order.reference}?hal=legv`);
  }

  return (
    <div className="mx-auto max-w-[560px] px-5 py-16 lg:py-24">
      <div className="rounded-2xl border-2 border-dashed border-gold bg-order-tint p-7">
        <p className="eyebrow text-gold-dark">Test ödəniş səhifəsi</p>
        <h1 className="mt-3 text-[28px] leading-tight">Bank qoşulmayıb</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
          Bu səhifə real bank səhifəsini əvəz edir. Kartdan pul çıxmır — Payriff və ya Kapital Bank
          açarları əlavə olunanda müştəri buranın yerinə bankın öz səhifəsinə düşəcək.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
        <div className="flex justify-between border-b border-line pb-3">
          <span className="text-ink-muted">Sifariş</span>
          <span className="code font-semibold">{order.reference}</span>
        </div>
        <ul className="flex flex-col gap-2 py-4 text-[14.5px]">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span>{i.name} <span className="text-ink-faint">× {i.qty}</span></span>
              <span className="tabular-nums">{money(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line pt-3 font-display text-[24px]">
          <span>Ödəniləcək</span>
          <span className="tabular-nums">{money(order.total)}</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <form action={pay}>
            <button type="submit" className="w-full rounded-xl bg-emerald px-6 py-4 font-bold text-surface transition-colors hover:bg-emerald-dark">
              Ödənişi uğurlu simulyasiya et
            </button>
          </form>
          <form action={fail}>
            <button type="submit" className="w-full rounded-xl border border-line-strong px-6 py-3.5 font-semibold text-ink-muted transition-colors hover:border-ink hover:text-ink">
              İmtina et
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
