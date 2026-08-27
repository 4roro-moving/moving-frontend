export const SUPPORTED_LOCALES = ["ko", "en", "zh-CN", "ja"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";

export const LOCALE_COOKIE_NAME = "moving-locale";

export const isSupportedLocale = (value: unknown): value is Locale => {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value as Locale);
};

export const resolveLocale = (value: unknown): Locale => {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
};
