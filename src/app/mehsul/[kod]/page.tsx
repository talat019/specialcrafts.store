import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import {
  getCategory,
  getProductByCode,
  getRelated,
  priceLabel,
  leadTimeLabel,
  isBuyable,
  type Product,
} from "@/lib/products";
import { waProduct, waButtonLabel } from "@/lib/whatsapp";
import { StatusBar } from "@/components/StatusBadge";
import { ProductCard } from "@/components/ProductCard";
import { AddToCart } from "@/components/AddToCart";
import { WhatsAppIcon } from "@/components/Icons";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kod: string }>;
}): Promise<Metadata> {
  const { kod } = await params;
  const p = await getProductByCode(kod);
  if (!p) return {};
  return {
    title: p.ad,
    description: p.tesvir,
    openGraph: { title: p.ad, description: p.tesvir, images: [p.sekiller[0]] },
  };
}

const olcuLabels: Record<string, string> = {
  dene: "Dənə sayı",
  boncukMm: "Muncuq (mm)",
  uzunlukMm: "Uzunluq (mm)",
  diametrSm: "Diametr (sm)",
  lovheSm: "Lövhə (sm)",
  dasSayi: "Daş sayı",
  enSm: "En (sm)",
  hundurlukSm: "Hündürlük (sm)",
  qarmaqSayi: "Qarmaq sayı",
};

function specs(p: Product) {
  const rows: [string, string][] = [["Material", p.material.join(", ")]];
  for (const [k, v] of Object.entries(p.olcu)) {
    if (v != null && olcuLabels[k]) rows.push([olcuLabels[k], String(v)]);
  }
  if (p.teksNusxe) rows.push(["Nüsxə", "Tək nüsxə"]);
  rows.push([p.stok === "var" ? "Çatdırılma" : "Hazırlıq müddəti", leadTimeLabel(p)]);
  return rows;
}

export default async function MehsulPage({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const p = await getProductByCode(kod);
  if (!p) notFound();

  const [cat, relatedItems] = await Promise.all([getCategory(p.kateqoriya), getRelated(p)]);
  const buyable = isBuyable(p);

  const sold = p.stok === "satilib";
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.ad,
    sku: p.kod,
    description: p.tesvir,
    image: p.sekiller.map((s) => `${site.url}${s}`),
    material: p.material.join(", "),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: p.valyuta,
      ...(p.qiymet != null ? { price: p.qiymet } : {}),
      availability:
        p.stok === "var"
          ? "https://schema.org/InStock"
          : p.stok === "satilib"
            ? "https://schema.org/SoldOut"
            : "https://schema.org/PreOrder",
      url: `${site.url}/mehsul/${p.kod.toLowerCase()}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <nav className="mx-auto max-w-[1440px] px-5 pt-6 text-[13.5px] text-ink-faint lg:px-14">
        <Link href="/kataloq" className="hover:text-ink">Kataloq</Link>
        {" · "}
        <Link href={`/kataloq/${p.kateqoriya}`} className="hover:text-ink">
          {cat?.ad ?? p.kateqoriya}
        </Link>
        {" · "}
        <span className="text-ink">{p.ad}</span>
      </nav>

      <div className="mx-auto grid max-w-[1440px] items-start gap-8 px-5 pt-6 lg:grid-cols-2 lg:gap-14 lg:px-14">
        {/* --------- QALEREYA --------- */}
        <div className="flex flex-col gap-3.5">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-band lg:aspect-[4/5]">
            <Image
              src={p.sekiller[0]}
              alt={p.ad}
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              priority
              className={`object-cover ${sold ? "grayscale-[0.35] opacity-80" : ""}`}
            />
          </div>
          {p.sekiller.length > 1 && (
            <div className="grid grid-cols-4 gap-3.5">
              {p.sekiller.slice(1).map((s) => (
                <div key={s} className="relative aspect-square overflow-hidden rounded-xl bg-band">
                  <Image src={s} alt={p.ad} fill sizes="160px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --------- PANEL --------- */}
        <div className="flex flex-col">
          <h1 className="text-[32px] leading-tight lg:text-[44px]">{p.ad}</h1>
          <span className="code mt-2.5 text-[12.5px] text-ink-faint">{p.kod}</span>

          {p.qiymet == null ? (
            <p className="mt-5 text-[17px] font-semibold text-ink-muted">
              Qiymət ölçü və rəngə görə dəyişir —{" "}
              <span className="text-emerald">yazın, dəqiq deyək.</span>
            </p>
          ) : (
            <p className={`mt-5 font-display text-[32px] lg:text-[38px] ${sold ? "text-ink-faint line-through" : ""}`}>
              {priceLabel(p)}
            </p>
          )}

          <div className="mt-5">
            <StatusBar stok={p.stok} />
          </div>

          <p className="mt-6 leading-relaxed text-ink-muted lg:text-[16.5px]">{p.tesvir}</p>

          {/* fərdiləşdirmə — yalnız sifarişlə hazırlananlarda */}
          {p.stok === "sifarisle" && (p.rengSecimleri.length > 0 || p.hekkMumkun) && (
            <div className="mt-8 flex flex-col gap-6">
              {p.rengSecimleri.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="eyebrow text-[11px] text-ink-faint">Rəng seçimləri</span>
                  <div className="flex flex-wrap gap-2.5">
                    {p.rengSecimleri.map((r, i) => (
                      <span
                        key={r}
                        className={`rounded-xl border px-4 py-2.5 text-[14.5px] ${
                          i === 0
                            ? "border-emerald bg-stock-tint font-semibold text-emerald"
                            : "border-line-strong bg-surface"
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {p.hekkMumkun && (
                <p className="text-[15px] text-ink-muted">
                  Bu iş üzərinə <b className="font-semibold text-ink">həkk</b> etmək mümkündür — ad,
                  tarix və ya loqo. Mətni WhatsApp-da yazın.
                </p>
              )}
            </div>
          )}

          {/* stokda olanda seçim yoxdur */}
          {p.stok === "var" && (
            <div className="mt-7 rounded-xl border border-dashed border-line-strong bg-surface px-5 py-4">
              <p className="text-[14.5px] leading-relaxed text-ink-muted">
                Bu iş artıq hazırdır — rəng və ölçü seçimi yoxdur.
              </p>
              <Link
                href="/ferdi-sifaris"
                className="mt-2 inline-block text-[14.5px] font-semibold text-emerald hover:text-emerald-dark"
              >
                Bu rəngdə fərdi hazırlanmasını istəyirsiniz? →
              </Link>
            </div>
          )}

          {/* --------- SİFARİŞ --------- */}
          <div className="mt-8 flex flex-col gap-3">
            {buyable ? (
              <>
                <AddToCart kod={p.kod} max={p.stokSayi} />
                <a
                  href={waProduct(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl border border-line-strong px-7 py-4 text-[15px] font-semibold transition-colors hover:border-ink"
                >
                  <WhatsAppIcon className="size-[18px]" />
                  Yaxud WhatsApp-da yazın
                </a>
              </>
            ) : (
              <>
                <a
                  href={waProduct(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2.5 rounded-2xl px-7 py-5 text-[17px] font-bold transition-colors ${
                    sold
                      ? "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-surface"
                      : "bg-emerald text-surface hover:bg-emerald-dark"
                  }`}
                >
                  {!sold && <WhatsAppIcon className="size-5" />}
                  {waButtonLabel(p)}
                </a>
                <p className="text-center text-[13.5px] text-ink-faint">
                  {sold
                    ? `Oxşarını ${site.leadTime} ərzində hazırlaya bilərik`
                    : p.qiymet == null
                      ? "Qiymət razılaşdırıldıqdan sonra sifarişi təsdiqləyirik"
                      : "WhatsApp açılır — məhsul kodu və seçimlər mesaja avtomatik yazılır"}
                </p>
              </>
            )}
            {buyable && p.stokSayi <= 1 && (
              <p className="text-center text-[13.5px] font-semibold text-stock-dark">Son 1 ədəd</p>
            )}
          </div>

          {/* --------- ETİBAR --------- */}
          <ul className="mt-7 flex flex-wrap gap-2">
            {["Əl işi", p.teksNusxe ? "Tək nüsxə" : "Dəst", "Hədiyyə qutusu daxildir", `${site.city}daxili çatdırılma`].map(
              (t) => (
                <li key={t} className="rounded-full border border-line bg-surface px-4 py-1.5 text-[13px]">
                  {t}
                </li>
              ),
            )}
          </ul>

          {/* --------- XÜSUSİYYƏTLƏR --------- */}
          <div className="mt-9">
            <span className="eyebrow text-[11px] text-ink-faint">Xüsusiyyətlər</span>
            <dl className="mt-3">
              {specs(p).map(([k, v], i, arr) => (
                <div
                  key={k}
                  className={`flex justify-between gap-6 py-3.5 text-[15px] ${i < arr.length - 1 ? "border-b border-line" : ""}`}
                >
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* --------- BƏNZƏR --------- */}
      <section className="mx-auto max-w-[1440px] px-5 pb-28 pt-16 lg:px-14 lg:pb-24 lg:pt-24">
        <h2 className="mb-6 text-[26px] lg:text-[32px]">Bənzər işlər</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {relatedItems.map((r) => (
            <ProductCard key={r.kod} p={r} />
          ))}
        </div>
      </section>

      {/* --------- MOBİL YAPIŞQAN ZOLAQ --------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3.5 border-t border-line bg-ground/97 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex shrink-0 flex-col">
          {p.qiymet != null && (
            <span className={`font-display text-[22px] leading-none ${sold ? "text-ink-faint line-through" : ""}`}>
              {priceLabel(p)}
            </span>
          )}
          <span
            className={`flex items-center gap-1.5 eyebrow text-[10px] ${
              p.stok === "var" ? "text-stock-dark" : p.stok === "satilib" ? "text-sold" : "text-gold-dark"
            }`}
          >
            <span
              className={`block size-1.5 rounded-full ${
                p.stok === "var" ? "bg-stock" : p.stok === "satilib" ? "bg-sold" : "border-2 border-gold"
              }`}
              aria-hidden="true"
            />
            {p.stok === "var" ? "Stokda var" : p.stok === "satilib" ? "Satılıb" : "Sifarişlə"}
          </span>
        </div>
        {buyable ? (
          <div className="flex-1">
            <AddToCart kod={p.kod} max={p.stokSayi} />
          </div>
        ) : (
          <a
            href={waProduct(p)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-4 font-bold ${
              sold ? "border-[1.5px] border-ink text-ink" : "bg-emerald text-surface"
            }`}
          >
            {!sold && <WhatsAppIcon className="size-[19px]" />}
            {sold ? "Bənzərini sifariş et" : "Sifariş et"}
          </a>
        )}
      </div>
    </>
  );
}
