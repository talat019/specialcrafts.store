import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt) as (
  password: string, salt: string, keylen: number,
) => Promise<Buffer>;

const KEYLEN = 64;

/** scrypt — əlavə paket olmadan, Node-un öz kriptosu ilə. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, KEYLEN);
  return `scrypt$${salt}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hex] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hex) return false;
  const key = await scrypt(password, salt, KEYLEN);
  const expected = Buffer.from(hex, "hex");
  if (expected.length !== key.length) return false;
  return timingSafeEqual(key, expected);
}

export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export const SESSION_COOKIE = "sc_admin";
export const SESSION_DAYS = 14;
