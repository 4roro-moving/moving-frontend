export const SUPPORTED_TRANSLATION_LOCALES = ["ko", "en", "ja", "zh-CN"] as const;

export type TranslationLocale = (typeof SUPPORTED_TRANSLATION_LOCALES)[number];

export type TranslateRequest = {
  texts: string[];
  targetLocale: TranslationLocale;
};

export type TranslateResponse = {
  translations: string[];
  targetLocale: TranslationLocale;
};
