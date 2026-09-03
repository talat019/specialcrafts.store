# Payriff və Kapital Bank — hesab açma və qoşulma

VÖEN-iniz var, merchant hesabı yoxdur. Aşağıdakı iki yolun hər ikisi paralel gedə bilər.
Sayt hazırdır: açarlar `.env` faylına yazılan kimi real ödəniş işə düşür, kod dəyişmir.

---

## 1. Payriff (daha sürətli, daha sadə)

Payriff Kapital Bank dəstəkli aqreqatordur. Texniki tərəfdən ən asan variantdır:
sadə REST API, sertifikat tələb etmir.

### Nə lazımdır
- VÖEN (fərdi sahibkar və ya MMC)
- Bank hesabı (hansı bank olması fərq etmir)
- Şəxsiyyət vəsiqəsi
- Saytın işlək ünvanı — ödəniş sistemləri yayımda olan sayt tələb edir
- Saytda **açıq şəkildə** olmalı: qiymətlər, çatdırılma şərtləri, qaytarma qaydaları, əlaqə
  məlumatları. Bunların hamısı hazırdır (`/qaydalar`, `/elaqe`) — **yalnız qiymətlər çatmır.**

### Addımlar
1. [payriff.com](https://payriff.com) → müraciət formu.
2. Sənədləri yükləyin, müqavilə imzalanır.
3. Kabinetdə **Applications** bölməsindən götürürsünüz:
   - `merchant` identifikatoru
   - `secret key` (Authorization açarı)
4. Bu ikisini mənə **YAZMAYIN** — `.env.local` faylına özünüz yazın:

```
PAYMENT_MODE=canli
PAYRIFF_MERCHANT=ES1234567
PAYRIFF_SECRET=************
```

5. Kabinetdə **callback URL** olaraq bunu göstərin:
   `https://specialcrafts.store/api/odenis/callback/payriff`

### Hesabın vəziyyəti (2026-09-03)

Açarlar `.env.local`-a yazılıb (`ES1097915`). Canlı API-yə yalnız oxuma sorğusu atıldı —
sifariş yaradılmadı. Payriff cavabı:

> `Application already in Review, Please wait.`

Yəni **açarlar qəbul olunur, amma hesab hələ Payriff tərəfindən təsdiqlənməyib.**
Təsdiq gələnə qədər real ödəniş mümkün deyil. Kabinetdə statusu izləyin; təsdiqdən
sonra `PAYMENT_MODE=canli` yazılır.

### Endpoint-lər (canlı API-də yoxlanılıb)

| Əməliyyat | Ünvan |
|---|---|
| Sifariş yaratmaq | `POST /api/v2/orders` |
| Status öyrənmək | `POST /api/v2/getStatusOrder` |
| *(v3 alternativi)* | `POST /api/v3/orders` · `GET /api/v3/orders/{id}` |

`/get-status` ünvanı **yoxdur** — sənədlərin bəzi nüsxələrində belə göstərilir, amma
API 404 qaytarır. Kodda düzəldilib.

**Cavab sahələrinin dəqiq adları** (`orderId`, `paymentUrl`, `orderStatus`) hesab
aktivləşəndən sonra ilk real sifarişdə təsdiqlənməlidir — kod bir neçə ad variantını
qəbul edəcək şəkildə yazılıb, amma bu, təxmindir, təsdiq deyil.

---

## 2. Kapital Bank e-commerce (birbaşa bank)

Komissiya adətən aqreqatordan aşağı olur, amma texniki qoşulma daha ağırdır:
bank **mTLS sertifikatı** verir, sorğular həmin sertifikatla imzalanır.

### Nə lazımdır
- VÖEN + **Kapital Bank-da hesab** (bu şərtdir)
- Nizamnamə / qeydiyyat sənədləri
- Yayımda olan sayt

### Addımlar
1. Kapital Bank filialına və ya [kapitalbank.az](https://www.kapitalbank.az) üzərindən
   «E-commerce / internet ekvayrinq» üçün müraciət.
2. Müqavilədən sonra bank verir:
   - `merchant` identifikatoru
   - müştəri **sertifikatı** (`.crt`) və **açarı** (`.key`)
3. Sertifikatı PEM formatında `.env.local`-a yazın (sətir sonları `\n` ilə):

```
KAPITAL_MERCHANT=E1234567
KAPITAL_CERT=-----BEGIN CERTIFICATE-----\nMIIE...\n-----END CERTIFICATE-----
KAPITAL_KEY=-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----
KAPITAL_BASE_URL=https://tstpg.kapitalbank.az
```

4. Əvvəlcə **test** ünvanında (`tstpg`) yoxlayırıq, bank təsdiq edəndən sonra
   `KAPITAL_BASE_URL` istehsalat ünvanı ilə əvəzlənir.
5. Callback URL: `https://specialcrafts.store/api/odenis/callback/kapital`

> **Diqqət:** Kapital Bank sertifikatı serverless mühitdə (Vercel) əlavə iş tələb edir.
> Öz VPS-inizdə problem yoxdur. Host seçimi bu qərara təsir edir.

---

## 3. Hansını seçmək

| | Payriff | Kapital Bank |
|---|---|---|
| Qoşulma müddəti | günlər | həftələr |
| Texniki mürəkkəblik | aşağı | orta (sertifikat) |
| Komissiya | aqreqator marjası var | adətən daha aşağı |
| Apple / Google Pay | var | bankdan asılı |
| Host məhdudiyyəti | yoxdur | serverless-də çətin |

**Tövsiyə:** Payriff ilə başlayın — sayt tez satışa çıxsın. Kapital Bank müqaviləsi
hazır olanda ikinci üsul kimi əlavə edilir; kodda hər ikisi artıq var, sadəcə açarlar
əlavə olunur.

---

## 4. Nə vaxta qədər test rejimindəyik

`.env.local`-da `PAYMENT_MODE=test` durduğu müddətcə:

- Müştəri ödəniş səhifəsinə deyil, **saxta test səhifəsinə** düşür.
- Kartdan pul çıxmır.
- «Ödənişi uğurlu simulyasiya et» düyməsi sifarişi ödənilmiş edir, stoku azaldır —
  yəni bütün axın real kimi yoxlanılır.

`PAYMENT_MODE=canli` yazılan kimi test səhifəsi bağlanır və yalnız açarları olan
provayderlər göstərilir.
