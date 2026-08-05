import { ApiError } from "@/types/api";

const PROFILE_MISSING_MESSAGE = "등록된 프로필";

/**
 * 프로필 me/status 등에서 "프로필 없음"으로 보는 오류인지 판별합니다.
 * 일반 네트워크/500은 false — fail-open 유지.
 */
export const isProfileMissingError = (error: unknown): boolean => {
  if (!(error instanceof ApiError)) {
    return false;
  }

  if (error.status === 404 || error.code === "NOT_FOUND") {
    return true;
  }

  return error.message.includes(PROFILE_MISSING_MESSAGE);
};
