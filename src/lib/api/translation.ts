import fetchInstance from "@/lib/api/fetchInstance";
import type { TranslateRequest, TranslateResponse, TranslationLocale } from "@/types/translation";

const TRANSLATIONS_API = "/translations";
/** backend Google Translation timeout(10s)보다 여유를 둬 실패 응답을 받을 수 있게 한다. */
const TRANSLATION_TIMEOUT_MS = 15_000;

export const translateTexts = (
  texts: string[],
  targetLocale: TranslationLocale,
): Promise<TranslateResponse> =>
  fetchInstance.post<TranslateResponse, TranslateRequest>(
    TRANSLATIONS_API,
    { texts, targetLocale },
    { skipAuth: true, skipRefresh: true, timeoutMs: TRANSLATION_TIMEOUT_MS },
  );
