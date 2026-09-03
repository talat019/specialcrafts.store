export type ProviderKey = "payriff" | "kapital" | "test";

export type CreatePaymentInput = {
  orderId: string;
  reference: string;
  amount: number;          // manatla, məsələn 190.00
  currency: string;        // "AZN"
  description: string;
  customerName: string;
  customerPhone: string;
  approveUrl: string;
  cancelUrl: string;
  declineUrl: string;
  callbackUrl: string;
};

export type CreatePaymentResult = {
  providerOrderId: string;
  providerSessionId?: string;
  paymentUrl: string;
  raw: unknown;
};

export type PaymentStatus = "gozlenilir" | "odenilib" | "ugursuz" | "legv";

export type StatusResult = { status: PaymentStatus; raw: unknown };

export interface PaymentProvider {
  readonly key: ProviderKey;
  readonly label: string;
  /** Konfiqurasiya tamdırsa true — yoxdursa sayt bu üsulu göstərmir. */
  isConfigured(): boolean;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  getStatus(providerOrderId: string, sessionId?: string | null): Promise<StatusResult>;
}
