/**
 * İlk admin istifadəçisini yaradır.
 *   npm run admin:create -- admin@specialcrafts.store "Şifrə123!" "Ad Soyad"
 * Şifrə verilməzsə təsadüfi güclü şifrə yaradılır və ekrana yazılır.
 */
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { adminUsers } from "./schema";
import { hashPassword } from "../lib/auth";

const [email, passwordArg, nameArg] = process.argv.slice(2);

if (!email) {
  console.error("İstifadə: npm run admin:create -- <email> [şifrə] [ad]");
  process.exit(1);
}

const password = passwordArg || randomBytes(9).toString("base64url");
const name = nameArg || email.split("@")[0];

async function main() {
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  const passwordHash = await hashPassword(password);

  if (existing.length) {
    await db.update(adminUsers).set({ passwordHash, name }).where(eq(adminUsers.email, email));
    console.log(`✓ Mövcud admin yeniləndi: ${email}`);
  } else {
    await db.insert(adminUsers).values({ email, passwordHash, name });
    console.log(`✓ Admin yaradıldı: ${email}`);
  }

  if (!passwordArg) console.log(`  Şifrə: ${password}   ← saxlayın, bir daha göstərilməyəcək`);
  console.log("  Giriş: /admin/giris");
  process.exit(0);
}

main();
