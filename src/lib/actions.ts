"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { payments } from "@/db/schema";
import type { CartLine } from "./cart";
import { createOrder, resolveCart, shippingFor, type DeliveryMethod } from "./orders";
import { COUNTRIES } from "./shipping";
import { availableProviders, getProvider, type ProviderKey } from "./payment";
import { site } from "./site";

const lineSchema = z.object({ kod: z.string().min(1).max(32), qty: z.number().int().min(1).max(20) });

export async function resolveCartAction(lines: CartLine[]) {
  const parsed = z.array(lineSchema).max(50).safeParse(lines);
  if (!parsed.success) return { items: [], removed: [], subtotal: 0 };
  return resolveCart(parsed.data);
}

const checkoutSchema = z.object({
  ad: z.string().trim().min(2, "Adınızı yazın").max(80),
  telefon: z
    .string()
    .trim()
    .min(7, "Telefon nömrəsi düzgün deyil")
    .max(24)
    .regex(/^[0-9+()\s-]+$/, "Telefon nömrəsi düzgün deyil"),
  email: z.string().trim().email("E-poçt düzgün deyil").max(120).optional().or(z.literal("")),
  olke: z.string().trim().length(2),
  catdirilma: z.enum(["baki", "rayon", "goturme", "beynelxalq"]),
  seher: z.string().trim().max(120).optional().or(z.literal("")),
  indeks: z.string().trim().max(20).optional().or(z.literal("")),
  unvan: z.string().trim().max(400).optional().or(z.literal("")),
  qeyd: z.string().trim().max(600).optional().or(z.literal("")),
  provayder: z.string().min(1),
});

export type CheckoutResult =
  | { ok: true; paymentUrl: string; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function createOrderAction(
  lines: CartLine[],
  form: Record<string, string>,
): Promise<CheckoutResult> {
  const parsedLines = z.array(lineSchema).min(1, "Səbət boşdur").max(50).safeParse(lines);
  if (!parsedLines.success) return { ok: false, error: "Səbət boşdur" };

  const parsed = checkoutSchema.safeParse(form);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] = i.message;
    return { ok: false, error: "Formada xəta var", fieldErrors };
  }
  const f = parsed.data;

  const country = f.olke.toUpperCase();
  const known = COUNTRIES.some((c) => c.code === country);
  if (!known) {
    return { ok: false, error: "Formada xəta var", fieldErrors: { olke: "Bu ölkəyə göndəriş siyahıda yoxdur" } };
  }
  const domestic = country === "AZ";
  const method = (domestic ? f.catdirilma : "beynelxalq") as DeliveryMethod;

  if (method !== "goturme" && !f.unvan) {
    return { ok: false, error: "Formada xəta var", fieldErrors: { unvan: "Çatdırılma ünvanını yazın" } };
  }
  if (!domestic && !f.seher) {
    return { ok: false, error: "Formada xəta var", fieldErrors: { seher: "Şəhəri yazın" } };
  }

  // qiymətlər yalnız bazadan — brauzerdən gələn rəqəmə etibar edilmir
  const { items, subtotal, removed } = await resolveCart(parsedLines.data);
  if (!items.length) {
    return { ok: false, error: "Səbətdəki məhsullar artıq mövcud deyil. Səbəti yeniləyin." };
  }
  if (removed.length) {
    return {
      ok: false,
      error: `Bu məhsullar artıq stokda yoxdur: ${removed.join(", ")}. Səbəti yeniləyin.`,
    };
  }

  const allowed = availableProviders().map((p) => p.key);
  const providerKey = (allowed.includes(f.provayder as ProviderKey)
    ? f.provayder
    : allowed[0]) as ProviderKey;

  const order = await createOrder({
    customerName: f.ad,
    customerPhone: f.telefon,
    customerEmail: f.email || null,
    country,
    deliveryMethod: method,
    city: f.seher || null,
    postalCode: f.indeks || null,
    address: f.unvan || null,
    note: f.qeyd || null,
    items,
    subtotal,
  });

  const total = subtotal + shippingFor(country, method, items).fee;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
  const provider = getProvider(providerKey);

  const input = {
    orderId: order.id,
    reference: order.reference,
    amount: +total.toFixed(2),
    currency: site.currency,
    description: `${site.name} — sifariş ${order.reference}`,
    customerName: f.ad,
    customerPhone: f.telefon,
    approveUrl: `${base}/odenis/netice/${order.reference}`,
    cancelUrl: `${base}/odenis/netice/${order.reference}?hal=legv`,
    declineUrl: `${base}/odenis/netice/${order.reference}?hal=ugursuz`,
    callbackUrl: `${base}/api/odenis/callback/${providerKey}`,
  };

  try {
    const res = await provider.createPayment(input);
    await db.insert(payments).values({
      orderId: order.id,
      provider: providerKey,
      providerOrderId: res.providerOrderId,
      providerSessionId: res.providerSessionId ?? null,
      amount: String(input.amount),
      currency: input.currency,
      paymentUrl: res.paymentUrl,
      request: input,
      response: res.raw as object,
    });
    await db
      .update(payments)
      .set({ updatedAt: new Date() })
      .where(eq(payments.orderId, order.id));

    return { ok: true, paymentUrl: res.paymentUrl, reference: order.reference };
  } catch (e) {
    await db.insert(payments).values({
      orderId: order.id,
      provider: providerKey,
      amount: String(input.amount),
      currency: input.currency,
      status: "ugursuz",
      request: input,
      response: { error: e instanceof Error ? e.message : String(e) },
    });
    return {
      ok: false,
      error: "Ödəniş sistemi cavab vermədi. Bir az sonra yenidən yoxlayın və ya WhatsApp-da yazın.",
    };
  }
}
