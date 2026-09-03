import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/product-view";
import { priceLabel } from "@/lib/product-view";
import { L, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { StatusBadge } from "./StatusBadge";

export function ProductCard({
  p, locale, t, priority = false,
}: { p: Product; locale: Locale; t: Dictionary; priority?: boolean }) {
  const sold = p.stok === "satilib";
  return (
    <Link
      href={L(locale, `/mehsul/${p.kod.toLowerCase()}`)}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong ${sold ? "opacity-60" : ""}`}
    >
      <div className="relative aspect-square overflow-hidden bg-band">
        <Image
          src={p.sekiller[0] ?? "/assets/logo/special-crafts-logo.jpg"}
          alt={p.ad}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          priority={priority}
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${sold ? "grayscale-[0.35]" : ""}`}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4 pb-5">
        <StatusBadge stok={p.stok} t={t} />
        <span className="text-[15px] font-semibold leading-snug">{p.ad}</span>
        <span className="code text-[11px] text-ink-faint">
          {p.kod}
          {p.teksNusxe && ` · ${t.catalog.oneOfAKind}`}
        </span>
        <span
          className={`mt-auto pt-1.5 font-bold text-ink-muted ${p.qiymet == null ? "text-[13px]" : "text-base"} ${sold ? "line-through" : ""}`}
        >
          {p.qiymet == null ? t.common.priceOnRequest : priceLabel(p)}
        </span>
      </div>
    </Link>
  );
}
