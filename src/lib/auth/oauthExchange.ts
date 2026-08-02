import { loginWithOAuth, type LoginResult, type OAuthLoginInput } from "@/lib/api/auth";
import type { OAuthProvider } from "@/lib/auth/oauth";

/**
 * Strict Mode remount / effect 재실행에도 동일 code 교환은 1회만 수행합니다.
 * (code는 1회용 — 두 번 보내면 "만료된 인증 코드"가 됩니다.)
 */
let pendingExchange: { key: string; promise: Promise<LoginResult> } | null = null;
let completedExchange: { key: string; result: LoginResult } | null = null;
const finishedExchangeKeys = new Set<string>();

const getExchangeKey = (provider: OAuthProvider, code: string): string => {
  return `${provider}:${code}`;
};

export const getCompletedOAuthExchange = (
  provider: OAuthProvider,
  code: string,
): LoginResult | null => {
  const key = getExchangeKey(provider, code);
  return completedExchange?.key === key ? completedExchange.result : null;
};

/** 성공 후처리(세션 확립·이동)를 1회만 수행. 이미 처리됨이면 false */
export const markOAuthExchangeFinished = (provider: OAuthProvider, code: string): boolean => {
  const key = getExchangeKey(provider, code);
  if (finishedExchangeKeys.has(key)) return false;
  finishedExchangeKeys.add(key);
  return true;
};

/** 성공 후처리(세션 확립·이동)를 1회만 수행. 이미 처리됨이면 false */
export const isOAuthExchangeFinished = (provider: OAuthProvider, code: string): boolean => {
  return finishedExchangeKeys.has(getExchangeKey(provider, code));
};

/** 교환 요청 진행 중인지 확인 */
export const isOAuthExchangePending = (provider: OAuthProvider, code: string): boolean => {
  return pendingExchange?.key === getExchangeKey(provider, code);
};

export const exchangeOAuthCodeOnce = (
  provider: OAuthProvider,
  input: OAuthLoginInput,
): Promise<LoginResult> => {
  const key = getExchangeKey(provider, input.code);

  if (completedExchange?.key === key) {
    return Promise.resolve(completedExchange.result);
  }

  if (pendingExchange?.key === key) {
    return pendingExchange.promise;
  }

  const promise = loginWithOAuth(provider, input)
    .then((result) => {
      completedExchange = { key, result };
      return result;
    })
    .finally(() => {
      if (pendingExchange?.key === key) {
        pendingExchange = null;
      }
    });

  pendingExchange = { key, promise };
  return promise;
};
