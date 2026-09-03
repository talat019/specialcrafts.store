"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { categories, orderItems, orders, productImages, products } from "@/db/schema";
import { getAdmin, signIn, signOut } from "./session";

async function guard() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/giris");
  return admin;
}

// ---------------- giriş ----------------
export async function loginAction(_prev: unknown, fd: FormData) {
  const email = String(fd.get("email") ?? "");
  const password = String(fd.get("sifre") ?? "");
  if (!email || !password) return { error: "E-poçt və şifrəni yazın" };
  if (!(await signIn(email, password))) return { error: "E-poçt və ya şifrə yanlışdır" };
  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/admin/giris");
}

// ---------------- məhsul ----------------
const productSchema = z.object({
  kod: z.string().trim().regex(/^[A-Z]{3}-\d{3}$/, "Kod formatı: ABC-001"),
  ad: z.string().trim().min(2).max(140),
  kateqoriya: z.string().trim().min(1),
  qiymet: z.string().trim(),
  stok: z.enum(["var", "sifarisle", "satilib"]),
  stokSayi: z.string().trim(),
  tesvir: z.string().trim().max(2000),
  material: z.string().trim().max(300),
  rengSecimleri: z.string().trim().max(300),
  hekk: z.string().optional(),
  teksNusxe: z.string().optional(),
  aktiv: z.string().optional(),
});

function parseList(v: string): string[] {
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

export async function saveProductAction(id: string | null, _prev: unknown, fd: FormData) {
  await guard();
  const parsed = productSchema.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formada xəta var" };
  }
  const f = parsed.data;
  const priceNum = f.qiymet === "" ? null : Number(f.qiymet.replace(",", "."));
  if (priceNum !== null && (!Number.isFinite(priceNum) || priceNum < 0)) {
    return { error: "Qiymət düzgün deyil" };
  }
  const qty = Number(f.stokSayi || "0");

  const values = {
    code: f.kod.toUpperCase(),
    name: f.ad,
    categoryKey: f.kateqoriya,
    price: priceNum === null ? null : String(priceNum),
    stock: f.stok,
    stockQty: Number.isFinite(qty) ? Math.max(0, Math.trunc(qty)) : 0,
    isUnique: f.teksNusxe === "on",
    engraving: f.hekk === "on",
    active: f.aktiv === "on",
    material: parseList(f.material),
    colorOptions: parseList(f.rengSecimleri),
    description: f.tesvir,
    leadDays: f.stok === "var" ? null : "5-7",
    deliveryDays: f.stok === "var" ? "1-2" : null,
    updatedAt: new Date(),
  };

  let productId = id;
  try {
    if (id) {
      await db.update(products).set(values).where(eq(products.id, id));
    } else {
      const [row] = await db.insert(products).values(values).returning({ id: products.id });
      productId = row.id;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg.includes("unique") ? "Bu kod artıq mövcuddur" : "Yadda saxlanmadı" };
  }

  // şəkil yükləmə
  const files = fd.getAll("sekiller").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length && productId) {
    // yüklənən şəkillər ayrıca qovluqda — Docker-də bu qovluq volume kimi bağlanır,
    // repodan gələn assets/products isə image-in içində qalır
    const dir = path.join(process.cwd(), "public", "uploads", values.categoryKey);
    await mkdir(dir, { recursive: true });
    const existing = await db.select().from(productImages).where(eq(productImages.productId, productId));
    let n = existing.length;
    for (const file of files) {
      if (file.size > 6_000_000) continue;
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!["jpg", "jpeg", "png", "webp", "avif"].includes(ext)) continue;
      n += 1;
      const name = `${values.code}-${n}.${ext}`;
      await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
      await db.insert(productImages).values({
        productId,
        url: `/uploads/${values.categoryKey}/${name}`,
        sortOrder: n,
      });
    }
  }

  revalidatePath("/admin/mehsullar");
  revalidatePath("/kataloq");
  revalidatePath("/");
  redirect("/admin/mehsullar");
}

export async function deleteImageAction(imageId: string, productId: string) {
  await guard();
  await db.delete(productImages).where(eq(productImages.id, imageId));
  revalidatePath(`/admin/mehsullar/${productId}`);
}

export async function toggleActiveAction(id: string, active: boolean) {
  await guard();
  await db.update(products).set({ active, updatedAt: new Date() }).where(eq(products.id, id));
  revalidatePath("/admin/mehsullar");
  revalidatePath("/kataloq");
}

export async function setStockAction(id: string, stock: string, qty: number) {
  await guard();
  await db
    .update(products)
    .set({
      stock,
      stockQty: Math.max(0, qty),
      soldAt: stock === "satilib" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));
  revalidatePath("/admin/mehsullar");
  revalidatePath("/kataloq");
  revalidatePath("/");
}

// ---------------- sifariş ----------------
export async function setOrderStatusAction(id: string, status: string) {
  await guard();
  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
  revalidatePath("/admin/sifarisler");
  revalidatePath(`/admin/sifarisler/${id}`);
}

export async function setPaymentStatusAction(id: string, paymentStatus: string) {
  await guard();
  await db.update(orders).set({ paymentStatus, updatedAt: new Date() }).where(eq(orders.id, id));
  revalidatePath(`/admin/sifarisler/${id}`);
}

// ---------------- oxuma ----------------
export async function adminStats() {
  await guard();
  const [p] = await db
    .select({
      hamisi: sql<number>`count(*)::int`,
      stokda: sql<number>`count(*) filter (where ${products.stock} = 'var')::int`,
      qiymetsiz: sql<number>`count(*) filter (where ${products.price} is null)::int`,
    })
    .from(products);
  const [o] = await db
    .select({
      hamisi: sql<number>`count(*)::int`,
      yeni: sql<number>`count(*) filter (where ${orders.status} = 'yeni')::int`,
      odenilib: sql<number>`count(*) filter (where ${orders.paymentStatus} = 'odenilib')::int`,
      mebleg: sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.paymentStatus} = 'odenilib'), 0)::float`,
    })
    .from(orders);
  return { products: p, orders: o };
}

export async function adminProducts() {
  await guard();
  const rows = await db
    .select({
      id: products.id, code: products.code, name: products.name,
      categoryKey: products.categoryKey, price: products.price,
      stock: products.stock, stockQty: products.stockQty, active: products.active,
    })
    .from(products)
    .orderBy(asc(products.code));

  const imgs = await db
    .select({ productId: productImages.productId, url: productImages.url })
    .from(productImages)
    .orderBy(asc(productImages.sortOrder));
  const firstImage = new Map<string, string>();
  for (const i of imgs) if (!firstImage.has(i.productId)) firstImage.set(i.productId, i.url);

  return rows.map((r) => ({ ...r, image: firstImage.get(r.id) ?? null }));
}

export async function adminCategories() {
  await guard();
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function adminProduct(id: string) {
  await guard();
  const [row] = await db.select().from(products).where(eq(products.id, id));
  if (!row) return null;
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.sortOrder));
  return { product: row, images };
}

export async function adminOrders() {
  await guard();
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
}

export async function adminOrder(id: string) {
  await guard();
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { order, items };
}
