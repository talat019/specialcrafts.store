import Link from "next/link";
import { site } from "@/lib/site";
import { categories } from "@/lib/products";
import { waGeneral } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

export function SiteFooter() {
  return (
    <footer className="bg-dark text-dark-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-8 border-b border-dark-line pb-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-[30px] leading-tight lg:text-[38px]">Bir işi bəyəndiniz?</h2>
            <p className="max-w-[46ch] text-dark-muted lg:text-[17px]">
              Yazın — stokda varsa dərhal göndəririk, yoxdursa sizin üçün hazırlayırıq.
            </p>
          </div>
          <a
            href={waGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-emerald px-8 py-4 font-bold text-surface transition-colors hover:bg-emerald-dark"
          >
            <WhatsAppIcon className="size-[19px]" />
            WhatsApp-da yazın
          </a>
        </div>

        <div className="grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-[10.5px] text-gold-bright">Kateqoriyalar</span>
            <ul className="flex flex-col gap-1.5 text-[14.5px] text-dark-muted">
              {categories.map((c) => (
                <li key={c.acar}>
                  <Link href={`/kataloq/${c.acar}`} className="transition-colors hover:text-dark-ink">
                    {c.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-[10.5px] text-gold-bright">Səhifələr</span>
            <ul className="flex flex-col gap-1.5 text-[14.5px] text-dark-muted">
              <li><Link href="/kataloq" className="hover:text-dark-ink">Kataloq</Link></li>
              <li><Link href="/ferdi-sifaris" className="hover:text-dark-ink">Fərdi sifariş</Link></li>
              <li><Link href="/korporativ" className="hover:text-dark-ink">Korporativ</Link></li>
              <li><Link href="/haqqimizda" className="hover:text-dark-ink">Haqqımızda</Link></li>
              <li><Link href="/qaydalar" className="hover:text-dark-ink">Çatdırılma və qaydalar</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-[10.5px] text-gold-bright">Əlaqə</span>
            <ul className="flex flex-col gap-1.5 text-[14.5px] text-dark-muted">
              <li><a href={waGeneral()} target="_blank" rel="noopener noreferrer" className="hover:text-dark-ink">WhatsApp — {site.phoneDisplay}</a></li>
              <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-dark-ink">Instagram</a></li>
              <li><a href={site.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-dark-ink">TikTok</a></li>
              <li><Link href="/elaqe" className="hover:text-dark-ink">Bütün əlaqə</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-display text-[22px]">special crafts</span>
            <p className="text-[14.5px] leading-relaxed text-dark-muted">
              Epoksid qatranla işləyən kiçik atelye. {site.city}.
            </p>
          </div>
        </div>

        <p className="mt-12 border-t border-dark-line pt-7 text-[13.5px] text-ink-faint">
          © {new Date().getFullYear()} {site.name} · {site.owner}
        </p>
      </div>
    </footer>
  );
}
