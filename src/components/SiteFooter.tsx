import Link from "next/link";
import { site } from "@/lib/site";
import { getCategories } from "@/lib/products";
import { waGeneral } from "@/lib/whatsapp";
import { L, type Locale } from "@/i18n/config";
import { fill, type Dictionary } from "@/i18n";
import { WhatsAppIcon } from "./Icons";

export async function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  // baza müvəqqəti əlçatmazdırsa footer kateqoriyasız göstərilir, səhifə çökmür
  const categories = await getCategories(locale).catch(() => []);

  const pages = [
    { href: L(locale, "/kataloq"), label: t.nav.catalog },
    { href: L(locale, "/ferdi-sifaris"), label: t.nav.custom },
    { href: L(locale, "/korporativ"), label: t.nav.corporate },
    { href: L(locale, "/haqqimizda"), label: t.nav.about },
    { href: L(locale, "/qaydalar"), label: t.nav.rules },
  ];

  return (
    <footer className="bg-dark text-dark-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-14 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-8 border-b border-dark-line pb-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-[30px] leading-tight lg:text-[38px]">{t.footer.ctaTitle}</h2>
            <p className="max-w-[46ch] text-dark-muted lg:text-[17px]">{t.footer.ctaBody}</p>
          </div>
          <a
            href={waGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-emerald px-8 py-4 font-bold text-surface transition-colors hover:bg-emerald-dark"
          >
            <WhatsAppIcon className="size-[19px]" />
            {t.common.writeOnWhatsapp}
          </a>
        </div>

        <div className="grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-[10.5px] text-gold-bright">{t.footer.categories}</span>
            <ul className="flex flex-col gap-1.5 text-[14.5px] text-dark-muted">
              {categories.map((c) => (
                <li key={c.acar}>
                  <Link href={L(locale, `/kataloq/${c.acar}`)} className="transition-colors hover:text-dark-ink">
                    {c.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-[10.5px] text-gold-bright">{t.footer.pages}</span>
            <ul className="flex flex-col gap-1.5 text-[14.5px] text-dark-muted">
              {pages.map((p) => (
                <li key={p.href}><Link href={p.href} className="hover:text-dark-ink">{p.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-[10.5px] text-gold-bright">{t.footer.contact}</span>
            <ul className="flex flex-col gap-1.5 text-[14.5px] text-dark-muted">
              <li><a href={waGeneral()} target="_blank" rel="noopener noreferrer" className="hover:text-dark-ink">WhatsApp — {site.phoneDisplay}</a></li>
              <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-dark-ink">Instagram</a></li>
              <li><a href={site.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-dark-ink">TikTok</a></li>
              <li><Link href={L(locale, "/elaqe")} className="hover:text-dark-ink">{t.contact.allContacts}</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-display text-[22px]">special crafts</span>
            <p className="text-[14.5px] leading-relaxed text-dark-muted">
              {fill(t.footer.blurb, { city: site.city })}
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
