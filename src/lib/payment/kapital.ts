import { Agent } from "undici";
import type {
  CreatePaymentInput, CreatePaymentResult, PaymentProvider, StatusResult, PaymentStatus,
} from "./types";

/**
 * Kapital Bank e-commerce.
 * Bank mTLS istifadə edir: sorğular müştəri sertifikatı ilə imzalanır.
 * Sertifikat və açar PEM formatında env dəyişənlərində saxlanılır.
 */
export class KapitalProvider implements PaymentProvider {
  readonly key = "kapital" as const;
  readonly label = "Kart ilə ödəniş (Kapital Bank)";

  private base = process.env.KAPITAL_BASE_URL ?? "https://tstpg.kapitalbank.az";
  private merchant = process.env.KAPITAL_MERCHANT ?? "";
  private cert = (process.env.KAPITAL_CERT ?? "").replace(/\\n/g, "\n");
  private key_ = (process.env.KAPITAL_KEY ?? "").replace(/\\n/g, "\n");

  isConfigured() {
    return Boolean(this.merchant && this.cert && this.key_);
  }

  /** mTLS üçün ayrıca dispatcher — qlobal fetch-ə toxunmur. */
  private agent() {
    return new Agent({ connect: { cert: this.cert, key: this.key_ } });
  }

  private async call(path: string, body: unknown) {
    const res = await fetch(`${this.base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      // @ts-expect-error undici dispatcher Node fetch-də dəstəklənir
      dispatcher: this.agent(),
    });
    const text = await res.text();
    let json: Record<string, unknown>;
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      throw new Error(`Kapital ${path}: JSON deyil — ${text.slice(0, 200)}`);
    }
    if (!res.ok) throw new Error(`Kapital ${path}: HTTP ${res.status} — ${text.slice(0, 200)}`);
    return json;
  }

  async createPayment(i: CreatePaymentInput): Promise<CreatePaymentResult> {
    const json = await this.call("/api/order", {
      order: {
        typeRid: "Order_SMS",
        amount: i.amount.toFixed(2),
        currency: i.currency,
        language: "az",
        description: i.description,
        hppRedirectUrl: i.approveUrl,
        hppCofCapturePurposes: [],
      },
      merchant: this.merchant,
    });
    const order = (json.order ?? json) as Record<string, unknown>;
    const id = String(order.id ?? "");
    const password = String(order.password ?? order.secret ?? "");
    const url = String(order.hppUrl ?? order.paymentUrl ?? "");
    if (!id || !url) throw new Error(`Kapital cavabı gözlənilməz: ${JSON.stringify(json)}`);
    return {
      providerOrderId: id,
      providerSessionId: password || undefined,
      paymentUrl: password ? `${url}?id=${id}&password=${password}` : url,
      raw: json,
    };
  }

  async getStatus(providerOrderId: string): Promise<StatusResult> {
    const json = await this.call(`/api/order/${providerOrderId}`, {});
    const order = (json.order ?? json) as Record<string, unknown>;
    const raw = String(order.status ?? "").toUpperCase();
    const map: Record<string, PaymentStatus> = {
      FULLYPAID: "odenilib",
      PAID: "odenilib",
      APPROVED: "odenilib",
      DECLINED: "ugursuz",
      REJECTED: "ugursuz",
      CANCELLED: "legv",
      EXPIRED: "legv",
    };
    return { status: map[raw] ?? "gozlenilir", raw: json };
  }
}
