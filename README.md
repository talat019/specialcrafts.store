# specialcrafts.store

Epoksid qatran əl işləri — onlayn kataloq və WhatsApp sifariş saytı.

| | |
|---|---|
| Brend | special crafts / By Semedova |
| Instagram | [@special__crafts](https://instagram.com/special__crafts) |
| TikTok | [@special__crafts](https://tiktok.com/@special__crafts) |
| **Canlı sayt** | **https://talat019.github.io/specialcrafts.store/** |
| Repo | [talat019/specialcrafts.store](https://github.com/talat019/specialcrafts.store) |
| Domen | `specialcrafts.store` — qeydiyyatda, hələ bağlanmayıb (bax [docs/DEPLOY.md](docs/DEPLOY.md)) |
| Status | **Faza 1 yayımda** — qiymətlər gözlənilir |

## İşə salmaq

```bash
npm install       # bir dəfə
npm run dev       # http://localhost:3000
npm run build     # istehsal buildi
npm start         # buildi işə salır
```

## Sayt necə qurulub

| | |
|---|---|
| Framework | Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 |
| Məzmun | `content/products.json` — 18 məhsul, tək mənbə |
| Şəkillər | `public/assets/products/...` (`next/image` ilə AVIF/WebP) |
| Sifariş | Səbət yoxdur — hər məhsul WhatsApp-ı hazır mətnli mesajla açır |
| SEO | Hər məhsulda `Product` + `Offer` JSON-LD, `LocalBusiness`, sitemap, robots |
| Səhifə sayı | 36 (statik generasiya) |

### Üç məhsul vəziyyəti

Bütün struktur bunun üzərində qurulub:

| Vəziyyət | Rəng | Düymə | Vəd |
|---|---|---|---|
| **Stokda var** | yaşıl `#3E7D5A` | «Al — stokda var» | 1–2 iş günü |
| **Sifarişlə** | qızılı `#A98237` | «Sifariş et» | 5–7 iş günü |
| **Satılıb** | boz `#8B8177` | «Bənzərini sifariş et» | səhifə silinmir |

Stokda olan məhsulda rəng və ölçü seçimi **göstərilmir** — əşya artıq hazırdır.

## Məhsul əlavə etmək / stoku dəyişmək

Yalnız `content/products.json` redaktə olunur:

- Satıldı → `"stok": "satilib"`, `"stokSayi": 0`
- Qiymət → `"qiymet": 190` (null olduqda saytda «Qiymət üçün yazın» yazılır)
- Yeni məhsul → kodu ilə bir qeyd əlavə et, şəklini `public/assets/products/<kateqoriya>/` qovluğuna at

Sonra `npm run build`.

## Sənədlər

- **[docs/PLAN.md](docs/PLAN.md)** — tam sayt planı
- **[docs/KATALOQ-HESABATI.md](docs/KATALOQ-HESABATI.md)** — şəkillərin təhlili və açıq məsələlər
- **[docs/DESIGN-PROMPT.md](docs/DESIGN-PROMPT.md)** — Claude Design promptu
- **[docs/BRAND.md](docs/BRAND.md)** — brend araşdırması
- **[design/](design/)** — dizayn kanvasının mənbə faylları

## Yayımlamazdan əvvəl

1. **Qiymətlər** — 18 məhsulun hamısında boşdur.
2. **WhatsApp nömrəsi** — `src/lib/site.ts` içindəki `whatsapp` sahəsi təsdiqlənməlidir.
3. **Loqo** — JPG-dir və yazıda «AZERBAIJAN**N**» səhvi var.
4. **`SHM-003`** şəkli 360×360 — yenidən çəkilməlidir.
5. **`SHM-004`** — klub emblemi ticarət nişanıdır, şəkil dəyişdirilməlidir.
