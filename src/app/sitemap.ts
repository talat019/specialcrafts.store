import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories, products } from "@/lib/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
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
