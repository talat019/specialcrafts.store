import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { adminSessions, adminUsers } from "@/db/schema";
import { SESSION_COOKIE, SESSION_DAYS, newSessionToken, verifyPassword } from "./auth";

export type AdminUser = { id: string; email: string; name: string };

export async function getAdmin(): Promise<AdminUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [row] = await db
    .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminUsers.id, adminSessions.userId))
    .where(and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, new Date())));
  return row ?? null;
}

export async function signIn(email: string, password: string): Promise<boolean> {
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase().trim()));
  if (!user) {
    // vaxt fərqi ilə e-poçtun mövcudluğunu bildirməmək üçün boş yoxlama
    await verifyPassword(password, "scrypt$00$00");
    return false;
  }
  if (!(await verifyPassword(password, user.passwordHash))) return false;

  const token = newSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000);
  await db.insert(adminSessions).values({ token, userId: user.id, expiresAt });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return true;
}

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(adminSessions).where(eq(adminSessions.token, token));
  jar.delete(SESSION_COOKIE);
}
