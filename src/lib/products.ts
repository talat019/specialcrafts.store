import { and, asc, eq, inArray, ne, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { categories, productImages, products as productsTable } from "@/db/schema";

export * from "./product-view";
import type { Category, Product, Stock } from "./product-view";

/** Stokda olanlar birinci, sonra sifarişlə, sonra satılıb. */
const stockRank = sql`case ${productsTable.stock}
  when 'var' then 0 when 'sifarisle' then 1 else 2 end`;

function toProduct(r: Row, images: string[]): Product {
  return {
    id: r.id,
    kod: r.code,
    ad: r.name,
    kateqoriya: r.categoryKey,
    qiymet: r.price == null ? null : Number(r.price),
    valyuta: r.currency,
    teksNusxe: r.isUnique,
    stok: r.stock as Stock,
    stokSayi: r.stockQty,
    hazirliqGunu: r.leadDays,
    catdirilmaGunu: r.deliveryDays,
    material: r.material ?? [],
    olcu: r.dimensions ?? {},
    rengSecimleri: r.colorOptions ?? [],
    hekkMumkun: r.engraving,
    sekiller: images,
    tesvir: r.description,
  };
}

type Row = typeof productsTable.$inferSelect;

/**
 * Məhsullar + şəkilləri.
 * Şəkillər ayrıca sorğu ilə gətirilir — korrelyasiyalı alt-sorğu
 * drizzle-in cədvəl adlandırması ilə etibarlı işləmir.
 */
async function query(where?: SQL | undefined) {
  const rows = (await db
    .select()
    .from(productsTable)
    .where(where ? and(eq(productsTable.active, true), where) : eq(productsTable.active, true))
    .orderBy(stockRank, asc(productsTable.code))) as Row[];

  if (!rows.length) return [];

  const imgs = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
      sortOrder: productImages.sortOrder,
    })
    .from(productImages)
    .where(inArray(productImages.productId, rows.map((r) => r.id)))
    .orderBy(asc(productImages.sortOrder));

  const byProduct = new Map<string, string[]>();
  for (const i of imgs) {
    const list = byProduct.get(i.productId) ?? [];
    list.push(i.url);
    byProduct.set(i.productId, list);
  }

  return rows.map((r) => toProduct(r, byProduct.get(r.id) ?? []));
}

export async function getProducts(): Promise<Product[]> {
  return query();
}

export async function getProductsIn(categoryKey: string): Promise<Product[]> {
  return query(eq(productsTable.categoryKey, categoryKey));
}

export async function getProductByCode(code: string): Promise<Product | null> {
  const rows = await query(eq(productsTable.code, code.toUpperCase()));
  return rows[0] ?? null;
}

/** Yalnız məhsulu olan kateqoriyalar — boş kateqoriya göstərilmir. */
export async function getCategories(): Promise<Category[]> {
  const rows = await db
    .select({ acar: categories.key, ad: categories.name, kod: categories.code })
    .from(categories)
    .orderBy(asc(categories.sortOrder));
  const counts = await getCategoryCounts();
  return rows.filter((c) => (counts[c.acar] ?? 0) > 0);
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ key: productsTable.categoryKey, n: sql<number>`count(*)::int` })
    .from(productsTable)
    .where(eq(productsTable.active, true))
    .groupBy(productsTable.categoryKey);
  return Object.fromEntries(rows.map((r) => [r.key, r.n]));
}

export async function getStockCounts(): Promise<Record<Stock, number> & { hamisi: number }> {
  const rows = await db
    .select({ stock: productsTable.stock, n: sql<number>`count(*)::int` })
    .from(productsTable)
    .where(eq(productsTable.active, true))
    .groupBy(productsTable.stock);
  const m = Object.fromEntries(rows.map((r) => [r.stock, r.n])) as Record<string, number>;
  return {
    var: m.var ?? 0,
    sifarisle: m.sifarisle ?? 0,
    satilib: m.satilib ?? 0,
    hamisi: rows.reduce((s, r) => s + r.n, 0),
  };
}

export async function getRelated(p: Product, count = 4): Promise<Product[]> {
  const same = await query(
    and(eq(productsTable.categoryKey, p.kateqoriya), ne(productsTable.code, p.kod)),
  );
  if (same.length >= count) return same.slice(0, count);
  const rest = (await query(ne(productsTable.categoryKey, p.kateqoriya))).filter(
    (x) => x.kod !== p.kod,
  );
  return [...same, ...rest].slice(0, count);
}

/**
 * Ana səhifədəki «Stokda hazır» lenti.
 * Kod siyahısı redaktor seçimidir — hər kateqoriyadan ən güclü şəkil.
 * Seçilmiş iş satılıbsa, yeri qalan stok məhsulları ilə doldurulur.
 */
const featuredCodes = ["SHM-005", "AKS-001", "SAT-002", "GZD-001", "PNO-002", "DMN-001"];

export async function getFeaturedInStock(count = 5): Promise<Product[]> {
  const inStock = await query(eq(productsTable.stock, "var"));
  const picked = featuredCodes
    .map((c) => inStock.find((p) => p.kod === c))
    .filter((p): p is Product => Boolean(p));
  const rest = inStock.filter((p) => !picked.includes(p));
  return [...picked, ...rest].slice(0, count);
}

export async function getCategory(key: string): Promise<Category | null> {
  const [row] = await db
    .select({ acar: categories.key, ad: categories.name, kod: categories.code })
    .from(categories)
    .where(eq(categories.key, key));
  return row ?? null;
}
