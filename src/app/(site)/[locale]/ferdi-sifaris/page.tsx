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
  return { title: t.custom.eyebrow, description: t.custom.lede };
}

export default async function FerdiSifarisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const steps = [
    [t.custom.step1, t.custom.step1Body],
    [t.custom.step2, t.custom.step2Body],
    [t.custom.step3, t.custom.step3Body],
    [fill(t.custom.step4, { lead: days(site.leadDays, t.common.workingDays) }), t.custom.step4Body],
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[64ch]">
        <span className="eyebrow text-gold">{t.custom.eyebrow}</span>
        <h1 className="mt-4 text-[38px] leading-tight lg:text-[54px]">{t.custom.title}</h1>
        <p className="mt-5 leading-relaxed text-ink-muted lg:text-[18px]">{t.custom.lede}</p>
      </div>

      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([title, body], i) => (
          <li key={title} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-6 lg:p-7">
            <span className="font-display text-[30px] leading-none text-gold">{i + 1}</span>
            <span className="text-[16.5px] font-semibold">{title}</span>
            <span className="text-[14.5px] leading-relaxed text-ink-muted">{body}</span>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col gap-6 rounded-3xl border border-line bg-band p-7 lg:flex-row lg:items-center lg:justify-between lg:p-11">
        <div className="max-w-[54ch]">
          <h2 className="text-[26px] lg:text-[32px]">{t.custom.helpTitle}</h2>
          <p className="mt-3 leading-relaxed text-ink-muted">{t.custom.helpBody}</p>
        </div>
        <WhatsAppLink href={waGeneral(t.custom.template)} className="shrink-0 rounded-full">
          {t.custom.helpCta}
        </WhatsAppLink>
      </div>

      <p className="mt-8 text-[14px] text-ink-faint">{fill(t.custom.footNote, { lead: days(site.leadDays, t.common.workingDays) })}</p>
    </div>
  );
}
