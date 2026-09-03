import type { Locale } from "./config";
import type { Dictionary } from "./en";
import en from "./en";
import ru from "./ru";
import az from "./az";

const dictionaries: Record<Locale, Dictionary> = { en, ru, az };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

/** "{n} iş" + {n: 5} → "5 iş" */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key) =>
    key in values ? String(values[key]) : m,
  );
}

export type { Dictionary };
export * from "./config";
