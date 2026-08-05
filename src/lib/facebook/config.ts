/** Facebook Graph API 버전 — https://developers.facebook.com/docs/graph-api/changelog/versions/ */
export const FACEBOOK_SDK_VERSION = "v26.0";

export const FACEBOOK_SHARE_FALLBACK_ERROR = "페이스북 공유에 실패했습니다.";
export const FACEBOOK_APP_ID_MISSING_MESSAGE = "페이스북 앱 설정이 필요합니다.";
export const FACEBOOK_SDK_LOAD_ERROR = "Facebook SDK 로드에 실패했습니다.";
export const FACEBOOK_SDK_TIMEOUT_ERROR = "Facebook SDK 로드 시간이 초과되었습니다.";
export const FACEBOOK_SDK_INIT_ERROR = "Facebook SDK를 초기화할 수 없습니다.";

export function getFacebookAppId(): string | null {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
  return appId || null;
}

export function hasFacebookAppId(): boolean {
  return Boolean(getFacebookAppId());
}

/** FB.ui 응답의 error_message를 사용자용 문구로 정규화 */
export function getFacebookShareErrorMessage(response?: FacebookShareResponse): string {
  const raw = response?.error_message?.trim();
  if (!raw) {
    return FACEBOOK_SHARE_FALLBACK_ERROR;
  }

  try {
    return decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    return raw;
  }
}
