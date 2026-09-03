import { Manrope } from "next/font/google";
import "../globals.css";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

/** Admin paneli yalnız azərbaycancadır — istifadəçisi ustanın özüdür. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" className={manrope.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
