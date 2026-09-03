import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Səbət", robots: { index: false } };

export default function SebetPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-12 lg:px-14 lg:py-16">
      <h1 className="text-[34px] lg:text-[44px]">Səbət</h1>
      <CartView />
    </div>
  );
}
