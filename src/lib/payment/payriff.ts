import type {
  CreatePaymentInput, CreatePaymentResult, PaymentProvider, StatusResult, PaymentStatus,
} from "./types";

/**
 * Payriff v2 — https://docs.payriff.com
 * Sadə REST: Authorization başlığında gizli açar, merchant identifikatoru gövdədə.
 */
export class PayriffProvider implements PaymentProvider {
  readonly key = "payriff" as const;
  readonly label = "Kart ilə ödəniş (Payriff)";

  private base = process.env.PAYRIFF_BASE_URL ?? "https://api.payriff.com/api/v2";
  private merchant = process.env.PAYRIFF_MERCHANT ?? "";
  private secret = process.env.PAYRIFF_SECRET ?? "";

  isConfigured() {
    return Boolean(this.merchant && this.secret);
  }

  private async call(path: string, body: unknown) {
    const res = await fetch(`${this.base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: this.secret },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = (await res.json()) as Record<string, unknown>;
    if (!res.ok) throw new Error(`Payriff ${path}: HTTP ${res.status} — ${JSON.stringify(json)}`);
    return json;
  }

  async createPayment(i: CreatePaymentInput): Promise<CreatePaymentResult> {
    const body = {
      merchant: this.merchant,
      amount: i.amount,
      currencyType: i.currency,
      language: "AZ",
      description: i.description,
      cardStorage: false,
      approveURL: i.approveUrl,
      cancelURL: i.cancelUrl,
      declineURL: i.declineUrl,
      callbackURL: i.callbackUrl,
    };
    const json = await this.call("/orders", body);
    const payload = (json.payload ?? json) as Record<string, unknown>;
    const orderId = String(payload.orderId ?? payload.orderID ?? "");
    const url = String(payload.paymentUrl ?? payload.paymentURL ?? "");
    if (!orderId || !url) throw new Error(`Payriff cavabı gözlənilməz: ${JSON.stringify(json)}`);
    return { providerOrderId: orderId, paymentUrl: url, raw: json };
  }

  async getStatus(providerOrderId: string): Promise<StatusResult> {
    const json = await this.call(`/get-status`, {
      merchant: this.merchant,
      orderId: providerOrderId,
    });
    const payload = (json.payload ?? json) as Record<string, unknown>;
    const raw = String(payload.orderStatus ?? payload.status ?? "").toUpperCase();
    const map: Record<string, PaymentStatus> = {
      APPROVED: "odenilib",
      FULLY_PAID: "odenilib",
      PAID: "odenilib",
      DECLINED: "ugursuz",
      DECLINE: "ugursuz",
      CANCELED: "legv",
      CANCELLED: "legv",
      EXPIRED: "legv",
    };
    return { status: map[raw] ?? "gozlenilir", raw: json };
  }
}
