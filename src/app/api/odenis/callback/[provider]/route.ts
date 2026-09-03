import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { getProvider, type ProviderKey } from "@/lib/payment";
import { markOrderPaid, markOrderPaymentFailed } from "@/lib/orders";

export const dynamic = "force-dynamic";

const known: ProviderKey[] = ["payriff", "kapital", "test"];

/**
 * Bankdan gələn bildiriş.
 * Gövdəyə ETİBAR ETMİRİK: yalnız sifariş identifikatorunu götürürük,
 * ödənişin həqiqətən keçdiyini provayderin öz API-si ilə yenidən soruşuruq.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: raw } = await params;
  const key = raw as ProviderKey;
  if (!known.includes(key)) {
    return NextResponse.json({ ok: false, error: "unknown provider" }, { status: 404 });
  }

  let body: Record<string, unknown> = {};
  try {
    const text = await req.text();
    body = text
      ? text.trim().startsWith("{")
        ? (JSON.parse(text) as Record<string, unknown>)
        : Object.fromEntries(new URLSearchParams(text))
      : {};
  } catch {
    body = {};
  }

  const providerOrderId = String(
    body.orderId ?? body.orderID ?? body.order_id ?? body.id ?? "",
  );
  if (!providerOrderId) {
    return NextResponse.json({ ok: false, error: "orderId yoxdur" }, { status: 400 });
  }

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.providerOrderId, providerOrderId));

  if (!payment) {
    return NextResponse.json({ ok: false, error: "ödəniş tapılmadı" }, { status: 404 });
  }

  await db.update(payments).set({ callback: body, updatedAt: new Date() }).where(eq(payments.id, payment.id));

  try {
    const { status, raw: statusRaw } = await getProvider(key).getStatus(
      providerOrderId,
      payment.providerSessionId,
    );
    await db
      .update(payments)
      .set({ status, response: statusRaw as object, updatedAt: new Date() })
      .where(eq(payments.id, payment.id));

    if (status === "odenilib") await markOrderPaid(payment.orderId, key);
    else if (status === "ugursuz" || status === "legv") await markOrderPaymentFailed(payment.orderId, status);

    return NextResponse.json({ ok: true, status });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "status alınmadı" },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, note: "callback endpoint — POST gözlənilir" });
}
