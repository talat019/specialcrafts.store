import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartView } from "@/components/CartView";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).cart.title, robots: { index: false } };
}

export default async function SebetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = getDictionary(l);
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12 lg:px-14 lg:py-16">
      <h1 className="text-[34px] lg:text-[44px]">{t.cart.title}</h1>
      <CartView locale={l} t={t} />
    </div>
  );
}
