const SUSPENSION_APPEAL_SESSION_KEY = "moving_suspension_appeal_session";

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

export const hasSuspensionAppealSession = (): boolean =>
  typeof window !== "undefined" && sessionStorage.getItem(SUSPENSION_APPEAL_SESSION_KEY) === "true";
