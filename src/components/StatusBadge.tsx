import type { Stock } from "@/lib/product-view";
import { site } from "@/lib/site";
import { fill, type Dictionary } from "@/i18n";

const dot: Record<Stock, string> = {
  var: "bg-stock",
  sifarisle: "border-2 border-gold bg-transparent",
  satilib: "bg-sold",
};

const text: Record<Stock, string> = {
  var: "text-stock-dark",
  sifarisle: "text-gold-dark",
  satilib: "text-sold",
};

function labels(t: Dictionary): Record<Stock, string> {
  return { var: t.status.inStock, sifarisle: t.status.made, satilib: t.status.sold };
}

/** Kartların üstündəki kiçik nişan. */
export function StatusBadge({
  stok, t, className = "",
}: { stok: Stock; t: Dictionary; className?: string }) {
  return (
    <span className={`flex items-center gap-1.5 eyebrow text-[10.5px] ${text[stok]} ${className}`}>
      <span className={`block size-[7px] rounded-full ${dot[stok]}`} aria-hidden="true" />
      {labels(t)[stok]}
    </span>
  );
}

const barTint: Record<Stock, string> = {
  var: "border-stock-line bg-stock-tint",
  sifarisle: "border-order-line bg-order-tint",
  satilib: "border-sold-line bg-sold-tint",
};

/** Məhsul səhifəsindəki geniş vəziyyət zolağı. */
export function StatusBar({
  stok, t, lead, stockLabel,
}: { stok: Stock; t: Dictionary; lead: string; stockLabel: string }) {
  const note: Record<Stock, string> = {
    var: fill(t.status.inStockNote, { days: stockLabel }),
    sifarisle: fill(t.status.madeNote, { days: lead }),
    satilib: t.status.soldNote,
  };
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border px-4 py-3.5 ${barTint[stok]}`}>
      <span className={`block size-2.5 shrink-0 rounded-full ${dot[stok]}`} aria-hidden="true" />
      <span className={`font-bold ${text[stok]}`}>
        {stok === "sifarisle" ? t.status.madeLong : labels(t)[stok]}
      </span>
      <span className="text-ink-muted">{note[stok]}</span>
    </p>
  );
}
