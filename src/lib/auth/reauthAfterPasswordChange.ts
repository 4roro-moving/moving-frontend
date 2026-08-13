import {
  markPasswordChangedToast,
  type MarkPasswordChangedToastOptions,
} from "@/lib/auth/passwordChangedToast";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * 비밀번호 변경 후 refresh가 폐기된 상태이므로
 * Toast 플래그를 남기고 로컬 세션을 정리한 뒤 로그인 페이지로 이동합니다.
 */
export const reauthAfterPasswordChange = async (
  loginPath: string,
  options?: MarkPasswordChangedToastOptions,
): Promise<void> => {
  markPasswordChangedToast(options);

  try {
    await useAuthStore.getState().logout({ deferUiClear: true });
  } catch {
    // refresh 폐기 후 logout API 실패해도 로컬 세션은 정리됨
  }

  window.location.assign(loginPath);
};
