"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { localeShort, locales, type Locale } from "@/i18n/config";

/** Dil seçicisi — seçim çərəzdə saxlanılır ki, növbəti dəfə yadda qalsın. */
export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, start] = useTransition();

  function go(next: Locale) {
    if (next === current) return;
    document.cookie = `sc_locale=${next}; path=/; max-age=31536000; samesite=lax`;
    const rest = pathname.replace(new RegExp(`^/${current}`), "") || "";
    start(() => router.push(`/${next}${rest}`));
  }

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-line bg-surface p-0.5 ${pending ? "opacity-60" : ""}`}
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => go(l)}
          aria-current={l === current ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors ${
            l === current ? "bg-ink text-surface" : "text-ink-muted hover:text-ink"
          }`}
        >
          {localeShort[l]}
        </button>
      ))}
    </div>
  );
}
