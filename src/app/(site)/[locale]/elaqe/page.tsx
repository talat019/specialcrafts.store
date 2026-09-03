import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { days } from "@/lib/product-view";
import { waGeneral } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { isLocale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.contact.title, description: t.contact.lede };
}

export default async function ElaqePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const links: [string, string, string][] = [
    ["WhatsApp", site.phoneDisplay, waGeneral()],
    ["Instagram", "@special__crafts", site.instagram],
    ["TikTok", "@special__crafts", site.tiktok],
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[64ch]">
        <h1 className="text-[36px] leading-tight lg:text-[48px]">{t.contact.title}</h1>
        <p className="mt-5 leading-relaxed text-ink-muted lg:text-[18px]">{t.contact.lede}</p>

        <ul className="mt-9 flex flex-col gap-3">
          {links.map(([title, value, href]) => (
            <li key={title}>
              <a href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-line-strong">
                <span className="font-semibold">{title}</span>
                <span className="text-ink-muted">{value}</span>
              </a>
            </li>
          ))}
        </ul>

        <WhatsAppLink href={waGeneral()} className="mt-8 rounded-full">
          {t.common.writeOnWhatsapp}
        </WhatsAppLink>

        <p className="mt-8 text-[14px] text-ink-faint">
          {fill(t.contact.footNote, { city: site.city, lead: days(site.leadDays, t.common.workingDays) })}
        </p>
      </div>
    </div>
  );
}
