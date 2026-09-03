import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, payments, productImages, products } from "@/db/schema";
import type { CartLine } from "./cart";

export * from "./order-labels";
import { deliveryFee, type DeliveryMethod, type ResolvedLine } from "./order-labels";
export type { DeliveryMethod, ResolvedLine };

/** SC-260903-4821 formatında istinad nömrəsi. */
function makeReference(): string {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = String(Math.floor(1000 + Math.random() * 9000));
  return `SC-${ymd}-${rnd}`;
}

/**
 * Səbətdəki kodları bazadan yoxlayır.
 * Qiymət və mövcudluq YALNIZ bazadan götürülür — brauzerdən gələn rəqəmə etibar edilmir.
 */
export async function resolveCart(lines: CartLine[]): Promise<{
  items: ResolvedLine[];
  removed: string[];
  subtotal: number;
}> {
  const codes = [...new Set(lines.map((l) => l.kod.toUpperCase()))];
  if (!codes.length) return { items: [], removed: [], subtotal: 0 };

  const rows = await db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      price: products.price,
      stock: products.stock,
      stockQty: products.stockQty,
      active: products.active,
    })
    .from(products)
    .where(inArray(products.code, codes));

  const imgs = rows.length
    ? await db
        .select({ productId: productImages.productId, url: productImages.url })
        .from(productImages)
        .where(inArray(productImages.productId, rows.map((r) => r.id)))
        .orderBy(asc(productImages.sortOrder))
    : [];
  const firstImage = new Map<string, string>();
  for (const i of imgs) if (!firstImage.has(i.productId)) firstImage.set(i.productId, i.url);

  const items: ResolvedLine[] = [];
  const removed: string[] = [];

  for (const l of lines) {
    const r = rows.find((x) => x.code === l.kod.toUpperCase());
    // səbətə yalnız stokda olan və qiyməti bəlli məhsul girə bilər
    if (!r || !r.active || r.stock !== "var" || r.price == null || r.stockQty < 1) {
      removed.push(l.kod);
      continue;
    }
    const qty = Math.max(1, Math.min(r.stockQty, l.qty));
    const qiymet = Number(r.price);
    items.push({
      productId: r.id,
      kod: r.code,
      ad: r.name,
      qiymet,
      qty,
      cem: +(qiymet * qty).toFixed(2),
      sekil: firstImage.get(r.id) ?? null,
    });
  }

  const subtotal = +items.reduce((s, i) => s + i.cem, 0).toFixed(2);
  return { items, removed, subtotal };
}

export type NewOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryMethod: DeliveryMethod;
  address?: string | null;
  note?: string | null;
  items: ResolvedLine[];
  subtotal: number;
};

export async function createOrder(input: NewOrderInput) {
  const fee = deliveryFee(input.deliveryMethod);
  const total = +(input.subtotal + fee).toFixed(2);

  const [order] = await db
    .insert(orders)
    .values({
      reference: makeReference(),
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail ?? null,
      deliveryMethod: input.deliveryMethod,
      address: input.address ?? null,
      note: input.note ?? null,
      subtotal: String(input.subtotal),
      deliveryFee: String(fee),
      total: String(total),
    })
    .returning();

  await db.insert(orderItems).values(
    input.items.map((i) => ({
      orderId: order.id,
      productId: i.productId,
      code: i.kod,
      name: i.ad,
      unitPrice: String(i.qiymet),
      qty: i.qty,
      lineTotal: String(i.cem),
    })),
  );

  return order;
}

export async function getOrder(id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  const pays = await db.select().from(payments).where(eq(payments.orderId, id)).orderBy(desc(payments.createdAt));
  return { order, items, payments: pays };
}

export async function getOrderByReference(reference: string) {
  const [order] = await db.select().from(orders).where(eq(orders.reference, reference));
  return order ?? null;
}

/**
 * Ödəniş təsdiqlənəndə: sifarişi ödənilmiş işarələ və stoku azalt.
 * Təkrar çağırışlara qarşı qorunub — artıq ödənilibsə heç nə etmir.
 */
export async function markOrderPaid(orderId: string, provider: string) {
  const [current] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!current || current.paymentStatus === "odenilib") return current ?? null;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

  for (const it of items) {
    if (!it.productId) continue;
    await db
      .update(products)
      .set({
        stockQty: sql`greatest(0, ${products.stockQty} - ${it.qty})`,
        updatedAt: new Date(),
      })
      .where(eq(products.id, it.productId));

    // stok bitdisə məhsul «satılıb» halına keçir, səhifəsi silinmir
    await db
      .update(products)
      .set({ stock: "satilib", soldAt: new Date(), updatedAt: new Date() })
      .where(and(eq(products.id, it.productId), eq(products.stockQty, 0)));
  }

  const [updated] = await db
    .update(orders)
    .set({
      paymentStatus: "odenilib",
      paymentProvider: provider,
      status: "hazirlanir",
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  return updated;
}

export async function markOrderPaymentFailed(orderId: string, status: "ugursuz" | "legv") {
  await db
    .update(orders)
    .set({ paymentStatus: status, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}
