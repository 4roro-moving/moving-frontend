import { getNaverOAuthState } from "@/lib/api/auth";
import {
  audienceToOAuthRole,
  buildOAuthAuthorizeUrl,
  saveOAuthClientState,
  saveOAuthPendingSession,
  type OAuthProvider,
} from "@/lib/auth/oauth";
import { getLoginRedirectParam, type AuthAudience } from "@/lib/auth/redirect";

/**
 * SNS 로그인 시작 — pending 저장 후 Provider 인가 화면으로 이동합니다.
 */
export const startOAuthLogin = async (
  provider: OAuthProvider,
  audience: AuthAudience,
): Promise<void> => {
  const role = audienceToOAuthRole(audience);

  saveOAuthPendingSession({
    provider,
    role,
    returnPath: getLoginRedirectParam(),
  });

  let state: string = "";

  if (provider === "naver") {
    const data = await getNaverOAuthState();
    state = data.state;
  } else {
    state = crypto.randomUUID();
    saveOAuthClientState(state);
  }

  window.location.assign(buildOAuthAuthorizeUrl(provider, { state }));
};
