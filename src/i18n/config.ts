export const locales = ["en", "ru", "az"] as const;
export type Locale = (typeof locales)[number];

/** Saytın standart dili — ingiliscə. */
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  az: "Azərbaycanca",
};

/** Dil seçicisində qısa etiket. */
export const localeShort: Record<Locale, string> = { en: "EN", ru: "RU", az: "AZ" };

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** Lokalı nəzərə alan ünvan: L("ru", "/kataloq") → "/ru/kataloq" */
export function L(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Brauzerin Accept-Language başlığından ən uyğun dili seçir. */
export function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const wanted = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of wanted) {
    const base = tag.split("-")[0];
    if (base === "az") return "az";
    if (base === "ru") return "ru";
    if (base === "en") return "en";
    // qonşu dillərdən gələnlər üçün rus dili daha faydalıdır
    if (["tr", "uk", "be", "kk", "ky", "uz", "ka", "hy"].includes(base)) return "ru";
  }
  return defaultLocale;
}
