import { getAccessToken } from "@/lib/auth/token";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getDevAccessToken, isDevAuthEnabled } from "@/lib/dev-auth";

const AUTH_SESSION_CHANGE_EVENT = "moving:auth-session-change";

/**
 * fetchInstance Authorization 주입과 동일한 기준으로 로그인 세션 존재 여부를 판단합니다.
 * // 2026.07.25 정슬기 - [추가] 찜 등 인증 필요 UI용 세션 판별
 */
export function hasAuthSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (isDevAuthEnabled()) {
    return Boolean(getDevAccessToken());
  }

  return Boolean(getAccessToken());
}

/**
 * 로그인/로그아웃 후 Header 등 구독자에게 세션 변경을 알립니다.
 * // 2026.07.27 정슬기 - [추가] useSyncExternalStore 구독용 이벤트
 */
export function notifyAuthSessionChange(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT));
}

/**
 * 세션 변경(storage/focus/커스텀 이벤트)을 구독합니다.
 * // 2026.07.27 정슬기 - [추가]
 */
export function subscribeAuthSession(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => onStoreChange();

  window.addEventListener(AUTH_SESSION_CHANGE_EVENT, handleChange);
  window.addEventListener("storage", handleChange);
  window.addEventListener("focus", handleChange);

  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("focus", handleChange);
  };
}

/**
 * 로그인 페이지 경로
 * - development: axios 401 처리와 동일하게 APP_ROUTES.DEV_LOGIN
 * - production: Header 로그인 링크와 동일하게 APP_ROUTES.LOGIN
 * // 2026.07.25 정슬기 - [추가]
 */
export function getLoginRedirectPath(): string {
  return isDevAuthEnabled() ? APP_ROUTES.DEV_LOGIN : APP_ROUTES.LOGIN;
}
