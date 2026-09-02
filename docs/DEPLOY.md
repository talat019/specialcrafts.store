# Yayımlama — Vercel + domen

## 1. Repo

```bash
cd ~/Desktop/specialcrafts.store
git init && git add . && git commit -m "Faza 1 — kataloq saytı"
```

`.gitignore` artıq `node_modules/`, `.next/`, `assets/inbox/` və 3,5 MB-lıq dizayn faylını kənarda saxlayır.

GitHub-da boş repo yaradıb:

```bash
git remote add origin git@github.com:<istifadəçi>/specialcrafts.store.git
git push -u origin main
```

## 2. Vercel

1. [vercel.com/new](https://vercel.com/new) → repo seçilir.
2. Framework avtomatik **Next.js** tanınır, ayar dəyişmək lazım deyil.
3. Deploy.

Pulsuz **Hobby** planı bu ölçüdə sayt üçün kifayətdir.

## 3. Domen

Namecheap-dəki `specialcrafts.store` domenini Vercel-ə bağlamaq üçün:

- Vercel → Project → **Settings → Domains** → `specialcrafts.store` əlavə et.
- Namecheap → **Advanced DNS**:
  - `A` qeydi: `@` → Vercel-in verdiyi IP
  - `CNAME`: `www` → `cname.vercel-dns.com`
- SSL avtomatik verilir (bir neçə dəqiqə çəkir).

## 4. Yayımdan sonra

- `src/lib/site.ts` içində `url` dəyişməyib olduğuna əmin ol (`https://specialcrafts.store`).
- Google Search Console-a `sitemap.xml` göndər.
- Instagram bio-suna linki qoy: `specialcrafts.store/?utm_source=instagram`
- Instagram story-lərində birbaşa link: `specialcrafts.store/kataloq?stok=var`
