/**
 * Çatdırılma zonaları və tarifləri.
 *
 * ⚠ QİYMƏTLƏR TƏXMİNİDİR. Azərpoçt / kuryer şirkəti ilə real tarifi
 * dəqiqləşdirdikdən sonra yalnız `RATES` cədvəli dəyişdirilir — qalan kod toxunulmur.
 * Valyuta: USD (bax lib/money.ts).
 */

export type Zone = "az-baku" | "az-region" | "caucasus" | "europe" | "world" | "pickup";

/** Məhsulun ölçü/çəki sinfi — çatdırılma qiyməti bundan asılıdır. */
export type ShipTier = "small" | "medium" | "large";

/** zona × ölçü sinfi → qiymət (USD). Sifarişdəki ƏN BÖYÜK sinif tətbiq olunur. */
export const RATES: Record<Exclude<Zone, "pickup">, Record<ShipTier, number>> = {
  "az-baku":   { small: 3,  medium: 3,  large: 5 },
  "az-region": { small: 5,  medium: 5,  large: 8 },
  caucasus:    { small: 15, medium: 25, large: 45 },
  europe:      { small: 20, medium: 35, large: 65 },
  world:       { small: 25, medium: 45, large: 85 },
};

/** Kateqoriya üzrə standart ölçü sinfi (məhsulda ayrıca göstərilməyibsə). */
export const TIER_BY_CATEGORY: Record<string, ShipTier> = {
  saat: "large",
  sahmat: "large",
  panno: "large",
  domino: "medium",
  "acar-asilqani": "medium",
  rehil: "medium",
  "guzgu-daraq": "medium",
  suvenir: "medium",
  aksesuar: "small",
  tesbeh: "small",
  kulqabi: "medium",
  "sep-xonca": "large",
  diger: "medium",
};

const ORDER: ShipTier[] = ["small", "medium", "large"];

export function maxTier(tiers: ShipTier[]): ShipTier {
  return tiers.reduce<ShipTier>(
    (acc, t) => (ORDER.indexOf(t) > ORDER.indexOf(acc) ? t : acc),
    "small",
  );
}

export function shippingCost(zone: Zone, tier: ShipTier): number {
  if (zone === "pickup") return 0;
  return RATES[zone][tier];
}

// ---------------------------------------------------------------- ölkələr

export type Country = { code: string; zone: Exclude<Zone, "pickup" | "az-baku" | "az-region"> | "az" };

/**
 * Çatdırılan ölkələr. Adlar brauzerin öz dilində göstərilir
 * (Intl.DisplayNames) — burada yalnız kod və zona saxlanılır.
 */
export const COUNTRIES: Country[] = [
  { code: "AZ", zone: "az" },

  // qonşu bölgə — quru yolu / qısa məsafə
  ...["GE", "TR", "RU", "IR", "KZ", "UZ", "UA", "BY", "KG", "TM", "TJ", "MD"].map(
    (code) => ({ code, zone: "caucasus" as const }),
  ),

  // Avropa
  ...[
    "GB", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "CH", "SE", "NO", "DK", "FI",
    "PL", "CZ", "SK", "HU", "RO", "BG", "GR", "PT", "IE", "HR", "SI", "RS", "EE",
    "LV", "LT", "IS", "LU", "CY", "MT", "AL", "BA", "MK", "ME",
  ].map((code) => ({ code, zone: "europe" as const })),

  // qalan dünya
  ...[
    "US", "CA", "AE", "SA", "QA", "KW", "BH", "OM", "IL", "JO", "EG", "MA",
    "CN", "JP", "KR", "IN", "PK", "TH", "SG", "MY", "ID", "VN", "PH",
    "AU", "NZ", "BR", "AR", "MX", "CL", "ZA", "NG", "KE",
  ].map((code) => ({ code, zone: "world" as const })),
];

const ZONE_BY_COUNTRY = new Map(COUNTRIES.map((c) => [c.code, c.zone]));

/** Ölkə koduna görə zona. Azərbaycan üçün daxili üsul ayrıca seçilir. */
export function zoneForCountry(code: string, azMethod: "baku" | "region" | "pickup"): Zone {
  const z = ZONE_BY_COUNTRY.get(code.toUpperCase());
  if (!z) return "world"; // siyahıda yoxdursa ən uzaq zona kimi hesablanır
  if (z === "az") {
    return azMethod === "pickup" ? "pickup" : azMethod === "baku" ? "az-baku" : "az-region";
  }
  return z;
}

export function isDomestic(code: string): boolean {
  return code.toUpperCase() === "AZ";
}

/** Ölkə adını istifadəçinin dilində qaytarır. */
export function countryName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** Seçim siyahısı üçün ölkələr — ad üzrə sıralanmış, Azərbaycan birinci. */
export function countryOptions(locale: string): { code: string; name: string; zone: string }[] {
  const rest = COUNTRIES.filter((c) => c.code !== "AZ")
    .map((c) => ({ code: c.code, name: countryName(c.code, locale), zone: c.zone }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
  return [
    { code: "AZ", name: countryName("AZ", locale), zone: "az" },
    ...rest,
  ];
}

/** Beynəlxalq göndərişin təxmini müddəti (gün). */
export const TRANSIT_DAYS: Record<Zone, string> = {
  "az-baku": "1–2",
  "az-region": "2–4",
  caucasus: "5–10",
  europe: "7–14",
  world: "10–21",
  pickup: "—",
};
