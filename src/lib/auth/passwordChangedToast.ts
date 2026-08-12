/** 비밀번호 변경 성공 → 로그인 페이지 one-shot Toast */
export const PASSWORD_CHANGED_TOAST_KEY = "moving:password-changed-toast";

export const PASSWORD_CHANGED_TOAST_MESSAGE = "비밀번호가 변경되었습니다. 다시 로그인해 주세요.";

export const markPasswordChangedToast = (): void => {
  try {
    sessionStorage.setItem(PASSWORD_CHANGED_TOAST_KEY, "1");
  } catch {
    // sessionStorage 불가 환경에서는 Toast 없이 이동
  }
};

export const consumePasswordChangedToast = (): string | null => {
  try {
    if (sessionStorage.getItem(PASSWORD_CHANGED_TOAST_KEY) === "1") {
      sessionStorage.removeItem(PASSWORD_CHANGED_TOAST_KEY);
      return PASSWORD_CHANGED_TOAST_MESSAGE;
    }
  } catch {
    // ignore
  }

  return null;
};
