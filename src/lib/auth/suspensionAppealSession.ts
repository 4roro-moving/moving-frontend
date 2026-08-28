const SUSPENSION_APPEAL_SESSION_KEY = "moving_suspension_appeal_session";
export const SUSPENSION_APPEAL_SESSION_INVALIDATED_EVENT = "suspension-appeal-session:invalidated";

/** HttpOnly Cookie의 존재를 직접 읽을 수 없으므로, 화면 전환용 표시만 현재 탭에 저장한다. */
export const markSuspensionAppealSession = (): void => {
  sessionStorage.setItem(SUSPENSION_APPEAL_SESSION_KEY, "true");
};

export const clearSuspensionAppealSession = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(SUSPENSION_APPEAL_SESSION_KEY);
};

/** 제한 세션 인증 실패 시 제한 세션 표시를 제거하고 제한 세션 무효화 이벤트를 발생시킨다. */
export const invalidateSuspensionAppealSession = (): void => {
  clearSuspensionAppealSession();
  window.dispatchEvent(new Event(SUSPENSION_APPEAL_SESSION_INVALIDATED_EVENT));
};

export const hasSuspensionAppealSession = (): boolean =>
  typeof window !== "undefined" && sessionStorage.getItem(SUSPENSION_APPEAL_SESSION_KEY) === "true";
