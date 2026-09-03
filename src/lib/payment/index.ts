import { PayriffProvider } from "./payriff";
import { KapitalProvider } from "./kapital";
import { TestProvider } from "./test-provider";
import type { PaymentProvider, ProviderKey } from "./types";

export * from "./types";

const registry: Record<ProviderKey, PaymentProvider> = {
  payriff: new PayriffProvider(),
  kapital: new KapitalProvider(),
  test: new TestProvider(),
};

/** PAYMENT_MODE=test olduqda yalnız simulyator işləyir. */
export function isTestMode(): boolean {
  return (process.env.PAYMENT_MODE ?? "test") !== "canli";
}

export function getProvider(key: ProviderKey): PaymentProvider {
  return registry[key];
}

/** Ödəniş səhifəsində göstəriləcək üsullar. */
export function availableProviders(): PaymentProvider[] {
  if (isTestMode()) return [registry.test];
  const live = [registry.payriff, registry.kapital].filter((p) => p.isConfigured());
  return live.length ? live : [registry.test];
}
