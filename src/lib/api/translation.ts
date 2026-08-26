import fetchInstance from "@/lib/api/fetchInstance";
import type { TranslateRequest, TranslateResponse, TranslationLocale } from "@/types/translation";

const TRANSLATIONS_API = "/translations";

export const translateTexts = (
  texts: string[],
  targetLocale: TranslationLocale,
): Promise<TranslateResponse> =>
  fetchInstance.post<TranslateResponse, TranslateRequest>(
    TRANSLATIONS_API,
    { texts, targetLocale },
    { skipAuth: true, skipRefresh: true },
  );
