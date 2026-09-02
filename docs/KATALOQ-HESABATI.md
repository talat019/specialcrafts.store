# Kataloq hesabatı — 3 sentyabr 2026

21 şəkil oxundu → **18 məhsul**, **6 kateqoriya**. Kataloq: `content/products.json`.

## Stok vəziyyəti

| Kateqoriya | Kod | Stokda | Sifarişlə | Cəmi | 5-ə çatmaq üçün |
|---|---|---:|---:|---:|---|
| Saat | `SAT` | **5** | 3 | 8 | ✓ tamam |
| Şahmat | `SHM` | **4** | 0 | 4 | 1 məhsul əskik |
| Domino | `DMN` | **2** | 0 | 2 | 3 məhsul əskik |
| Divar pannosu | `PNO` | **2** | 0 | 2 | 3 məhsul əskik |
| Açar asılqanı | `ACR` | **1** | 0 | 1 | 4 məhsul əskik |
| Rəhil | `RHL` | **1** | 0 | 1 | 4 məhsul əskik |
| **Cəmi** | | **15** | **3** | **18** | **15 məhsul əskik** |

Yalnız saatlarda 5 stok tamamlandı — orada 8 fərqli iş var idi, 5-i stokda, 3-ü nümunə kimi «sifarişlə» qeyd olundu (rəng seçimi ilə təkrar hazırlana bilər). Digər kateqoriyalarda mövcud şəkillərin **hamısı** stokda işarələndi, amma 5-ə çatmır.

## Ən vacib tapıntı: kataloq bio ilə uyğun gəlmir

Instagram bio-su deyir: **«Təsbeh, domino, külqabı, saat və daha çox»**. Göndərilən şəkillərdə isə:

| Bio-da vəd edilən | Şəkillərdə |
|---|---|
| **Təsbeh** — bio-nun birinci sözü, ayrıca highlight | ❌ **bir dənə də yoxdur** |
| Külqabı — highlight var | ❌ yoxdur |
| Güzgü & daraq — highlight var | ❌ yoxdur |
| Sep & xonça — highlight var | ❌ yoxdur |
| Domino | ✅ 2 |
| Saat | ✅ 8 (kataloqun 44%-i) |
| Şahmat | ✅ 4 |

Əvəzində **planda olmayan 3 yeni kateqoriya** çıxdı:

- **Divar pannosu / xəttatlıq** (Ayətəl-Kürsi, Kəlmeyi-şəhadət) — highlight-larda yox idi, amma Azərbaycan bazarında ən yüksək çekli hədiyyə seqmentlərindən biridir. Ayrıca kateqoriya olmağa layiqdir.
- **Açar asılqanı** — ucuz giriş məhsulu, ilk alış üçün ideal.
- **Rəhil** (Quran altlığı) — dini hədiyyə seqmenti, panno ilə birlikdə satıla bilər.

**Nəticə:** ya təsbeh/külqabı şəkilləri əlavə olunmalıdır (bio dəyişmədən), ya da sayt strukturu real çeşidə uyğunlaşdırılmalıdır. Hazırda sayt açılsa, ziyarətçi Instagram-da vəd ediləni tapmayacaq.

## İşlənməyən 3 şəkil

`assets/_yoxlanmali/` qovluğuna ayrıldı:

| Fayl | Problem |
|---|---|
| `SU-NISANLI-Moscou-nane-saat.jpg` | Üzərində **başqasının su nişanı** («Moscou» loqosu) və ekran görüntüsü haşiyəsi var. Öz işiniz deyilsə sayta qoyula bilməz; öz işinizdirsə orijinal fayl lazımdır |
| `DUBLIKAT-SHM-001-ile-eyni.jpg` | `SHM-001` ilə eyni fayl (md5 üst-üstə düşür) |
| — | `SHM-003` şəkli **360×360 px** — kataloq üçün çox kiçikdir, yenidən çəkilməlidir |

## Digər qeydlər

- **`SHM-004`** şəklində Galatasaray emblemi var. Klub loqoları ticarət nişanıdır — saytda açıq göstərmək DM-dən fərqli olaraq risk yaradır. Kataloqda **«Klub temalı şahmat — fərdi komanda rəngləri və emblem ilə»** kimi yazdım, şəkli isə dəyişdirmək tövsiyə olunur.
- **`SAT-002`** üçün iki şəkil bir məhsula aid sayıldı (biri yaxın plan) — təsdiq lazımdır.
- **`SAT-004`** zəif işıqda çəkilib, yenidən çəkilməlidir.
- **`RHL-001`** — məhsulun dəqiq adı təsdiqlənməlidir (rəhil kimi qeyd etdim).
- **Qiymətlər** bütün 18 məhsulda boşdur. Bu, kataloqun işə düşməsi üçün qalan yeganə kritik boşluqdur.

## Loqo

`assets/logo/special-crafts-logo.jpg` (1080×1080). Dairəvi möhür: krem fon, qara serif «SPECIAL CRAFTS», «BY SEMEDOVA», iki uzanan əl və ulduzlar.

İki qeyd:
1. Üst yazıda **«HANDCRAFTS AZERBAIJANN»** — sonda iki N var. Yəqin ki, səhvdir; sayta qoymazdan əvvəl düzəldilməlidir.
2. Fayl **JPG**-dir, yəni fonu şəffaf deyil. Sayt üçün **şəffaf fonlu PNG və ya SVG** lazımdır. SVG yoxdursa mən JPG-dən vektor versiya hazırlaya bilərəm.

## Dizayn istiqamətində dəyişiklik

Əvvəlki plan **tünd, dərin firuzəyi «resin qalereyası»** istiqamətini təklif edirdi. Loqonu və məhsulları gördükdən sonra bu istiqamət **düzgün deyil**:

- Loqo **krem fon + qara serif** — zərif, açıq, minimal.
- Məhsulların əksəriyyəti (saatlar, pannolar, açar asılqanı) **ağ-krem mərmər + qızıl damar** rəngindədir. Tünd fonda bu işlər «yanmır», əksinə boz görünür.
- Yalnız şahmat və domino dərin tonlardadır (zümrüd, gecə mavisi).

**Yeni istiqamət:** loqodan gələn **isti krem fon**, qara mürəkkəb, aksent kimi **antik qızıl** və məhsullardan gələn **zümrüd yaşıl** (əsas hərəkət rəngi). Tünd rejim yalnız xəttatlıq pannoları bölməsi və footer üçün saxlanılır — orada qara fon məhsulun özündən gəlir.

Yenilənmiş palitra `DESIGN-PROMPT.md` faylındadır.
