import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, getOrderByReference } from "@/lib/orders";
import { site } from "@/lib/site";
import { days } from "@/lib/product-view";
import { money } from "@/lib/money";
import { waGeneral } from "@/lib/whatsapp";
import { L, isLocale, type Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n";

export const metadata = { robots: { index: false } };
export const revalidate = 0;

export default async function NeticePage({
  params, searchParams,
}: {
  params: Promise<{ locale: string; reference: string }>;
  searchParams: Promise<{ hal?: string }>;
}) {
  const { locale, reference } = await params;
  const { hal } = await searchParams;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = getDictionary(l);

  const found = await getOrderByReference(reference);
  if (!found) notFound();
  const data = await getOrder(found.id);
  if (!data) notFound();
  const { order, items } = data;

  const paid = order.paymentStatus === "odenilib";
  const cancelled = hal === "legv" || order.paymentStatus === "legv";
  const statusLabel = t.orderStatus[order.status as keyof typeof t.orderStatus] ?? order.status;

  return (
    <div className="mx-auto max-w-[620px] px-5 py-16 lg:py-24">
      <div className={`rounded-2xl border p-7 ${
        paid ? "border-stock-line bg-stock-tint" : cancelled ? "border-line bg-surface" : "border-order-line bg-order-tint"}`}>
        <h1 className="text-[30px] leading-tight lg:text-[38px]">
          {paid ? t.payment.resultPaid : cancelled ? t.payment.resultCancelled : t.payment.resultPending}
        </h1>
        <p className="mt-3 leading-relaxed text-ink-muted">
          {paid ? fill(t.payment.resultPaidBody, { days: days(site.stockDays, t.common.workingDays) })
            : cancelled ? t.payment.resultCancelledBody
            : t.payment.resultPendingBody}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <span className="text-ink-muted">{t.payment.orderNumber}</span>
          <span className="code text-[15px] font-semibold">{order.reference}</span>
        </div>
        <ul className="flex flex-col gap-2 py-4 text-[14.5px]">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span>{i.name} <span className="text-ink-faint">× {i.qty}</span></span>
              <span className="tabular-nums">{money(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-1.5 border-t border-line pt-3 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-ink-muted">{t.common.delivery}</dt>
            <dd className="tabular-nums">{Number(order.deliveryFee) === 0 ? t.common.free : money(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between font-display text-[22px]">
            <dt>{t.common.total}</dt><dd className="tabular-nums">{money(order.total)}</dd>
          </div>
          <div className="mt-2 flex justify-between text-[14px]">
            <dt className="text-ink-muted">{t.payment.statusLabel}</dt>
            <dd className="font-semibold">{statusLabel}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={waGeneral(`${t.payment.orderNumber}: ${order.reference}`)} target="_blank" rel="noopener noreferrer"
          className="rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface transition-colors hover:bg-emerald-dark">
          {t.common.writeOnWhatsapp}
        </a>
        <Link href={L(l, "/kataloq")} className="rounded-full border border-ink px-7 py-3.5 font-semibold transition-colors hover:bg-ink hover:text-surface">
          {t.payment.backToCatalog}
        </Link>
      </div>
      <p className="mt-6 text-[13.5px] text-ink-faint">{t.payment.keepNumber}</p>
    </div>
  );
}
