import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales, pickLocale } from "@/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

/**
 * Dil marşrutlaşdırması. Lokal olmayan ünvanlar brauzerin dilinə görə
 * uyğun prefiksə yönləndirilir; tapılmazsa ingiliscəyə.
 * /admin, /api, sitemap və statik fayllar toxunulmadan keçir.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  // istifadəçinin əvvəlki seçimi çərəzdə saxlanılır
  const saved = req.cookies.get("sc_locale")?.value;
  const locale =
    saved && isLocale(saved) ? saved : pickLocale(req.headers.get("accept-language"));

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

// tip yoxlaması üçün (istifadə olunmasa da siyahı sənədləşdirilib)
void locales;
void defaultLocale;
