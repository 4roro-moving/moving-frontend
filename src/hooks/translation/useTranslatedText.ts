"use client";

import { useMemo } from "react";

import { useTranslationQuery } from "@/hooks/translation/useTranslationQuery";
import type { TranslationLocale } from "@/types/translation";

type UseTranslatedTextOptions = {
  text?: string | null;
  targetLocale: TranslationLocale;
  enabled?: boolean;
};

export const useTranslatedText = ({
  text,
  targetLocale,
  enabled = true,
}: UseTranslatedTextOptions) => {
  const sourceText = text?.trim() ?? "";
  const texts = useMemo(() => (sourceText ? [sourceText] : []), [sourceText]);

  const query = useTranslationQuery({
    texts,
    targetLocale,
    enabled: enabled && Boolean(sourceText),
  });

  return {
    ...query,
    translatedText: query.data?.translations[0] ?? sourceText,
    sourceText,
  };
};
