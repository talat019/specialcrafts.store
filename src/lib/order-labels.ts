/** Saf sabitlər — həm serverdə, həm brauzerdə işlədilir (baza importu YOXDUR). */

export type DeliveryMethod = "baki" | "rayon" | "goturme";

export const deliveryOptions: { key: DeliveryMethod; label: string; fee: number; note: string }[] = [
  { key: "baki", label: "Bakıdaxili kuryer", fee: 5, note: "1–2 iş günü" },
  { key: "rayon", label: "Rayonlara göndəriş", fee: 8, note: "2–4 iş günü, Azərpoçt" },
  { key: "goturme", label: "Özüm götürəcəyəm", fee: 0, note: "Ünvan WhatsApp-da razılaşdırılır" },
];

export function deliveryFee(m: DeliveryMethod): number {
  return deliveryOptions.find((d) => d.key === m)?.fee ?? 0;
}

export const orderStatusLabels: Record<string, string> = {
  yeni: "Yeni",
  hazirlanir: "Hazırlanır",
  gonderilib: "Göndərilib",
  tamamlandi: "Tamamlandı",
  legv: "Ləğv edilib",
};

export const paymentStatusLabels: Record<string, string> = {
  gozlenilir: "Ödəniş gözlənilir",
  odenilib: "Ödənilib",
  ugursuz: "Uğursuz",
  legv: "Ləğv edilib",
  qaytarilib: "Qaytarılıb",
};

export type ResolvedLine = {
  productId: string;
  kod: string;
  ad: string;
  qiymet: number;
  qty: number;
  cem: number;
  sekil: string | null;
};
