import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { availableProviders, isTestMode } from "@/lib/payment";
import { RATES, TRANSIT_DAYS, countryOptions } from "@/lib/shipping";
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

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12 lg:px-14 lg:py-16">
      <h1 className="text-[34px] lg:text-[44px]">{t.checkout.title}</h1>
      <p className="mt-2 flex items-center gap-2 text-[15px] text-ink-muted">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" aria-hidden="true">
          <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
        </svg>
        {t.checkout.worldwide}
      </p>
      {isTestMode() && (
        <p className="mt-5 rounded-xl border border-order-line bg-order-tint px-4 py-3 text-[14.5px] text-gold-dark">
          {t.checkout.testNotice.replace(/\*\*/g, "")}
        </p>
      )}
      <CheckoutForm
        providers={providers}
        countries={countryOptions(l)}
        rates={RATES}
        transit={TRANSIT_DAYS}
        locale={l}
        t={t}
      />
    </div>
  );
}
