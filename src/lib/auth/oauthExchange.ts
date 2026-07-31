import { loginWithOAuth, type LoginResult, type OAuthLoginInput } from "@/lib/api/auth";
import type { OAuthProvider } from "@/lib/auth/oauth";

/**
 * Strict Mode remount / effect 재실행에도 동일 code 교환은 1회만 수행합니다.
 * (code는 1회용 — 두 번 보내면 "만료된 인증 코드"가 됩니다.)
 */
let inFlight: { key: string; promise: Promise<LoginResult> } | null = null;

export const exchangeOAuthCodeOnce = (
  provider: OAuthProvider,
  input: OAuthLoginInput,
): Promise<LoginResult> => {
  const key = `${provider}:${input.code}`;

  if (inFlight?.key === key) {
    return inFlight.promise;
  }

  const promise = loginWithOAuth(provider, input).finally(() => {
    if (inFlight?.key === key) {
      inFlight = null;
    }
  });

  inFlight = { key, promise };
  return promise;
};
