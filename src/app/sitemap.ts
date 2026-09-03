import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getCategories, getProducts } from "@/lib/products";
import { defaultLocale, locales } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories(defaultLocale),
    getProducts(defaultLocale),
  ]);
  const now = new Date();
  const paths = [
    "", "/kataloq", "/ferdi-sifaris", "/korporativ", "/haqqimizda", "/qaydalar", "/elaqe",
    ...categories.map((c) => `/kataloq/${c.acar}`),
    ...products.map((p) => `/mehsul/${p.kod.toLowerCase()}`),
  ];

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: now,
      priority: path === "" ? 1 : path.startsWith("/mehsul") ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])),
      },
    })),
  );
}
