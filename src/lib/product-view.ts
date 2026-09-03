/** Məhsulun tipləri və görüntüləmə köməkçiləri — baza importu YOXDUR,
 *  ona görə həm serverdə, həm brauzer komponentlərində işlədilə bilər. */

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
  return p.qiymet == null ? "Qiymət üçün yazın" : `${p.qiymet} ₼`;
}

export function leadTimeLabel(p: Pick<Product, "stok" | "hazirliqGunu">): string {
  if (p.stok === "var") return "1–2 iş günü";
  return `${(p.hazirliqGunu ?? "5-7").replace("-", "–")} iş günü`;
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
