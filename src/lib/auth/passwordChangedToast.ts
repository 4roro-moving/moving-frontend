/** 비밀번호 변경 성공 → 로그인 페이지 one-shot Toast */
export const PASSWORD_CHANGED_TOAST_KEY = "moving:password-changed-toast";

export const PASSWORD_CHANGED_TOAST_MESSAGE = "비밀번호가 변경되었습니다. 다시 로그인해 주세요.";

export const PASSWORD_CHANGED_PROFILE_FAILED_TOAST_MESSAGE =
  "비밀번호는 변경되었습니다. 프로필 일부 저장에 실패해 다시 로그인한 뒤 확인해 주세요.";

/** sessionStorage 직렬화용 플래그 */
const PASSWORD_CHANGED_TOAST_FLAG = {
  DEFAULT: "1",
  PROFILE_FAILED: "profile-failed",
} as const;

type PasswordChangedToastFlag =
  (typeof PASSWORD_CHANGED_TOAST_FLAG)[keyof typeof PASSWORD_CHANGED_TOAST_FLAG];

export interface MarkPasswordChangedToastOptions {
  profileFailed?: boolean;
}

export const markPasswordChangedToast = (options?: MarkPasswordChangedToastOptions): void => {
  try {
    const flag: PasswordChangedToastFlag = options?.profileFailed
      ? PASSWORD_CHANGED_TOAST_FLAG.PROFILE_FAILED
      : PASSWORD_CHANGED_TOAST_FLAG.DEFAULT;
    sessionStorage.setItem(PASSWORD_CHANGED_TOAST_KEY, flag);
  } catch {
    // sessionStorage 불가 환경에서는 Toast 없이 이동
  }
};

export const consumePasswordChangedToast = (): string | null => {
  try {
    const flag = sessionStorage.getItem(PASSWORD_CHANGED_TOAST_KEY);
    if (
      flag === PASSWORD_CHANGED_TOAST_FLAG.DEFAULT ||
      flag === PASSWORD_CHANGED_TOAST_FLAG.PROFILE_FAILED
    ) {
      sessionStorage.removeItem(PASSWORD_CHANGED_TOAST_KEY);
      return flag === PASSWORD_CHANGED_TOAST_FLAG.PROFILE_FAILED
        ? PASSWORD_CHANGED_PROFILE_FAILED_TOAST_MESSAGE
        : PASSWORD_CHANGED_TOAST_MESSAGE;
    }
  } catch {
    // ignore
  }

  return null;
};
