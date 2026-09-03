/** Məhsulun tipləri və görüntüləmə köməkçiləri — baza importu YOXDUR,
 *  ona görə həm serverdə, həm brauzer komponentlərində işlədilə bilər. */

import { money } from "./money";

export type Stock = "var" | "sifarisle" | "satilib";

export type Product = {
  id: string;
  kod: string;
  ad: string;
  kateqoriya: string;
  qiymet: number | null;
  valyuta: string;
  teksNusxe: boolean;
  stok: Stock;
  stokSayi: number;
  hazirliqGunu: string | null;
  catdirilmaGunu: string | null;
  material: string[];
  olcu: Record<string, number | null>;
  rengSecimleri: string[];
  hekkMumkun: boolean;
  sekiller: string[];
  tesvir: string;
};

export type Category = { acar: string; ad: string; kod: string };

export function priceLabel(p: Pick<Product, "qiymet">): string {
  return p.qiymet == null ? "Qiymət üçün yazın" : money(p.qiymet);
}

/** "5-7" + "working days" → "5–7 working days" */
export function days(n: string, unit: string): string {
  return `${n.replace("-", "–")} ${unit}`;
}

export function leadTimeLabel(
  p: Pick<Product, "stok" | "hazirliqGunu">,
  unit: string,
  stockDays = "1–2",
): string {
  if (p.stok === "var") return days(stockDays, unit);
  return days(p.hazirliqGunu ?? "5-7", unit);
}

/** Səbətə yalnız stokda olan və qiyməti bəlli məhsul atıla bilər. */
export function isBuyable(p: Pick<Product, "stok" | "qiymet" | "stokSayi">): boolean {
  return p.stok === "var" && p.qiymet != null && p.stokSayi > 0;
}

export const statusText: Record<Stock, string> = {
  var: "Stokda var",
  sifarisle: "Sifarişlə",
  satilib: "Satılıb",
};
