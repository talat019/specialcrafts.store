/**
 * content/products.json faylını verilənlər bazasına köçürür.
 * Təkrar işlədilə bilər — kod üzrə upsert edir, mövcud sifarişlərə toxunmur.
 */
import { readFileSync } from "node:fs";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { categories, products, productImages } from "./schema";
import { TIER_BY_CATEGORY } from "../lib/shipping";

type Raw = {
  kod: string; ad: string; kateqoriya: string;
  qiymet: number | null; valyuta: string; teksNusxe: boolean;
  stok: string; stokSayi: number;
  hazirliqGunu: string | null; catdirilmaGunu: string | null;
  material: string[]; olcu: Record<string, number | null>;
  rengAilesi: string[]; rengSecimleri: string[]; hekkMumkun: boolean;
  sekiller: string[]; tesvir: string; aktiv: boolean; _qeyd: string | null;
};

const raw = JSON.parse(readFileSync("content/products.json", "utf-8")) as {
  kateqoriyalar: { acar: string; ad: string; kod: string }[];
  mehsullar: Raw[];
};

type Tr = Record<string, { en: { ad: string; tesvir: string }; ru: { ad: string; tesvir: string } }>;
const tr = JSON.parse(readFileSync("content/translations.json", "utf-8")) as Tr;

/** Kateqoriya adlarının tərcüməsi. */
const catNames: Record<string, { en: string; ru: string }> = {
  saat: { en: "Wall clocks", ru: "Настенные часы" },
  sahmat: { en: "Chess sets", ru: "Шахматы" },
  domino: { en: "Domino sets", ru: "Домино" },
  panno: { en: "Wall panels", ru: "Настенные панно" },
  "acar-asilqani": { en: "Key holders", ru: "Держатели для ключей" },
  rehil: { en: "Quran stands", ru: "Пюпитры для Корана" },
  "guzgu-daraq": { en: "Mirror & comb", ru: "Зеркало и гребень" },
  aksesuar: { en: "Jewellery", ru: "Украшения" },
  suvenir: { en: "Gifts & decor", ru: "Сувениры и декор" },
  tesbeh: { en: "Prayer beads", ru: "Тасбих" },
  kulqabi: { en: "Ashtrays", ru: "Пепельницы" },
  "sep-xonca": { en: "Trousseau trays", ru: "Подносы для приданого" },
  diger: { en: "Other work", ru: "Прочие работы" },
};

async function main() {
  // yalnız məhsulu olan kateqoriyalar
  const used = new Set(raw.mehsullar.map((m) => m.kateqoriya));

  for (const [i, c] of raw.kateqoriyalar.filter((c) => used.has(c.acar)).entries()) {
    await db
      .insert(categories)
      .values({
        key: c.acar, name: c.ad, code: c.kod, sortOrder: i,
        nameEn: catNames[c.acar]?.en ?? c.ad,
        nameRu: catNames[c.acar]?.ru ?? c.ad,
      })
      .onConflictDoUpdate({
        target: categories.key,
        set: {
          name: c.ad, code: c.kod, sortOrder: i,
          nameEn: catNames[c.acar]?.en ?? c.ad,
          nameRu: catNames[c.acar]?.ru ?? c.ad,
        },
      });
  }

  let created = 0;
  let updated = 0;

  for (const m of raw.mehsullar) {
    const values = {
      code: m.kod,
      name: m.ad,
      nameEn: tr[m.kod]?.en.ad ?? null,
      nameRu: tr[m.kod]?.ru.ad ?? null,
      categoryKey: m.kateqoriya,
      price: m.qiymet == null ? null : String(m.qiymet),
      currency: m.valyuta,
      stock: m.stok,
      stockQty: m.stokSayi,
      leadDays: m.hazirliqGunu,
      deliveryDays: m.catdirilmaGunu,
      isUnique: m.teksNusxe,
      material: m.material,
      dimensions: m.olcu,
      colorFamily: m.rengAilesi,
      colorOptions: m.rengSecimleri,
      engraving: m.hekkMumkun,
      shipTier: TIER_BY_CATEGORY[m.kateqoriya] ?? "medium",
      description: m.tesvir,
      descriptionEn: tr[m.kod]?.en.tesvir ?? null,
      descriptionRu: tr[m.kod]?.ru.tesvir ?? null,
      active: m.aktiv,
      note: m._qeyd,
      updatedAt: new Date(),
    };

    const [row] = await db
      .insert(products)
      .values(values)
      .onConflictDoUpdate({ target: products.code, set: values })
      .returning({ id: products.id, createdAt: products.createdAt, updatedAt: products.updatedAt });

    row.createdAt.getTime() === row.updatedAt.getTime() ? created++ : updated++;

    await db.delete(productImages).where(eq(productImages.productId, row.id));
    if (m.sekiller.length) {
      await db.insert(productImages).values(
        m.sekiller.map((url, i) => ({ productId: row.id, url, sortOrder: i })),
      );
    }
  }

  console.log(`✓ ${raw.mehsullar.length} məhsul (${created} yeni, ${updated} yeniləndi), ${used.size} kateqoriya`);
  process.exit(0);
}

main();
