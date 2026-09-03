import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { waGeneral } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.corporate.title, description: t.corporate.lede };
}

export default async function KorporativPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const points = [
    [t.corporate.p1, t.corporate.p1Body],
    [t.corporate.p2, t.corporate.p2Body],
    [t.corporate.p3, t.corporate.p3Body],
    [t.corporate.p4, t.corporate.p4Body],
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[64ch]">
        <span className="eyebrow text-gold">{t.corporate.eyebrow}</span>
        <h1 className="mt-4 text-[38px] leading-tight lg:text-[54px]">{t.corporate.title}</h1>
        <p className="mt-5 leading-relaxed text-ink-muted lg:text-[18px]">{t.corporate.lede}</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {points.map(([title, body]) => (
          <div key={title} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-6 lg:p-7">
            <span className="text-[16.5px] font-semibold">{title}</span>
            <span className="text-[14.5px] leading-relaxed text-ink-muted">{body}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-line bg-band p-7 lg:p-11">
        <h2 className="text-[26px] lg:text-[32px]">{t.corporate.quoteTitle}</h2>
        <p className="mt-3 max-w-[58ch] leading-relaxed text-ink-muted">{t.corporate.quoteBody}</p>
        <WhatsAppLink href={waGeneral(t.corporate.template)} className="mt-6 rounded-full">
          {t.corporate.quoteCta}
        </WhatsAppLink>
      </div>
    </div>
  );
}
