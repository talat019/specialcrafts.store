# Yayımlama

## Vacib dəyişiklik

Faza 1-də sayt statik idi və **GitHub Pages**-də dayanırdı. Faza 2-də ödəniş, admin panel
və verilənlər bazası əlavə olundu — bunlar server tələb edir. **GitHub Pages artıq yaramır**
və Actions iş axını silindi.

Köhnə link (`talat019.github.io/specialcrafts.store`) hələ də Faza 1 versiyasını göstərir —
yeni host seçiləndən sonra onu bağlamaq olar.

## Nə lazımdır

- Node 22+ işlədən host
- PostgreSQL 15+
- Yüklənən şəkillər üçün **davamlı disk** (`public/assets/products/`)

## Variant A — Öz VPS (tövsiyə olunur)

Kapital Bank sertifikatı və şəkil yükləmə üçün ən rahat yol. Hetzner CX22 ~4 €/ay kifayətdir.

```bash
# serverdə
git clone https://github.com/talat019/specialcrafts.store.git
cd specialcrafts.store
cp .env.example .env.local     # DATABASE_URL, SESSION_SECRET, ödəniş açarları
npm ci && npm run build
npm run db:push && npm run db:seed
npm run admin:create -- siz@mail.com
```

Sonra `pm2` və ya `systemd` ilə `npm start`, qarşısında **Caddy** (avtomatik SSL):

```
specialcrafts.store {
  reverse_proxy localhost:3000
}
```

Postgres üçün eyni serverdə Docker kifayətdir.

## Variant B — Vercel

Sürətli, amma iki məhdudiyyət var:

1. **Şəkil yükləmə işləmir** — Vercel-in diski müvəqqətidir. Vercel Blob əlavə edilməlidir
   (`src/lib/admin-actions.ts` içindəki `writeFile` hissəsi dəyişir).
2. **Kapital Bank mTLS** — sertifikat env dəyişəni kimi saxlanmalıdır; işləyir, amma
   sazlaması çətindir.

Baza üçün **Neon** (pulsuz plan) uyğundur: `DATABASE_URL` Vercel-in Environment Variables
bölməsinə yazılır.

## Domen

Namecheap → Advanced DNS:

| Host | VPS üçün | Vercel üçün |
|---|---|---|
| `@` | A → serverin IP-si | Vercel-in verdiyi A qeydi |
| `www` | CNAME → `specialcrafts.store.` | `cname.vercel-dns.com` |

Sonra `.env.local`-da:

```
NEXT_PUBLIC_SITE_URL=https://specialcrafts.store
```

Bu dəyişən ödəniş callback ünvanlarında istifadə olunur — səhv olsa bank cavabı gəlməz.

## Yayımdan sonra

- Google Search Console-a `sitemap.xml` göndərin.
- Instagram bio: `specialcrafts.store/?utm_source=instagram`
- Story linki: `specialcrafts.store/kataloq?stok=var`
- `/admin` ünvanını heç yerdə paylaşmayın — `robots.txt` onu indeksdən kənarda saxlayır.
