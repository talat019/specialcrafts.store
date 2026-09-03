"use client";

import { useTransition } from "react";
import { setOrderStatusAction, setPaymentStatusAction } from "@/lib/admin-actions";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/order-labels";

export function OrderControls({
  id, status, paymentStatus,
}: { id: string; status: string; paymentStatus: string }) {
  const [pending, start] = useTransition();
  const label = "mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-ink-faint font-bold";
  const field = "w-full rounded-xl border border-line-strong bg-ground px-4 py-3 text-[15px] outline-none focus:border-emerald disabled:opacity-60";

  return (
    <aside className="flex h-fit flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
      <div>
        <label className={label} htmlFor="status">Sifariş statusu</label>
        <select
          id="status" className={field} defaultValue={status} disabled={pending}
          onChange={(e) => start(() => { void setOrderStatusAction(id, e.target.value); })}
        >
          {Object.entries(orderStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="pay">Ödəniş statusu</label>
        <select
          id="pay" className={field} defaultValue={paymentStatus} disabled={pending}
          onChange={(e) => start(() => { void setPaymentStatusAction(id, e.target.value); })}
        >
          {Object.entries(paymentStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <p className="mt-2 text-[13px] text-ink-faint">
          Ödəniş statusunu əl ilə dəyişmək stoku azaltmır — yalnız qeydi düzəldir.
        </p>
      </div>
    </aside>
  );
}
