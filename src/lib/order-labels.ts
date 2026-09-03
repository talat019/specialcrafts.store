/** Saf sabitlər — həm serverdə, həm brauzerdə işlədilir (baza importu YOXDUR). */

/** Azərbaycan daxilində çatdırılma üsulu. Xaricə göndərişdə həmişə "beynelxalq". */
export type DeliveryMethod = "baki" | "rayon" | "goturme" | "beynelxalq";

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
  shipTier: "small" | "medium" | "large";
};
