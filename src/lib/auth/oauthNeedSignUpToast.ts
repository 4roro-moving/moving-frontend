/** OAuth callback → 가입 페이지 one-shot Toast */
export const OAUTH_NEED_SIGN_UP_TOAST_KEY = "moving:oauth-need-signup-toast";

export type OAuthCallbackToastReason = "need-signup" | "terms-required";

export const OAUTH_NEED_SIGN_UP_TOAST_MESSAGE =
  "가입된 소셜 계정이 없습니다. 약관 동의 후 회원가입을 진행해 주세요.";

export const OAUTH_TERMS_REQUIRED_TOAST_MESSAGE =
  "약관 동의에 실패했습니다. 필수 약관에 동의한 뒤 다시 가입해 주세요.";

const OAUTH_CALLBACK_TOAST_MESSAGE: Record<OAuthCallbackToastReason, string> = {
  "need-signup": OAUTH_NEED_SIGN_UP_TOAST_MESSAGE,
  "terms-required": OAUTH_TERMS_REQUIRED_TOAST_MESSAGE,
};

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

export const consumeOAuthNeedSignUpToast = (): string | null => {
  try {
    const reason = sessionStorage.getItem(OAUTH_NEED_SIGN_UP_TOAST_KEY);
    if (!reason) {
      return null;
    }

    sessionStorage.removeItem(OAUTH_NEED_SIGN_UP_TOAST_KEY);

    if (isOAuthCallbackToastReason(reason)) {
      return OAUTH_CALLBACK_TOAST_MESSAGE[reason];
    }

    // 이전 플래그("1") 호환
    if (reason === "1") {
      return OAUTH_NEED_SIGN_UP_TOAST_MESSAGE;
    }
  } catch {
    // ignore
  }

  return null;
};
