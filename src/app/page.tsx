import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import {
  getCategories, getCategoryCounts, getFeaturedInStock, getProducts, getProductsIn, getStockCounts,
} from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "@/components/Icons";

export const revalidate = 0;

export default async function Home() {
  const [products, categories, counts, inStock, panels, stock] = await Promise.all([
    getProducts(),
    getCategories(),
    getCategoryCounts(),
    getFeaturedInStock(5),
    getProductsIn("panno"),
    getStockCounts(),
  ]);
  const hero = products.find((p) => p.kod === "SHM-005") ?? products[0];
  const inStockCount = stock.var;
  const panelPair = panels.slice(0, 2);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="grid items-center lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6 px-5 py-14 lg:px-14 lg:py-24">
          <span className="eyebrow text-gold">Epoksid əl işləri · {site.city}</span>
          <h1 className="text-[46px] leading-[1.04] tracking-tight lg:text-[76px]">
            Unikal
            <br />
            əl işləri
          </h1>
          <p className="max-w-[34ch] text-[17px] leading-relaxed text-ink-muted lg:text-[18.5px]">
            Hər biri əllə tökülür, təkrarlanmır. Bir hissəsi hazır rəfdədir, qalanı{" "}
            {site.leadTime} ərzində sizin üçün hazırlanır.
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/kataloq"
              className="rounded-full bg-emerald px-8 py-4 text-center font-semibold text-surface transition-colors hover:bg-emerald-dark"
            >
              Kataloqa bax
            </Link>
            <Link
              href="/kataloq?stok=var"
              className="flex items-center justify-center gap-2.5 rounded-full border border-ink px-8 py-4 font-semibold transition-colors hover:bg-ink hover:text-surface"
            >
              <span className="block size-2 rounded-full bg-stock" aria-hidden="true" />
              Stokda olanlar
            </Link>
          </div>
        </div>

        <div className="relative h-[320px] lg:h-[620px]">
          <Image
            src={hero.sekiller[0]}
            alt={hero.ad}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            priority
            className="object-cover"
          />
          <Link
            href={`/mehsul/${hero.kod.toLowerCase()}`}
            className="absolute bottom-5 left-5 flex flex-col gap-1 rounded-xl bg-surface/94 px-5 py-3 backdrop-blur transition-colors hover:bg-surface lg:bottom-7 lg:left-7"
          >
            <span className="text-[14.5px] font-semibold">{hero.ad}</span>
            <span className="code text-[11.5px] text-ink-faint">
              {hero.kod} · {hero.material.slice(0, 2).join(" + ").toLowerCase()}
            </span>
          </Link>
        </div>
      </section>

      {/* ---------------- KATEQORİYALAR ---------------- */}
      <section className="mx-auto max-w-[1440px] px-5 pt-16 lg:px-14 lg:pt-24">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="text-[30px] lg:text-[40px]">Nə hazırlayırıq</h2>
          <span className="shrink-0 text-[13.5px] text-ink-faint">
            {categories.length} kateqoriya · {products.length} iş
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-3 lg:gap-5">
          {categories.map((c) => {
            const first = inStock.find((p) => p.kateqoriya === c.acar) ?? products.find((p) => p.kateqoriya === c.acar)!;
            return (
              <Link
                key={c.acar}
                href={`/kataloq/${c.acar}`}
                className="group overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-band lg:aspect-[16/11]">
                  <Image
                    src={first.sekiller[0]}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 440px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-2 px-4 py-3.5 lg:px-5 lg:py-4">
                  <span className="font-display text-[17px] lg:text-[22px]">{c.ad}</span>
                  <span className="shrink-0 text-[13px] text-ink-faint">
                    {counts[c.acar] ?? 0} iş
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------- STOKDA HAZIR ---------------- */}
      {inStock.length > 0 && (
        <section className="mt-16 bg-band py-14 lg:mt-24 lg:py-18">
          <div className="mx-auto max-w-[1440px] px-5 lg:px-14">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-2.5">
                <span className="flex items-center gap-2 eyebrow text-stock">
                  <span className="block size-2.5 rounded-full bg-stock" aria-hidden="true" />
                  Stokda hazır
                </span>
                <h2 className="text-[30px] lg:text-[40px]">Dərhal göndərilir</h2>
                <p className="max-w-[46ch] text-ink-muted">
                  Bu işlər hazırdır və gözləmək lazım deyil — sifarişdən sonra{" "}
                  {site.stockDelivery} ərzində əlinizdə olur.
                </p>
              </div>
              <Link
                href="/kataloq?stok=var"
                className="flex shrink-0 items-center gap-2 font-semibold text-emerald transition-colors hover:text-emerald-dark"
              >
                Hamısına bax ({inStockCount}) <ArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {inStock.map((p) => (
                <ProductCard key={p.kod} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- PANNO — TÜND ZOLAQ ---------------- */}
      {panelPair.length === 2 && (
        <section className="bg-dark py-16 text-dark-ink lg:py-22">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 lg:grid-cols-2 lg:gap-14 lg:px-14">
            <div className="flex flex-col items-start gap-5">
              <span className="eyebrow text-gold-bright">Xəttatlıq</span>
              <h2 className="text-[32px] leading-tight text-dark-ink lg:text-[44px]">
                Divar pannoları
              </h2>
              <p className="max-w-[40ch] leading-relaxed text-dark-muted lg:text-[17px]">
                Qara qatran üzərində qızılı xəttatlıq, kristal və qızıl vərəq damarları. Ölçü və
                mətn sifarişə görə seçilir — ev açılışı və toy hədiyyəsi üçün ən çox seçilən
                işimiz.
              </p>
              <Link
                href="/kataloq/panno"
                className="mt-1 rounded-full border border-dark-line px-7 py-3.5 font-semibold transition-colors hover:bg-dark-line"
              >
                Pannolara bax
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {panelPair.map((p, i) => (
                <Link
                  key={p.kod}
                  href={`/mehsul/${p.kod.toLowerCase()}`}
                  className={`relative aspect-[3/4] overflow-hidden rounded-2xl ${i === 1 ? "lg:mt-9" : ""}`}
                >
                  <Image
                    src={p.sekiller[0]}
                    alt={p.ad}
                    fill
                    sizes="(max-width: 1024px) 45vw, 320px"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- NECƏ İŞLƏYİR ---------------- */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-14 lg:py-24">
        <h2 className="mb-3 text-[30px] lg:text-[40px]">Necə işləyir</h2>
        <p className="mb-9 text-ink-muted lg:text-[16.5px]">İki yol var — hansı sizə uyğundursa.</p>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-7 lg:p-9">
            <span className="flex items-center gap-2.5 eyebrow text-[12px] text-stock">
              <span className="block size-2.5 rounded-full bg-stock" aria-hidden="true" />
              Stokda var
            </span>
            <span className="font-display text-[24px] lg:text-[26px]">
              {site.stockDelivery} ərzində əlinizdə
            </span>
            <ol className="flex flex-col gap-3.5">
              {[
                "Kataloqdan hazır işi seçirsiniz",
                "«Al» düyməsi WhatsApp-ı hazır mesajla açır",
                "Ünvanı yazırsınız, göndəririk",
              ].map((s, i) => (
                <li key={s} className="flex items-baseline gap-3.5">
                  <span className="min-w-[22px] font-display text-[20px] text-stock">{i + 1}</span>
                  <span className="text-[15.5px]">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-7 lg:p-9">
            <span className="flex items-center gap-2.5 eyebrow text-[12px] text-gold">
              <span className="block size-2.5 rounded-full border-2 border-gold" aria-hidden="true" />
              Sifarişlə
            </span>
            <span className="font-display text-[24px] lg:text-[26px]">{site.leadTime}</span>
            <ol className="flex flex-col gap-3.5">
              {[
                "Bəyəndiyiniz işi və rəngi seçirsiniz",
                "Ölçü, rəng və həkk mətnini razılaşdırırıq",
                "Əl ilə tökülür, cilalanır və göndərilir",
              ].map((s, i) => (
                <li key={s} className="flex items-baseline gap-3.5">
                  <span className="min-w-[22px] font-display text-[20px] text-gold">{i + 1}</span>
                  <span className="text-[15.5px]">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- ATELYE ---------------- */}
      <section className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-14 lg:pb-24">
        <div className="flex flex-col gap-6 rounded-3xl border border-line bg-surface p-7 lg:p-12">
          <span className="eyebrow text-gold">Atelyedən</span>
          <h2 className="max-w-[20ch] text-[26px] leading-tight lg:text-[36px]">
            Hər iş bir dəfə tökülür
          </h2>
          <p className="max-w-[62ch] leading-relaxed text-ink-muted lg:text-[16.5px]">
            Qatran öz axışını özü seçir — eyni rəngdən iki dəfə tökəndə də iki fərqli iş çıxır. Ona
            görə kataloqdakı hər əşya tək nüsxədir və satıldıqdan sonra eynisi təkrarlanmır.
          </p>
          <dl className="mt-1 flex flex-wrap gap-x-10 gap-y-5">
            {[
              [site.followers, "Instagram izləyicisi"],
              [String(products.length), "kataloqdakı iş"],
              [site.leadTime.replace(" iş günü", ""), "gün hazırlıq"],
            ].map(([v, k]) => (
              <div key={k} className="flex flex-col">
                <dt className="font-display text-[28px] lg:text-[30px]">{v}</dt>
                <dd className="text-[13px] text-ink-faint">{k}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
