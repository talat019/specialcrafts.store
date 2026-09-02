import catalog from "../../content/products.json";

export type Stock = "var" | "sifarisle" | "satilib";

export type Product = {
  kod: string;
  ad: string;
  kateqoriya: string;
  qiymet: number | null;
  qiymetQeyd: string | null;
  valyuta: string;
  teksNusxe: boolean;
  stok: Stock;
  stokSayi: number;
  hazirliqGunu: string | null;
  catdirilmaGunu: string | null;
  satilibTarixi: string | null;
  material: string[];
  olcu: Record<string, number | null>;
  rengAilesi: string[];
  rengSecimleri: string[];
  hekkMumkun: boolean;
  sekiller: string[];
  tesvir: string;
  aktiv: boolean;
  _qeyd: string | null;
};

export type Category = { acar: string; ad: string; kod: string };

const all = catalog.mehsullar as unknown as Product[];
const cats = catalog.kateqoriyalar as unknown as Category[];

/** Stokda olanlar birinci, sonra sifarişlə, sonra satılıb. */
const rank: Record<Stock, number> = { var: 0, sifarisle: 1, satilib: 2 };

export function sortForCatalog(list: Product[]): Product[] {
  return [...list].sort((a, b) => rank[a.stok] - rank[b.stok] || a.kod.localeCompare(b.kod));
}

export const products = sortForCatalog(all.filter((p) => p.aktiv));

/** Yalnız məhsulu olan kateqoriyalar — boş kateqoriya göstərilmir. */
export const categories: Category[] = cats.filter((c) =>
  products.some((p) => p.kateqoriya === c.acar),
);

export function categoryByKey(key: string): Category | undefined {
  return categories.find((c) => c.acar === key);
}

export function productsIn(key: string): Product[] {
  return products.filter((p) => p.kateqoriya === key);
}

export function productByCode(code: string): Product | undefined {
  return products.find((p) => p.kod.toLowerCase() === code.toLowerCase());
}

export function related(p: Product, count = 4): Product[] {
  const same = products.filter((x) => x.kateqoriya === p.kateqoriya && x.kod !== p.kod);
  if (same.length >= count) return same.slice(0, count);
  const rest = products.filter((x) => x.kateqoriya !== p.kateqoriya && x.kod !== p.kod);
  return [...same, ...rest].slice(0, count);
}

export const inStockCount = products.filter((p) => p.stok === "var").length;
export const madeToOrderCount = products.filter((p) => p.stok === "sifarisle").length;

export function categoryName(key: string): string {
  return cats.find((c) => c.acar === key)?.ad ?? key;
}

/** Qiymət yazısı. Qiymət hələ təyin edilməyibsə uydurmuruq. */
export function priceLabel(p: Product): string {
  if (p.qiymet == null) return "Qiymət üçün yazın";
  return `${p.qiymet} ₼`;
}

export const statusText: Record<Stock, string> = {
  var: "Stokda var",
  sifarisle: "Sifarişlə",
  satilib: "Satılıb",
};

/** Hazırlıq müddətini insani formata salır: "5-7" → "5–7 iş günü". */
export function leadTimeLabel(p: Product): string {
  if (p.stok === "var") return "1–2 iş günü";
  const d = p.hazirliqGunu ?? "5-7";
  return `${d.replace("-", "–")} iş günü`;
}

/**
 * Ana səhifədəki «Stokda hazır» lenti.
 * Kod siyahısı redaktor seçimidir — hər kateqoriyadan ən güclü şəkil.
 * Seçilmiş iş satılıbsa, yeri qalan stok məhsulları ilə doldurulur.
 */
const featuredCodes = ["SHM-001", "SAT-002", "PNO-002", "DMN-001", "ACR-001"];

export function featuredInStock(count = 5): Product[] {
  const picked = featuredCodes
    .map((c) => products.find((p) => p.kod === c && p.stok === "var"))
    .filter((p): p is Product => Boolean(p));
  const rest = products.filter((p) => p.stok === "var" && !picked.includes(p));
  return [...picked, ...rest].slice(0, count);
}

/** Şəkil yolunu basePath ilə uyğunlaşdırır (statik ixracda lazımdır). */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export function imgSrc(path: string): string {
  return `${basePath}${path}`;
}
