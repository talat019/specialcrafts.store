# Şəkil qovluğu — necə istifadə olunur

## Siz nə edirsiniz

Telegram-dakı bütün məhsul şəkillərini **`_INBOX/`** qovluğuna atın. Ad, sıra, format fərqi yoxdur — qarışıq da ola bilər.

Loqonu **`logo/`** qovluğuna qoyun (SVG varsa ideal, yoxdursa ən böyük ölçülü PNG).

## Mən nə edirəm

1. `_INBOX/`-dakı şəkilləri tanıyıb kateqoriyalara bölürəm.
2. `TSB-014-1.jpg` formatında adlandırıram (kod + şəkil nömrəsi).
3. Dublikat və keyfiyyətsiz kadrları ayırıram.
4. WebP-ə çevirib ölçüləndirirəm.
5. Hər məhsul üçün JSON qeydi yaradıram.

## Stokda olanları işarələyin

Kataloqda **iki cür məhsul** olacaq: stokda hazır olanlar (dərhal göndərilir) və sifarişlə hazırlananlar. Şəkilləri atarkən bunu bildirmək üçün ən sadə yol:

- Stokda olan məhsulun şəkil faylının adının əvvəlinə **`STOK-`** yazın — məsələn `STOK-IMG_4821.jpg`.
- Və ya `_INBOX/` içində **`_INBOX/stokda/`** adlı alt qovluq açıb hazır məhsulların şəkillərini oraya atın.

Hansı üsul rahatdırsa. Heç bir işarə olmasa hamısını «sifarişlə» kimi qeyd edəcəyəm və sonra düzəldərik.

Eyni məhsuldan **birdən çox ədəd** varsa, ədədi də yazın (`STOK-2x-IMG_4821.jpg`).

## Kateqoriya kodları

| Qovluq | Kod | Kateqoriya |
|---|---|---|
| `products/tesbeh/` | `TSB` | Təsbeh |
| `products/domino/` | `DMN` | Domino |
| `products/sahmat/` | `SHM` | Şahmat |
| `products/kulqabi/` | `KLQ` | Külqabı |
| `products/saat/` | `SAT` | Saat |
| `products/guzgu-daraq/` | `GZD` | Güzgü & daraq dəsti |
| `products/sep-xonca/` | `SPX` | Sep & xonça |
| `products/diger/` | `DGR` | Digər işlər |
| `packaging/` | — | Hədiyyə paketləməsi |
| `brend/sergi/` | — | Sərgi və festival fotoları |
| `brend/atelye/` | — | Atelye |
| `brend/proses/` | — | Töküm, cilalama (video da olar) |

## Şəkil tövsiyələri

- Ən azı **1200 px** eni.
- Məhsul kartları üçün **kvadrat (1:1)** kadr ən yaxşısıdır.
- Hər məhsulun ən azı bir şəklində **miqyas** görünsün (əldə, masada).
- Eyni kateqoriyada oxşar fon və işıq → kataloq peşəkar görünür.
