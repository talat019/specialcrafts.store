import type {
  CreatePaymentInput, CreatePaymentResult, PaymentProvider, StatusResult,
} from "./types";

/**
 * Test provayderi — heç bir banka çıxmır.
 * Bank açarları gələnə qədər bütün sifariş axını bununla yoxlanılır:
 * müştəri saxta ödəniş səhifəsinə düşür və «ödə» / «imtina» seçir.
 */
export class TestProvider implements PaymentProvider {
  readonly key = "test" as const;
  readonly label = "Test ödənişi (bank qoşulmayıb)";

  isConfigured() {
    return true;
  }

  async createPayment(i: CreatePaymentInput): Promise<CreatePaymentResult> {
    const id = `TEST-${i.reference}`;
    const url = `/odenis/test/${i.orderId}`;
    return { providerOrderId: id, paymentUrl: url, raw: { simulated: true, input: i } };
  }

  async getStatus(): Promise<StatusResult> {
    return { status: "gozlenilir", raw: { simulated: true } };
  }
}
