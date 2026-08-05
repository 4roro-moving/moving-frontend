import { ApiError } from "@/types/api";

const PROFILE_MISSING_MESSAGE = "등록된 프로필";

interface ProfileStatusLike {
  isProfileCompleted: boolean;
}

/** 프로필 me/status 등에서 "프로필 없음"으로 보는 오류인지 (네트워크/500은 false) */
const isProfileMissingError = (error: unknown): boolean => {
  if (!(error instanceof ApiError)) {
    return false;
  }

  if (error.status === 404 || error.code === "NOT_FOUND") {
    return true;
  }

  return error.message.includes(PROFILE_MISSING_MESSAGE);
};

/**
 * status 응답·오류로 프로필 미완료 여부를 판별합니다.
 * - isProfileCompleted === false
 * - 프로필 없음(404 등)
 * 그 외 오류는 false (fail-open)
 */
export const isProfileIncomplete = (params: {
  data?: ProfileStatusLike | null;
  isError: boolean;
  error: unknown;
}): boolean => {
  if (params.data?.isProfileCompleted === false) {
    return true;
  }

  return params.isError && isProfileMissingError(params.error);
};
