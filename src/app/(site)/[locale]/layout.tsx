import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getDictionary, isLocale, locales, type Locale } from "@/i18n";
import "../../globals.css";

// Məzmun bazadan gəlir — səhifələr build zamanı deyil, sorğu anında qurulur
export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const alternates = Object.fromEntries(locales.map((l) => [l, `/${l}`]));

  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${t.meta.tagline}`, template: `%s — ${site.name}` },
    description: t.meta.description,
    alternates: { canonical: `/${locale}`, languages: alternates },
    openGraph: {
      type: "website",
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      siteName: site.name,
      title: `${site.name} — ${t.meta.tagline}`,
      description: t.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = getDictionary(l);

  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: t.meta.description,
    url: site.url,
    telephone: `+${site.whatsapp}`,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "AZ" },
    sameAs: [site.instagram, site.tiktok],
  };

  return (
    <html lang={l} className={`${playfair.variable} ${manrope.variable}`}>
      <body className="min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <CartProvider>
          <SiteHeader locale={l} t={t} />
          <main>{children}</main>
          <SiteFooter locale={l} t={t} />
        </CartProvider>
      </body>
    </html>
  );
}
