import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getCategories, getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const now = new Date();
  const staticPages = ["", "/kataloq", "/ferdi-sifaris", "/korporativ", "/haqqimizda", "/qaydalar", "/elaqe"];

  return [
    ...staticPages.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: now,
      priority: p === "" ? 1 : 0.8,
    })),
    ...categories.map((c) => ({
      url: `${site.url}/kataloq/${c.acar}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${site.url}/mehsul/${p.kod.toLowerCase()}`,
      lastModified: now,
      priority: 0.9,
    })),
  ];
}
