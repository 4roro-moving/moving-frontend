import { getNaverOAuthState } from "@/lib/api/auth";
import {
  buildOAuthAuthorizeUrl,
  clearOAuthPendingSession,
  saveOAuthClientState,
  saveOAuthPendingSession,
  type OAuthIntent,
  type OAuthProvider,
} from "@/lib/auth/oauth";
import { audienceToLoginRole, getLoginRedirectParam, type AuthAudience } from "@/lib/auth/redirect";
import type { TermsAgreementInput } from "@/types/terms";

interface StartOAuthLoginOptions {
  intent: OAuthIntent;
  agreements?: TermsAgreementInput[];
}

/**
 * SNS 로그인 시작 — pending 저장 후 Provider 인가 화면으로 이동합니다.
 */
export const startOAuthLogin = async (
  provider: OAuthProvider,
  audience: AuthAudience,
  options: StartOAuthLoginOptions,
): Promise<void> => {
  const role = audienceToLoginRole(audience);

  saveOAuthPendingSession({
    provider,
    role,
    intent: options.intent,
    returnPath: getLoginRedirectParam(),
    ...(options.agreements ? { agreements: options.agreements } : {}),
  });

  try {
    let state: string = "";

    if (provider === "naver") {
      const data = await getNaverOAuthState();
      state = data.state;
    } else {
      state = crypto.randomUUID();
    }

    saveOAuthClientState(state);

    window.location.assign(buildOAuthAuthorizeUrl(provider, { state }));
  } catch (err) {
    clearOAuthPendingSession();
    throw err;
  }
};
