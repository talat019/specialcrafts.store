import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { days } from "@/lib/product-view";
import { getProducts } from "@/lib/products";
import { L, isLocale, type Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.about.eyebrow, description: t.about.title };
}

export default async function HaqqimizdaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const t = getDictionary(l);
  const products = await getProducts(l);

  const link = "font-semibold text-emerald hover:text-emerald-dark";
  const p3 = t.about.p3.split(/\{instagram\}|\{tiktok\}/);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[70ch]">
        <span className="eyebrow text-gold">{t.about.eyebrow}</span>
        <h1 className="mt-4 text-[38px] leading-[1.08] lg:text-[56px]">{t.about.title}</h1>
        <div className="mt-7 flex flex-col gap-5 leading-relaxed text-ink-muted lg:text-[18px]">
          <p>{fill(t.about.p1, { city: site.city })}</p>
          <p>{t.about.p2}</p>
          <p>
            {p3[0]}
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={link}>Instagram</a>
            {p3[1]}
            <a href={site.tiktok} target="_blank" rel="noopener noreferrer" className={link}>TikTok</a>
            {p3[2]}
          </p>
        </div>

        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
          {[
            [site.followers, t.home.statFollowers],
            [String(products.length), t.home.statItems],
            [site.leadDays, t.home.statLead],
          ].map(([v, k]) => (
            <div key={k} className="flex flex-col">
              <dt className="font-display text-[34px]">{v}</dt>
              <dd className="text-[13.5px] text-ink-faint">{k}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={L(l, "/kataloq")} className="rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface transition-colors hover:bg-emerald-dark">
            {t.about.ctaCatalog}
          </Link>
          <Link href={L(l, "/ferdi-sifaris")} className="rounded-full border border-ink px-7 py-3.5 font-semibold transition-colors hover:bg-ink hover:text-surface">
            {t.about.ctaCustom}
          </Link>
        </div>
      </div>
    </div>
  );
}
