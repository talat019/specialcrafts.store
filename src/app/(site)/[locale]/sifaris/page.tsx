import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { availableProviders, isTestMode } from "@/lib/payment";
import { deliveryOptions } from "@/lib/order-labels";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).checkout.title, robots: { index: false } };
}

export default async function SifarisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = getDictionary(l);

  const providers = availableProviders().map((p) => ({
    key: p.key,
    label: t.providers[p.key as keyof typeof t.providers] ?? p.label,
  }));

  const delivery = deliveryOptions.map((d) => ({
    key: d.key,
    fee: d.fee,
    label:
      d.key === "baki" ? t.checkout.deliveryBaku
      : d.key === "rayon" ? t.checkout.deliveryRegion
      : t.checkout.deliveryPickup,
    note:
      d.key === "baki" ? t.checkout.deliveryBakuNote
      : d.key === "rayon" ? t.checkout.deliveryRegionNote
      : t.checkout.deliveryPickupNote,
  }));

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12 lg:px-14 lg:py-16">
      <h1 className="text-[34px] lg:text-[44px]">{t.checkout.title}</h1>
      {isTestMode() && (
        <p className="mt-5 rounded-xl border border-order-line bg-order-tint px-4 py-3 text-[14.5px] text-gold-dark">
          {t.checkout.testNotice.replace(/\*\*/g, "")}
        </p>
      )}
      <CheckoutForm providers={providers} delivery={delivery} locale={l} t={t} />
    </div>
  );
}
