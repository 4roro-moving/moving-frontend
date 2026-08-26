"use client";

import { useLocale } from "next-intl";

import { useTranslatedText } from "@/hooks/translation/useTranslatedText";
import type { TranslationLocale } from "@/types/translation";

type AutoTranslatedTextProps = {
  text?: string | null;
  enabled?: boolean;
};

const isTranslationLocale = (locale: string): locale is TranslationLocale =>
  locale === "ko" || locale === "en" || locale === "ja" || locale === "zh-CN";

export default function AutoTranslatedText({ text, enabled = true }: AutoTranslatedTextProps) {
  const locale = useLocale();
  const targetLocale: TranslationLocale = isTranslationLocale(locale) ? locale : "ko";
  const sourceText = text ?? "";

  const { translatedText } = useTranslatedText({
    text: sourceText,
    targetLocale,
    enabled: enabled && targetLocale !== "ko" && Boolean(sourceText.trim()),
  });

  return <>{targetLocale === "ko" ? sourceText : translatedText}</>;
}
