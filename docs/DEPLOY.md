# Yayımlama

## Hazırkı vəziyyət

Sayt **GitHub Pages**-də yayımdadır:

**https://talat019.github.io/specialcrafts.store/**

Repo: [talat019/specialcrafts.store](https://github.com/talat019/specialcrafts.store) (açıq)

## Necə yenilənir

`main` budağına hər push avtomatik yeni yayım işə salır — `.github/workflows/deploy.yml`.

```bash
# məsələn qiymətləri əlavə etdikdən sonra
git add content/products.json
git commit -m "Qiymətlər əlavə edildi"
git push
```

2–3 dəqiqə sonra sayt yenilənir. Gedişatı burada izləmək olar:
`gh run list` və ya GitHub-da **Actions** tabı.

## `specialcrafts.store` domenini bağlamaq

Domen Namecheap-dədir. İki addım:

### 1. Namecheap → Advanced DNS

| Tip | Host | Dəyər |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `talat019.github.io.` |

### 2. Repo tərəfi

`.github/workflows/deploy.yml` faylında iki sətir dəyişir — alt qovluq yolu artıq lazım deyil:

```yaml
    env:
      NEXT_PUBLIC_BASE_PATH: ""
      NEXT_PUBLIC_SITE_URL: https://specialcrafts.store
```

Və `CNAME` faylı əlavə olunur ki, GitHub domeni tanısın:

```bash
echo "specialcrafts.store" > public/CNAME
git add -A && git commit -m "Öz domenə keçid" && git push
gh api -X PUT repos/talat019/specialcrafts.store/pages -f cname=specialcrafts.store
```

DNS-in yayılması bir neçə saat çəkə bilər. Sonra GitHub avtomatik SSL sertifikatı verir.

## Alternativ: Vercel

Vercel daha yaxşı şəkil optimizasiyası verir (`next/image` server tərəfdə işləyir — hazırda statik ixracda söndürülüb). Keçmək üçün:

1. [vercel.com](https://vercel.com) hesabı açın, GitHub ilə giriş edin.
2. `talat019/specialcrafts.store` repo-sunu import edin.
3. `next.config.ts` içindən `output: "export"` və `images.unoptimized` sətirlərini silin.
4. Domeni Vercel → Settings → Domains bölməsindən bağlayın.

Bu addım sizin Vercel hesabınızı tələb edir, ona görə mən edə bilmədim.
