import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Bağlantı tənbəldir: DATABASE_URL yalnız baza ilk dəfə istifadə olunanda tələb edilir.
 * Bu, `next build` mərhələsində (baza olmadan) səhv verməməsi üçündür.
 */
const g = globalThis as unknown as { __scSql?: ReturnType<typeof postgres>; __scDb?: Db };

function connect(): Db {
  if (g.__scDb) return g.__scDb;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL təyin edilməyib — .env faylını yoxlayın");
  const sql = g.__scSql ?? postgres(url, { max: 10 });
  if (process.env.NODE_ENV !== "production") g.__scSql = sql;
  const instance = drizzle(sql, { schema });
  if (process.env.NODE_ENV !== "production") g.__scDb = instance;
  return instance;
}

export const db = new Proxy({} as Db, {
  get(_t, prop) {
    const real = connect() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
