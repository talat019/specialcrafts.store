import type { Stock } from "@/lib/products";
import { site } from "@/lib/site";

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

const label: Record<Stock, string> = {
  var: "Stokda var",
  sifarisle: "Sifarişlə",
  satilib: "Satılıb",
};

/** Kartların üstündəki kiçik nişan. */
export function StatusBadge({ stok, className = "" }: { stok: Stock; className?: string }) {
  return (
    <span className={`flex items-center gap-1.5 eyebrow text-[10.5px] ${text[stok]} ${className}`}>
      <span className={`block size-[7px] rounded-full ${dot[stok]}`} aria-hidden="true" />
      {label[stok]}
      {stok === "sifarisle" && <span className="normal-case tracking-normal font-medium"> · 5–7 gün</span>}
    </span>
  );
}

const barTint: Record<Stock, string> = {
  var: "border-stock-line bg-stock-tint",
  sifarisle: "border-order-line bg-order-tint",
  satilib: "border-sold-line bg-sold-tint",
};

const barNote: Record<Stock, string> = {
  var: `— ${site.stockDelivery} ərzində çatdırılır`,
  sifarisle: `— ${site.leadTime}`,
  satilib: "— bu iş tək nüsxə idi",
};

/** Məhsul səhifəsindəki geniş vəziyyət zolağı. */
export function StatusBar({ stok }: { stok: Stock }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border px-4 py-3.5 ${barTint[stok]}`}>
      <span className={`block size-2.5 shrink-0 rounded-full ${dot[stok]}`} aria-hidden="true" />
      <span className={`font-bold ${text[stok]}`}>
        {stok === "sifarisle" ? "Sifarişlə hazırlanır" : label[stok]}
      </span>
      <span className="text-ink-muted">{barNote[stok]}</span>
    </p>
  );
}
