import type { Locale } from "./types";

export const SUPPORTED_LOCALES: Locale[] = ["en-us", "es-mx", "pt-br"];
export const PREFERRED_LOCALE_KEY = "preferred-locale";
export const DEFAULT_LOCALE: Locale = "en-us";

const BASE_LANGUAGE_MAP: Record<string, Locale> = {
  en: "en-us",
  es: "es-mx",
  pt: "pt-br",
};

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes((value ?? "").toLowerCase() as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale | null {
  const raw = (value ?? "").trim().toLowerCase().replace(/_/g, "-");
  if (!raw) return null;
  if (isSupportedLocale(raw)) return raw;

  const [base] = raw.split("-");
  return BASE_LANGUAGE_MAP[base] ?? null;
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  return normalizeLocale(window.localStorage.getItem(PREFERRED_LOCALE_KEY));
}

export function writeStoredLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFERRED_LOCALE_KEY, locale);
}

export function resolvePreferredLocale(): Locale {
  const stored = readStoredLocale();
  if (stored) return stored;

  if (typeof navigator === "undefined") return DEFAULT_LOCALE;

  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);
  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate);
    if (locale) return locale;
  }

  return DEFAULT_LOCALE;
}
