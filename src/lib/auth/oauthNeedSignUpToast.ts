/** OAuth callback → 가입 페이지 one-shot Toast */
export const OAUTH_NEED_SIGN_UP_TOAST_KEY = "moving:oauth-need-signup-toast";

export type OAuthCallbackToastReason = "need-signup" | "terms-required";

const isOAuthCallbackToastReason = (value: string): value is OAuthCallbackToastReason => {
  return value === "need-signup" || value === "terms-required";
};

export const markOAuthCallbackToast = (reason: OAuthCallbackToastReason): void => {
  try {
    sessionStorage.setItem(OAUTH_NEED_SIGN_UP_TOAST_KEY, reason);
  } catch {
    // sessionStorage 불가 환경에서는 Toast 없이 이동
  }
};

export const markOAuthNeedSignUpToast = (): void => {
  markOAuthCallbackToast("need-signup");
};

export const markOAuthTermsRequiredToast = (): void => {
  markOAuthCallbackToast("terms-required");
};

export const consumeOAuthNeedSignUpToast = (): OAuthCallbackToastReason | null => {
  try {
    const reason = sessionStorage.getItem(OAUTH_NEED_SIGN_UP_TOAST_KEY);
    if (!reason) {
      return null;
    }

    sessionStorage.removeItem(OAUTH_NEED_SIGN_UP_TOAST_KEY);

    if (isOAuthCallbackToastReason(reason)) {
      return reason;
    }

    // 이전 플래그("1") 호환
    if (reason === "1") {
      return "need-signup";
    }
  } catch {
    // ignore
  }

  return null;
};
