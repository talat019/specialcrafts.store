import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";
import { imgSrc } from "@/lib/products";
import { waGeneral } from "@/lib/whatsapp";
import { WhatsAppIcon, MenuIcon } from "./Icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ground/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-3.5 lg:px-14 lg:py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={imgSrc("/assets/logo/special-crafts-logo.jpg")}
            alt=""
            width={46}
            height={46}
            className="size-10 rounded-full object-cover lg:size-[46px]"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[17px] tracking-[0.06em] lg:text-[19px]">
              special crafts
            </span>
            <span className="eyebrow hidden text-[10px] text-ink-faint lg:block">by semedova</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[14.5px] lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-emerald">
              {n.label}
            </Link>
          ))}
        </nav>

        <a
          href={waGeneral()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full border border-emerald px-5 py-2.5 text-sm font-semibold text-emerald transition-colors hover:bg-emerald hover:text-surface lg:inline-flex"
        >
          <WhatsAppIcon className="size-[17px]" />
          WhatsApp
        </a>

        <details className="relative lg:hidden">
          <summary className="flex cursor-pointer list-none items-center" aria-label="Menyu">
            <MenuIcon />
          </summary>
          <div className="absolute right-0 top-full z-50 mt-3 flex w-56 flex-col gap-1 rounded-xl border border-line bg-surface p-2 shadow-lg">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2.5 text-[15px] hover:bg-band">
                {n.label}
              </Link>
            ))}
            <a
              href={waGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-2 rounded-lg bg-emerald px-3 py-2.5 text-[15px] font-semibold text-surface"
            >
              <WhatsAppIcon className="size-[17px]" /> WhatsApp
            </a>
          </div>
        </details>
      </div>
      <span className="sr-only">{site.tagline}</span>
    </header>
  );
}
