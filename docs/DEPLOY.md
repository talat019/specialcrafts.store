# Yayımlama

Sayt **SolOcean VPS-ində** (`solocean-prod`, 2.24.194.242) canlıdır:

**https://specialcrafts.store**

Serverdəki digər layihələrlə eyni konvensiya: `/opt/projects/<layihə>` + xarici `proxy`
şəbəkəsi + paylaşılan Caddy.

| | |
|---|---|
| Qovluq | `/opt/projects/specialcrafts` |
| Konteynerlər | `specialcrafts-web` (Next.js) · `specialcrafts-postgres` |
| Şəbəkələr | `proxy` (xarici, Caddy görür) · `specialcrafts_internal` |
| Caddy bloku | `/opt/projects/proxy/Caddyfile` |
| Mühit | `/opt/projects/specialcrafts/.env` (`chmod 600`, repoda yoxdur) |

Postgres-in **host portu yoxdur** — yalnız daxili şəbəkədə, internetdən əlçatmazdır.
Admin paneldən yüklənən şəkillər `uploads_data` volume-undadır, image yeniləndikdə itmir.

## Yeniləmə

```bash
ssh solocean-prod
cd /opt/projects/specialcrafts
git pull
docker compose build web
docker compose up -d web
```

Baza sxemi dəyişibsə:

```bash
docker compose --profile cli run --rm tools npm run db:push
```

## Birdəfəlik əmrlər

```bash
# kataloqu content/products.json-dan yenidən yükləmək
docker compose --profile cli run --rm tools npm run db:seed

# admin şifrəsini dəyişmək
docker compose --profile cli run --rm tools npm run admin:create -- admin@specialcrafts.store "yeni şifrə"
```

## Diaqnostika

```bash
docker compose logs -f web                    # loglar
docker compose ps                             # konteyner vəziyyəti
docker compose exec postgres psql -U sc -d specialcrafts   # baza
docker exec caddy caddy validate --config /etc/caddy/Caddyfile
```

## ⚠ DNS — düzəldilməli

`specialcrafts.store` üçün **iki A qeydi** var:

| IP | Nədir | Vəziyyət |
|---|---|---|
| `2.24.194.242` | SolOcean VPS | ✅ işləyir |
| `192.64.119.57` | Namecheap parking | ❌ cavab vermir |

DNS növbə ilə hər iki ünvanı verir, yəni **ziyarətçilərin təxminən yarısı saytı aça
bilmir**. Namecheap → Advanced DNS-də `192.64.119.57` sətri **silinməlidir**. Bu, sizin
registrar hesabınızdadır, mən girə bilmirəm.

Yalnız bir A qeydi qalmalıdır:

| Tip | Host | Dəyər |
|---|---|---|
| A | `@` | `2.24.194.242` |
| CNAME | `www` | `specialcrafts.store.` |

## Ödəniş

Hazırda `PAYMENT_MODE=test` — ödəniş simulyasiya olunur, kartdan pul çıxmır.
Payriff hesabı təsdiqlənəndə `/opt/projects/specialcrafts/.env` faylında
`PAYMENT_MODE=canli` yazılır və `docker compose up -d web` icra olunur.

Payriff kabinetində callback URL:
`https://specialcrafts.store/api/odenis/callback/payriff`
