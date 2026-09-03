import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL təyin edilməyib — .env.local faylını yoxlayın");

// Next-in hot reload-unda bağlantının təkrar açılmasının qarşısını alır
const g = globalThis as unknown as { __scSql?: ReturnType<typeof postgres> };
const sql = g.__scSql ?? postgres(url, { max: 10 });
if (process.env.NODE_ENV !== "production") g.__scSql = sql;

export const db = drizzle(sql, { schema });
export { schema };
