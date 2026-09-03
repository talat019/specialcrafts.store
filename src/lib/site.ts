export const site = {
  name: "special crafts",
  tagline: "Unikal əl işləri",
  owner: "By Semedova",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://specialcrafts.store",
  description:
    "Epoksid qatrandan əl ilə hazırlanmış divar saatları, şahmat və domino dəstləri, xəttatlıq pannoları. Bir hissəsi stokda hazırdır, qalanı 5–7 günə sifarişlə hazırlanır.",
  city: "Bakı",
  /** Mağazanın vahid valyutası. Manata keçmək üçün yalnız bu iki sətir dəyişir. */
  currency: "USD",
  currencySymbol: "$",
  // TODO: nömrəni təsdiqləyin — Instagram bio-sunda bir rəqəm artıq görünürdü
  whatsapp: "994506169987",
  phoneDisplay: "+994 50 616 99 87",
  instagram: "https://instagram.com/special__crafts",
  tiktok: "https://tiktok.com/@special__crafts",
  followers: "5 900+",
  /** Rəqəm hissəsi — «iş günü» sözü lüğətdən gəlir (bax lib/product-view.ts) */
  leadDays: "5–7",
  stockDays: "1–2",
} as const;

export const nav = [
  { href: "/kataloq", label: "Kataloq" },
  { href: "/ferdi-sifaris", label: "Fərdi sifariş" },
  { href: "/korporativ", label: "Korporativ" },
  { href: "/haqqimizda", label: "Haqqımızda" },
  { href: "/elaqe", label: "Əlaqə" },
] as const;
