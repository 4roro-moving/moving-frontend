/** 로그인 SNS에서 비회원 거절 → 회원가입 페이지 one-shot Toast */
export const OAUTH_NEED_SIGN_UP_TOAST_KEY = "moving:oauth-need-signup-toast";

export const OAUTH_NEED_SIGN_UP_TOAST_MESSAGE =
  "가입된 소셜 계정이 없습니다. 약관 동의 후 회원가입을 진행해 주세요.";

export const markOAuthNeedSignUpToast = (): void => {
  try {
    sessionStorage.setItem(OAUTH_NEED_SIGN_UP_TOAST_KEY, "1");
  } catch {
    // sessionStorage 불가 환경에서는 Toast 없이 이동
  }
};

export const consumeOAuthNeedSignUpToast = (): string | null => {
  try {
    const flag = sessionStorage.getItem(OAUTH_NEED_SIGN_UP_TOAST_KEY);
    if (flag === "1") {
      sessionStorage.removeItem(OAUTH_NEED_SIGN_UP_TOAST_KEY);
      return OAUTH_NEED_SIGN_UP_TOAST_MESSAGE;
    }
  } catch {
    // ignore
  }

  return null;
};
