import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { availableProviders, isTestMode } from "@/lib/payment";
import { deliveryOptions } from "@/lib/orders";

export const metadata: Metadata = { title: "Sifariş", robots: { index: false } };

export default function SifarisPage() {
  const providers = availableProviders().map((p) => ({ key: p.key, label: p.label }));
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12 lg:px-14 lg:py-16">
      <h1 className="text-[34px] lg:text-[44px]">Sifarişi rəsmiləşdir</h1>
      {isTestMode() && (
        <p className="mt-5 rounded-xl border border-order-line bg-order-tint px-4 py-3 text-[14.5px] text-gold-dark">
          <b>Test rejimi.</b> Bank hesabı hələ qoşulmayıb — ödəniş simulyasiya olunur, kartdan pul
          çıxmır. Real ödənişlər Payriff və Kapital Bank açarları əlavə olunandan sonra işləyəcək.
        </p>
      )}
      <CheckoutForm providers={providers} delivery={deliveryOptions} />
    </div>
  );
}
