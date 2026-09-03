import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { days } from "@/lib/product-view";
import { isLocale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.rules.title, description: t.rules.title };
}

export default async function QaydalarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const v = { days: days(site.stockDays, t.common.workingDays), lead: days(site.leadDays, t.common.workingDays), city: site.city };

  const sections: [string, string[]][] = [
    [t.rules.deliveryTitle, [t.rules.delivery1, t.rules.delivery2, t.rules.delivery3]],
    [t.rules.payTitle, [t.rules.pay1, t.rules.pay2]],
    [t.rules.careTitle, [t.rules.care1, t.rules.care2, t.rules.care3, t.rules.care4]],
    [t.rules.returnTitle, [t.rules.return1, t.rules.return2, t.rules.return3]],
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[70ch]">
        <h1 className="text-[36px] leading-tight lg:text-[48px]">{t.rules.title}</h1>
        <div className="mt-10 flex flex-col gap-10">
          {sections.map(([title, items]) => (
            <section key={title}>
              <h2 className="text-[22px] lg:text-[26px]">{title}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {items.map((i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-ink-muted">
                    <span className="mt-2.5 block size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    {fill(i, v)}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
