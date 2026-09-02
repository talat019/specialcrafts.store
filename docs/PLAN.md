# specialcrafts.store — tam sayt planı

Versiya 1.2 · 2026-09-03 · Bax: [KATALOQ-HESABATI.md](KATALOQ-HESABATI.md), [DESIGN-PROMPT.md](DESIGN-PROMPT.md), [BRAND.md](BRAND.md)

---

## 1. Saytın işi nədir

Sayt **onlayn mağaza deyil** — o, **sifariş çevirici kataloqdur**.

Səbəb: məhsulların bir hissəsi 5–7 gün ərzində əl ilə hazırlanır, hər biri unikaldır, rəng/ölçü/həkk fərdiləşdirilir. Klassik «səbətə at → kartla ödə» axını bu hissəyə uyğun gəlmir və gözlənti yaradıb məyusluqla bitir.

### İki fərqli məhsul vəziyyəti — saytın strukturunu bu müəyyən edir

| Vəziyyət | Nə deməkdir | Müştəri kimdir | Sayt nə vəd edir |
|---|---|---|---|
| **Stokda var** | Hazır əşya, rəfdədir, dərhal göndərilir | «Bu axşam hədiyyə lazımdır» | «Stokda var — 1–2 gün ərzində əlinizdə» |
| **Sifarişlə** | Fərdiləşdirilib hazırlanır | Planlı alıcı, xüsusi münasibət | «5–7 iş günündə hazırlanır» |
| **Satılıb** | Tək nüsxə idi, gedib | — | Kart soluq, «Bənzərini sifariş edin» |

Bu ayrım **hər kartda, hər filtrdə və hər sifariş düyməsində** görünməlidir. Səbəb sadədir: gözləmə müddəti alıcının ən böyük etirazıdır — stokda olan məhsul bu etirazı tamamilə aradan qaldırır, ona görə onlar saytda **ön plandadır**.

**Əsas konversiya hərəkəti:** məhsul səhifəsindən → **hazır mətnli WhatsApp mesajı**.

```
# Stokda olan məhsul üçün
Salam! specialcrafts.store saytından yazıram.
STOKDA olan məhsulu almaq istəyirəm:
Təsbeh — «Kəhrəba» (kod: TSB-014) · 65 ₼
Çatdırılma ünvanı: ________

# Sifarişlə hazırlanan məhsul üçün
Salam! specialcrafts.store saytından yazıram.
SİFARİŞ vermək istəyirəm:
Təsbeh — «Kəhrəba» (kod: TSB-014)
Ölçü: 33 dənə · Rəng: kəhrəba/qızılı · Həkk: ________
Nə vaxta lazımdır: ________
```

Bu bir cümlə bütün texniki qərarları müəyyən edir. Səbət və onlayn ödəniş **3-cü fazada**, tələb sübut olunandan sonra gəlir.

### Ölçüləcək məqsədlər (ilk 3 ay)

| Metrika | Hədəf |
|---|---|
| Saytdan başlayan WhatsApp sifarişi | ayda ≥ 25 |
| Instagram bio klikindən sayta keçid | ayda ≥ 400 |
| «təsbeh sifariş», «epoksid hədiyyə» üzrə Google mövqeyi | ilk səhifə |
| Korporativ/topdan sorğu | ayda ≥ 2 |
| Stokda olan məhsulun satış sürəti | ≤ 14 gün (rəfdə qalma müddəti) |

---

## 2. Sayt xəritəsi (sitemap)

```
/                        Ana səhifə
/kataloq                 Bütün məhsullar + filtr
/kataloq/saat            Saat                 (8 məhsul)
/kataloq/sahmat          Şahmat               (4)
/kataloq/domino          Domino               (2)
/kataloq/panno           Divar pannosu        (2)
/kataloq/acar-asilqani   Açar asılqanı        (1)
/kataloq/rehil           Rəhil                (1)
                         ── şəkil gələndə açılacaq ──
/kataloq/tesbeh          Təsbeh
/kataloq/kulqabi         Külqabı
/kataloq/guzgu-daraq     Güzgü & daraq dəsti
/kataloq/sep-xonca       Sep & xonça
/mehsul/[kod]            Məhsul detalı  (məs. /mehsul/sat-006)
/ferdi-sifaris           Fərdi sifariş — necə işləyir (addım-addım)
/korporativ              Korporativ və topdan hədiyyələr
/haqqimizda              Usta, atelye, sərgilər
/qaydalar                Çatdırılma, ödəniş, qayğı təlimatı, dəyişdirmə
/elaqe                   Əlaqə
```

**Menyuda göstərilir:** Kataloq · Fərdi sifariş · Korporativ · Haqqımızda · Əlaqə
**Yalnız footer-də:** Qaydalar

**Dil:** 1-ci faza **yalnız Azərbaycan dili**. Rus dili 2-ci fazada (`/ru/...`) — Bakı bazarının nəzərəçarpan hissəsi rusdilli. İngilis dili yalnız xarici sifariş real olarsa.

---

## 3. Səhifə-səhifə məzmun

### 3.1 Ana səhifə

Ardıcıllıq (yuxarıdan aşağı):

1. **Hero** — tam enli, tünd fon, bir dənə ən yaxşı məhsul şəkli.
   Başlıq: *«Unikal əl işləri»* · Alt: *«Hər biri əllə tökülür, təkrarlanmır. Sifarişlər 5–7 gün öncədən qəbul olunur.»*
   Düymələr: **Kataloqa bax** (əsas) · **WhatsApp-da yaz** (ikinci dərəcəli)
2. **Kateqoriya şəbəkəsi** — 8 kart, hər biri bir şəkil + ad. Saytın ən vacib blokudur.
3. **Stokda hazır** — «Dərhal göndərilir» bölməsi, 4–6 məhsul, hər kartda yaşıl «Stokda var» nişanı və qiymət. Sağda «Hamısına bax →» linki `/kataloq?stok=var`.
   *Bu blok kateqoriya şəbəkəsindən dərhal sonra gəlir — çünki gözləmə etirazını aradan qaldıran yeganə bölmədir. Stokda heç nə yoxdursa blok avtomatik gizlənir.*
4. **Seçilmiş işlər** — 6–8 məhsul (stokda olan + sifarişlə), üfüqi sürüşən lent.
5. **Necə işləyir** — iki sütun yan-yana:
   *Stokda var:* Seç → Yaz → 1–2 gündə əlində.
   *Sifarişlə:* Seç → Yaz → Təsdiqlə → 5–7 gündə hazır.
   Şəffaflıq etibar yaradır və hansı yolun kimə uyğun olduğunu bir baxışda göstərir.
6. **Atelyedən** — 2–3 proses fotosu/videosu (töküm, cilalama). Əl işi olduğunu sübut edir.
7. **Hədiyyə paketləməsi** — paketləmə şəkilləri. «Hədiyyəlik» qərarını asanlaşdırır.
8. **Sərgilər** — festival/sərgi fotoları + «5 900+ izləyici» sosial sübutu.
9. **Sifariş CTA zolağı** — WhatsApp + Instagram + telefon.

### 3.2 Kataloq

- Yuxarıda **iki sürətli tab**: «Hamısı» · **«Stokda var»** · «Sifarişlə». URL-də saxlanır (`/kataloq?stok=var`) ki, Instagram story-də birbaşa link verilə bilsin.
- Sol tərəfdə (mobil: yuxarıda açılan) filtr: **vəziyyət** (stokda/sifarişlə), **kateqoriya**, **rəng ailəsi** (okean/kəhrəba/qara-qızılı/ağ-mərmər/yaşıl), **qiymət aralığı**.
- Kart: şəkil (kvadrat 1:1) · ad · kod · qiymət · **vəziyyət nişanı**:
  - 🟢 **Stokda var** — yaşıl nöqtə, `#5FAE7E`
  - 🟡 **Sifarişlə · 5–7 gün** — kəhrəba, `#E0A34E`
  - ⚪ **Satılıb** — boz, kart 55% şəffaflıqda, klik olunur amma sifariş düyməsi «Bənzərini sifariş et» olur
- Sıralama (standart): **Stokda olanlar əvvəl** → sonra yeni → sonra qiymət. Stokda olan məhsul ən sürətli konversiyadır, onu aşağıda gizlətmək mənasızdır.
- Boş nəticə halı: «Bu filtrlə iş tapılmadı — istədiyinizi WhatsApp-da yazın, hazırlayaq.»
- «Stokda var» tabı boşdursa: «Hazırda stokda iş yoxdur — sifarişlə 5–7 günə hazırlayırıq.»

### 3.3 Məhsul detalı — **saytın ən vacib səhifəsi**

| Blok | Məzmun |
|---|---|
| Qalereya | 3–6 şəkil, zoom; ən azı biri **əldə/masada miqyas göstərən** kadr |
| Başlıq | Ad + kod (məs. `TSB-014`) |
| Qiymət | Rəqəm ilə. Bilinmirsə: «Ölçüyə görə — 45 ₼-dən» |
| **Vəziyyət zolağı** | Qiymətin dərhal altında, ən görünən yerdə. Üç haldan biri: 🟢 «**Stokda var** — 1–2 gün ərzində çatdırılır» · 🟡 «**Sifarişlə hazırlanır** — 5–7 iş günü» · ⚪ «**Satılıb** — bənzərini sifarişlə hazırlaya bilərik» |
| Xüsusiyyətlər | Material, ölçü (mm), çəki, dənə sayı (təsbeh üçün), ağac növü |
| Fərdiləşdirmə | Yalnız **sifarişlə** məhsullarda göstərilir: rəng seçimləri, həkk mətni, ölçü variantları. Stokda olan əşya artıq hazırdır — seçim təklif etmək yanlış gözlənti yaradır, ona görə bu blok gizlənir və yerinə «Bu rəngdə fərdi hazırlanmasını istəyirsiniz? →» linki qoyulur |
| **Sifariş düyməsi** | **WhatsApp — məhsul kodu, vəziyyət və seçimlər avtomatik doldurulmuş.** Mətn vəziyyətə görə dəyişir: «**Al — stokda var**» / «**Sifariş et**» / «**Bənzərini sifariş et**» |
| Etibar sətri | Əl işi · Tək nüsxə · Hədiyyə qutusu daxildir · Bakıdaxili çatdırılma |
| Aşağıda | Stokda olan məhsul satıldıqda səhifə **silinmir** — «Satılıb» halına keçir. Google-dakı mövqeyi və Instagram-dakı köhnə linklər qorunur, ziyarətçi isə sifariş axınına yönləndirilir |
| Aşağıda | «Bənzər işlər» — eyni kateqoriyadan 4 məhsul |

### 3.4 Fərdi sifariş

Addım-addım izah + real nümunə (əvvəl/sonra: müştəri ideyası → hazır iş). Qısa bir sorğu forması: *ad, əlaqə, məhsul növü, rəng, tarix, ideya təsviri, referans şəkil yükləmə*. Form nəticəsi e-poçt + WhatsApp bildirişi.

### 3.5 Korporativ

Şirkətlərə: logo həkki, korporativ rənglər, 10+ dəst, faktura. Ayrıca CTA: «Təklif istəyin».
Bu səhifə az əməklə ən yüksək ortalama çek gətirən kanaldır — buraxılmamalıdır.

### 3.6 Haqqımızda

Ustanın hekayəsi (By Semedova), atelye fotoları, sərgi/festival iştirakları, «niyə epoksid» qısa mətn.

### 3.7 Qaydalar

Çatdırılma (Bakı / rayon / Azərpoçt), ödəniş üsulları, **epoksid qayğı təlimatı** (birbaşa günəş şüası, isti su, cızıq), dəyişdirmə şərtləri, fərdi sifarişin geri qaytarılmaması qaydası.

---

## 4. Məhsul məlumat modeli

Hər məhsul üçün bir JSON qeyd (1-ci fazada `content/products/*.json`):

```json
{
  "kod": "TSB-014",
  "ad": "Təsbeh — Kəhrəba",
  "kateqoriya": "tesbeh",
  "qiymet": 65,
  "qiymetQeyd": null,
  "valyuta": "AZN",
  "teksNusxe": true,

  "stok": "var",              // "var" | "sifarisle" | "satilib"
  "stokSayi": 1,              // "var" halında neçə ədəd qalıb
  "hazirliqGunu": null,       // "sifarisle" halında "5-7", stokda null
  "catdirilmaGunu": "1-2",    // stokda olan üçün
  "satilibTarixi": null,      // "satilib" olanda avtomatik yazılır
  "material": ["Epoksid qatran", "Qoz ağacı"],
  "olcu": { "dene": 33, "boncukMm": 10, "uzunlukMm": 340 },
  "rengAilesi": ["kehrebə", "qizili"],
  "rengSecimleri": ["Kəhrəba", "Okean", "Qara-qızılı"],  // yalnız "sifarisle" üçün
  "hekkMumkun": true,                                    // yalnız "sifarisle" üçün
  "sekiller": ["/assets/products/tesbeh/tsb-014-1.webp", "..."],
  "tesvir": "Qoz ağacı və kəhrəba rəngli qatranla əl ilə tökülüb...",
  "seo": { "basliq": "...", "tesvir": "..." },
  "aktiv": true
}
```

**Məhsul kodu sistemi.** Hazırda dolu olanlar: `SAT` saat · `SHM` şahmat · `DMN` domino · `PNO` divar pannosu · `ACR` açar asılqanı · `RHL` rəhil. Şəkil gözləyənlər: `TSB` təsbeh · `KLQ` külqabı · `GZD` güzgü-daraq · `SPX` sep-xonça · `DGR` digər. Nümunə: `SAT-006`.

Bu kod eyni zamanda **şəkil faylının adı**, **WhatsApp mesajındakı istinad** və **Instagram post-unda yazılacaq istinaddır** — üç yerdə bir dil.

### Stok idarəsi — nəyə diqqət

Stokda olan məhsulların əksəriyyəti **tək nüsxədir**. Ən pis ssenari: müştəri artıq satılmış əşyanı sifariş edir. Buna qarşı:

| Risk | Həll |
|---|---|
| Satılmış əşya saytda qalır | Sifariş WhatsApp-dan keçdiyi üçün **hər zaman insan təsdiqi var** — səhv bağlanmadan tutulur |
| Statusu yeniləmək unudulur | Faza 1-də stok siyahısı **qısa saxlanır** (10–15 məhsul). Faza 2-də CMS-də bir kliklə dəyişir |
| Eyni məhsuldan 2 ədəd var | `stokSayi` sahəsi — 0-a düşəndə status avtomatik `satilib` olur |
| Instagram-da satılır, saytda qalır | **Bir qayda:** əşya harada satılırsa satılsın, dərhal `stokSayi` azaldılır. Bu, gündəlik 30 saniyəlik əməliyyatdır və layihənin yeganə davamlı operativ öhdəliyidir |

**Faza 1-də praktiki tövsiyə:** bütün stok bir `stok.json` faylında saxlanılsın, dəyişiklik bir sətir redaktəsi olsun. Mürəkkəb anbar sistemi bu ölçüdə biznesə lazım deyil və istifadə olunmayacaq.

---

## 5. Texniki stek

**Tövsiyə: Next.js 15 (App Router) + TypeScript + Tailwind CSS 4, Vercel-də.**

| Qərar | Seçim | Səbəb |
|---|---|---|
| Framework | Next.js 15 (App Router, statik generasiya) | SEO, şəkil optimizasiyası, pulsuz hosting |
| Stil | Tailwind CSS 4 | Sürət, dizayn sisteminin token kimi saxlanması |
| Şəkil | `next/image` + WebP/AVIF | Yavaş mobil internet üçün kritik |
| Məzmun | 1-ci faza: JSON fayllar · 2-ci faza: Sanity CMS (pulsuz plan) | Başlanğıcda sadəlik, sonra usta özü idarə etsin |
| Hosting | Vercel Hobby (pulsuz) | Domen bağlanır, SSL avtomatik |
| Analitika | Vercel Analytics + Meta Pixel | Instagram reklamı gələcəkdə |
| Form | Resend (e-poçt) + WhatsApp deep link | Server lazım deyil |
| Ödəniş (Faza 3) | **Epoint.az** — *əvvəlcə yalnız stokda olan məhsullar üçün* | Azərbaycanda lisenziyalı, Kapital Bank dəstəkli, Apple/Google Pay var. Stokda olan əşyanın qiyməti sabitdir və dərhal göndərilir — onlayn ödəniş məhz burada məna kəsb edir. Sifarişlə hazırlananlar WhatsApp-da qalır, çünki qiymət fərdiləşdirmədən sonra dəqiqləşir |

### Nə üçün Shopify yox
Aylıq abunə valyutada, AZN ödənişi ilə əlavə problem, kiçik və unikal kataloq üçün artıqdır. Sifariş axını onsuz da WhatsApp-dır.

### Nə üçün sadə HTML yox
Kataloq tez-tez dəyişəcək, filtr və SEO lazımdır.

### Performans hədəfi
LCP < 2.5 s (4G mobil), Lighthouse ≥ 90. Bakıda trafikin ~85%-i mobil olacaq — **mobil əvvəl dizayn məcburidir**.

---

## 6. SEO və məzmun

**Açar sözlər (AZ):** təsbeh sifariş Bakı · epoksid təsbeh · əl işi hədiyyə · epoksid şahmat · epoksid saat · unikal hədiyyə Bakı · fərdi sifariş hədiyyə · korporativ hədiyyə Azərbaycan

**Texniki:**
- Hər məhsulda `Product` + `Offer` schema.org JSON-LD → Google-da qiymət və şəkil görünsün.
- `LocalBusiness` schema ana səhifədə.
- `sitemap.xml`, `robots.txt`, açıq `og:image` (hər məhsulun öz şəkli).
- URL-lər ASCII: `/mehsul/tsb-014` (diakritiksiz — paylaşımda pozulmasın).
- Instagram bio linki: `specialcrafts.store/?utm_source=instagram`.

**Məzmun aktivləri:** 4–6 qısa bloq/rəhbər yazı — «Təsbeh necə seçilir», «Epoksid işlərə qulluq», «Toy xonçası üçün fikirlər». SEO trafikini gətirən hissə budur.

---

## 7. Şəkil axını (Telegram → sayt)

Qovluq strukturu hazırdır:

```
assets/
├── _INBOX/              ← Telegram-dan yüklədiyiniz şəkilləri BURA atın
├── logo/                ← logo (SVG varsa ideal, yoxdursa ən böyük PNG)
├── products/
│   ├── tesbeh/  domino/  sahmat/  kulqabi/
│   ├── saat/    guzgu-daraq/  sep-xonca/  diger/
├── packaging/           ← hədiyyə paketləməsi
└── brend/
    ├── sergi/           ← sərgi və festival fotoları
    ├── atelye/          ← iş yeri
    └── proses/          ← töküm, cilalama (video da olar)
```

**Prosedur:** siz bütün şəkilləri `_INBOX/`-a atırsınız → mən onları tanıyıb kateqoriyalara bölürəm, `TSB-014-1.jpg` formatında adlandırıram, dublikatları təmizləyirəm, hər məhsul üçün JSON qeydini yaradıram. Sizdən yalnız **qiymətlər və ölçülər** lazım olacaq — onları sadə siyahı halında versəniz kifayətdir.

**Şəkil tələbləri:** məhsul kartları üçün kvadrat 1:1 kadr yaxşıdır; ən azı 1200 px eni; eyni kateqoriyada oxşar fon/işıq olsa kataloq peşəkar görünür.

---

## 8. Mərhələlər

### Faza 1 — MVP kataloq (≈ 1–2 həftə)
Dizayn sistemi · Ana səhifə · **«Stokda hazır» bölməsi** · Kataloq + vəziyyət filtri · Məhsul detalı (3 vəziyyət halı) · Haqqımızda · Qaydalar · Əlaqə · WhatsApp sifariş axını (vəziyyətə görə fərqli mesaj) · SEO · Vercel + domen.
**Nəticə:** Instagram bio-suna qoyula bilən işlək sayt.

### Faza 2 — İdarəetmə və böyümə (≈ 1 həftə)
Sanity CMS (usta özü məhsul əlavə edir və **stok statusunu bir kliklə dəyişir**) · Fərdi sifariş forması · Korporativ səhifə · Rus dili · Bloq · Instagram feed inteqrasiyası.

### Faza 3 — Onlayn ödəniş (tələb olduqda)
**Yalnız stokda olan məhsullar üçün** səbət + Epoint.az ödənişi · Sifariş izləmə · Kupon/endirim · avtomatik stok azaltma.
Sifarişlə hazırlanan məhsullar bu fazada da WhatsApp axınında qalır — qiymət fərdiləşdirmədən asılıdır.

---

## 9. Açıq suallar (cavabınız lazımdır)

1. **Qiymətlər** — 18 məhsulun hamısında boşdur; kataloqun işə düşməsi üçün qalan yeganə kritik boşluq. Kateqoriya üzrə aralıq da kifayətdir.
2. **Təsbeh, külqabı, güzgü-daraq, sep-xonça** — bu kateqoriyaların şəkilləri gəlmədi, halbuki hər birinin Instagram highlight-ı var. Şəkillər gələcəkmi, yoxsa sayt real çeşidə uyğunlaşdırılsın?
3. **WhatsApp nömrəsi** — `wa.me/9940506169987` bir rəqəm artıq görünür. Düzgün nömrə?
4. ~~**Stok həcmi**~~ — *cavablandı: kateqoriya başına 5. Hazırda 15 məhsul stokda; 5-ə çatmaq üçün daha 15 lazımdır — bax [KATALOQ-HESABATI.md](KATALOQ-HESABATI.md).*
5. **Stok yenilənməsi** — məhsul Instagram-dan satılanda saytda statusu kim və nə vaxt dəyişəcək? (Gündə bir dəfə kifayətdir, amma qayda olmalıdır.)
6. **Çatdırılma** — Bakıdaxili qiymət? Rayonlara necə göndərilir (Azərpoçt / avtobus / kuryer)? Stokda olan üçün 1–2 gün realdırmı?
7. **Ödəniş** — hazırda necə alınır (nağd, kart köçürməsi, m10)?
8. **Hüquqi status** — VÖEN/fərdi sahibkar varmı? (Epoint və korporativ faktura üçün lazımdır.)
9. **Logo** — JPG gəldi (şəffaf fon yoxdur), üstəlik yazıda «AZERBAIJAN**N**» səhvi var. SVG və ya şəffaf PNG varmı? Yazı düzəldilsinmi?
10. **TikTok** — izləyici sayı və orada fərqli məzmun varmı?

Bu suallar cavabsız qalsa da Faza 1 başlaya bilər — qiymət sahələri müvəqqəti «Sifarişlə» qalar.
