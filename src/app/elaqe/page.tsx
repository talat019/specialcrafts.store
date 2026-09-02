import type { Metadata } from "next";
import { site } from "@/lib/site";
import { waGeneral } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export const metadata: Metadata = {
  title: "Əlaqə",
  description: `WhatsApp, Instagram və TikTok üzərindən əlaqə. ${site.city}.`,
};

export default function ElaqePage() {
  const links = [
    ["WhatsApp", site.phoneDisplay, waGeneral()],
    ["Instagram", "@special__crafts", site.instagram],
    ["TikTok", "@special__crafts", site.tiktok],
  ];
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[62ch]">
        <h1 className="text-[36px] leading-tight lg:text-[48px]">Əlaqə</h1>
        <p className="mt-5 leading-relaxed text-ink-muted lg:text-[18px]">
          Ən sürətli yol WhatsApp-dır — sual, qiymət və ya fərdi sifariş üçün yazın. Adətən bir
          neçə saat ərzində cavab veririk.
        </p>

        <ul className="mt-9 flex flex-col gap-3">
          {links.map(([t, v, href]) => (
            <li key={t}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-colors hover:border-line-strong"
              >
                <span className="font-semibold">{t}</span>
                <span className="text-ink-muted">{v}</span>
              </a>
            </li>
          ))}
        </ul>

        <WhatsAppLink href={waGeneral()} className="mt-8 rounded-full">
          WhatsApp-da yazın
        </WhatsAppLink>

        <p className="mt-8 text-[14px] text-ink-faint">
          {site.city} · sifarişlər {site.leadTime} öncədən qəbul edilir.
        </p>
      </div>
    </div>
  );
}
