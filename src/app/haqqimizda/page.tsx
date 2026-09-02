import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Haqqımızda",
  description:
    "special crafts — Bakıda epoksid qatranla işləyən kiçik atelye. Hər iş əl ilə tökülür və tək nüsxədir.",
};

export default function HaqqimizdaPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-20">
      <div className="max-w-[68ch]">
        <span className="eyebrow text-gold">Haqqımızda</span>
        <h1 className="mt-4 text-[38px] leading-[1.08] lg:text-[56px]">
          Qatran öz axışını özü seçir
        </h1>
        <div className="mt-7 flex flex-col gap-5 leading-relaxed text-ink-muted lg:text-[18px]">
          <p>
            special crafts — {site.city}da epoksid qatranla işləyən kiçik bir atelyedir. Hər saat,
            hər şahmat lövhəsi və hər panno əl ilə tökülür, cilalanır və barmaqla yoxlanılır.
          </p>
          <p>
            Eyni rəngdən iki dəfə töksək də iki fərqli iş çıxır — damarlar heç vaxt eyni yerə
            düşmür. Ona görə kataloqdakı hər əşya tək nüsxədir: satıldıqdan sonra onun eynisi bir
            daha olmayacaq.
          </p>
          <p>
            İşlərimizi gündəlik olaraq{" "}
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald hover:text-emerald-dark">
              Instagram
            </a>{" "}
            və{" "}
            <a href={site.tiktok} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald hover:text-emerald-dark">
              TikTok
            </a>{" "}
            hesablarımızda paylaşırıq.
          </p>
        </div>

        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
          {[
            [site.followers, "Instagram izləyicisi"],
            [String(products.length), "kataloqdakı iş"],
            [site.leadTime.replace(" iş günü", ""), "gün hazırlıq"],
          ].map(([v, k]) => (
            <div key={k} className="flex flex-col">
              <dt className="font-display text-[34px]">{v}</dt>
              <dd className="text-[13.5px] text-ink-faint">{k}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/kataloq" className="rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface transition-colors hover:bg-emerald-dark">
            Kataloqa bax
          </Link>
          <Link href="/ferdi-sifaris" className="rounded-full border border-ink px-7 py-3.5 font-semibold transition-colors hover:bg-ink hover:text-surface">
            Fərdi sifariş
          </Link>
        </div>
      </div>
    </div>
  );
}
