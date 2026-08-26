"use client";

import { useMemo } from "react";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { translateTexts } from "@/lib/api/translation";
import type { TranslationLocale } from "@/types/translation";

const TRANSLATION_STALE_TIME = 1000 * 60 * 60;
const TRANSLATION_GC_TIME = 1000 * 60 * 60 * 6;

type UseTranslationQueryOptions = {
  texts: string[];
  targetLocale: TranslationLocale;
  enabled?: boolean;
};

export const useTranslationQuery = ({
  texts,
  targetLocale,
  enabled = true,
}: UseTranslationQueryOptions) => {
  const normalizedTexts = useMemo(() => texts.map((text) => text.trim()), [texts]);
  const hasText = normalizedTexts.some(Boolean);

  return useApiQuery({
    queryKey: ["translation", targetLocale, normalizedTexts],
    queryFn: () => translateTexts(normalizedTexts, targetLocale),
    enabled: enabled && hasText,
    staleTime: TRANSLATION_STALE_TIME,
    gcTime: TRANSLATION_GC_TIME,
  });
};
