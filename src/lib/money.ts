/** Valyuta göstərilməsi — həm serverdə, həm brauzerdə (baza importu yoxdur). */

export const CURRENCY = "USD";
export const SYMBOL = "$";

/** 350 → "$350" · 12.5 → "$12.50" */
export function money(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "";
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "";
  const body = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return `${SYMBOL}${body}`;
}
