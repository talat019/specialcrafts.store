# specialcrafts.store

Epoksid qatran əl işləri — kataloq, onlayn ödəniş və admin paneli.

| | |
|---|---|
| Brend | special crafts / By Semedova |
| Instagram | [@special__crafts](https://instagram.com/special__crafts) · TikTok [@special__crafts](https://tiktok.com/@special__crafts) |
| **Canlı sayt** | **https://specialcrafts.store** (SolOcean VPS, Docker + Caddy) |
| Status | **Yayımdadır** — ödəniş test rejimində, qiymətlər gözlənilir |
| Kataloq | **34 məhsul · 9 kateqoriya** · 14-ü qiymətli və səbətə atıla bilir |
| Dillər | **İngiliscə (standart)** · Rusca · Azərbaycanca |
| Valyuta | USD (`src/lib/money.ts` — bir yerdən dəyişir) |
| Çatdırılma | **Dünyanın hər yerinə** — 81 ölkə, 5 zona (`src/lib/shipping.ts`) |

## İşə salmaq

```bash
docker start specialcrafts-postgres   # və ya öz Postgres-iniz
cp .env.example .env.local            # DATABASE_URL və SESSION_SECRET yazın
npm install
npm run db:push                       # cədvəlləri yaradır
npm run db:seed                       # content/products.json → baza
npm run admin:create -- siz@mail.com  # admin yaradır, şifrəni ekrana yazır
npm run dev                           # http://localhost:3000
```

## Memarlıq

| | |
|---|---|
| Framework | Next.js 15 (App Router, server) · TypeScript · Tailwind CSS 4 |
| Baza | PostgreSQL + Drizzle ORM (`src/db/schema.ts`) |
| Admin | `/admin` — sessiya çərəzi, scrypt şifrə heşi, əlavə paket yoxdur |
| Ödəniş | Payriff · Kapital Bank (mTLS) · Test simulyatoru — `src/lib/payment/` |
| Şəkillər | `public/assets/products/…`, admin paneldən yüklənir |

### Sifariş axını

```
Məhsul → Səbətə at → /sebet → /sifaris → ödəniş provayderi
   → bank səhifəsi → /odenis/netice/<nömrə>
   → bank callback → /api/odenis/callback/<provayder>
```

Callback gövdəsinə **etibar edilmir**: bildiriş gələndə ödənişin keçdiyi provayderin öz
API-si ilə yenidən soruşulur. Təsdiq gələndə stok avtomatik azalır, ədəd sıfıra düşəndə
məhsul «Satılıb» halına keçir — səhifəsi silinmir. Təkrar callback stoku ikinci dəfə
azaltmır.

### Dillər

`/en`, `/ru`, `/az` — standart ingiliscədir. Prefiksiz ünvan brauzerin dilinə görə
yönləndirilir, seçim `sc_locale` çərəzində saxlanılır.

| Nə | Harada |
|---|---|
| İnterfeys mətnləri | `src/i18n/en.ts` · `ru.ts` · `az.ts` (üçü eyni struktur) |
| Məhsul və kateqoriya adları | bazada `name_en` / `name_ru` sütunları |
| İlkin tərcümə mənbəyi | `content/translations.json` |

Tərcümə yoxdursa azərbaycancaya qayıdır — yəni yeni məhsul əlavə edəndə sayt sınmır.
Admin paneli yalnız azərbaycancadır.

### Çatdırılma

Zona × ölçü sinfi cədvəli — `src/lib/shipping.ts` içindəki `RATES`. Sifarişdəki **ən böyük**
əşya tarifi müəyyən edir; qiymət sifariş üzrədir, məhsul üzrə deyil.

| Zona | Kiçik | Orta | Böyük | Müddət |
|---|---:|---:|---:|---|
| Bakı | $3 | $3 | $5 | 1–2 gün |
| Azərbaycan | $5 | $5 | $8 | 2–4 gün |
| Qonşu ölkələr | $15 | $25 | $45 | 5–10 gün |
| Avropa | $20 | $35 | $65 | 7–14 gün |
| Qalan dünya | $25 | $45 | $85 | 10–21 gün |

> ⚠ **Bu rəqəmlər təxminidir.** Azərpoçt / kuryer ilə real tarifi dəqiqləşdirdikdən sonra
> yalnız `RATES` cədvəli dəyişdirilir — qalan kod toxunulmur.

**Qutu ölçüləri və həcm çəkisi** (`BOXES` cədvəli):

| Sinif | Qutu (sm) | Həcm | ÷5000 kuryer | ÷6000 poçt | Təsdiq |
|---|---|---:|---:|---:|---|
| Böyük | 40 × 40 × 8 | 12 800 sm³ | 2,56 kq | 2,13 kq | ✓ |
| Orta | 30 × 22 × 10 | 6 600 sm³ | 1,32 kq | 1,10 kq | ⚠ təxmini |
| Kiçik | 15 × 12 × 5 | 900 sm³ | 0,18 kq | 0,15 kq | ⚠ təxmini |

Kuryer faktiki və həcm çəkisindən **böyüyünü** hesablayır. Tarif soruşanda qutunun
ölçülərini deyin — yalnız çəkini demək azdır.

Məhsulun ölçü sinfi (`ship_tier`) kateqoriyaya görə verilir və admin paneldən deyil,
`TIER_BY_CATEGORY` cədvəlindən gəlir. Siyahıda olmayan ölkə ən uzaq zona kimi hesablanır.

### Üç məhsul vəziyyəti

| Vəziyyət | Rəng | Alıcının gördüyü |
|---|---|---|
| **Stokda var** + qiymət var | yaşıl `#3E7D5A` | «Səbətə at» — onlayn ödəniş |
| **Stokda var**, qiymət yoxdur | yaşıl | yalnız WhatsApp |
| **Sifarişlə** | qızılı `#A98237` | WhatsApp, 5–7 iş günü |
| **Satılıb** | boz `#8B8177` | «Bənzərini sifariş et» |

Səbətə yalnız **stokda olan və qiyməti təyin edilmiş** məhsul atıla bilər. Qiymətlər
brauzerdən qəbul edilmir — hər dəfə bazadan oxunur.

## Gündəlik iş

Hər şey `/admin` panelindən:

- **Məhsullar** — qiymət, vəziyyət, ədəd bir kliklə; yeni məhsul, şəkil yükləmə
- **Sifarişlər** — müştəri məlumatı, məbləğ, ödəniş və çatdırılma statusu

`content/products.json` yalnız ilkin köçürmə üçündür; gündəlik dəyişikliklər bazada olur.

## Sənədlər

- **[docs/ODENIS-QOSULMA.md](docs/ODENIS-QOSULMA.md)** — Payriff və Kapital Bank hesabı açma
- **[docs/DEPLOY.md](docs/DEPLOY.md)** — hostinq və domen
- **[docs/PLAN.md](docs/PLAN.md)** · **[docs/KATALOQ-HESABATI.md](docs/KATALOQ-HESABATI.md)** · **[docs/DESIGN-PROMPT.md](docs/DESIGN-PROMPT.md)** · **[docs/BRAND.md](docs/BRAND.md)**

## Qalanlar

1. **DNS** — Namecheap-də köhnə parking A qeydi (`192.64.119.57`) silinməlidir; ziyarətçilərin
   yarısı ona düşür və sayt açılmır. Bax `docs/DEPLOY.md`.
2. **Qiymətlər** — 34 məhsulun hamısında boşdur. Qiymət olmadan onlayn ödəniş işləmir.
3. **Payriff təsdiqi** — hesab hələ «in Review». Bax `docs/ODENIS-QOSULMA.md`.
4. **WhatsApp nömrəsi** — `src/lib/site.ts`, təsdiq gözləyir.
5. **Loqo** — JPG, yazıda «AZERBAIJAN**N**» səhvi var (neon lövhədə «AZERBAIJANI» yazılıb).
6. **`SHM-003`** şəkli 360×360 — yenidən çəkilməlidir.
