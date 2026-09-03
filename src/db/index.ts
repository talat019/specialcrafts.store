import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Bağlantı tənbəldir: DATABASE_URL yalnız baza ilk dəfə istifadə olunanda tələb edilir
 * (`next build` mərhələsində baza olmaya bilər).
 *
 * DİQQƏT: nəticə HƏMİŞƏ keşlənməlidir. Əks halda hər sorğuda yeni hovuz açılır və
 * Postgres «sorry, too many clients already» ilə imtina edir.
 */
const g = globalThis as unknown as { __scSql?: ReturnType<typeof postgres>; __scDb?: Db };

function connect(): Db {
  if (g.__scDb) return g.__scDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL təyin edilməyib — .env faylını yoxlayın");
  g.__scSql ??= postgres(url, { max: 10, idle_timeout: 20, connect_timeout: 10 });
  g.__scDb = drizzle(g.__scSql, { schema });
  return g.__scDb;
}

export const db = new Proxy({} as Db, {
  get(_t, prop) {
    const real = connect() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
