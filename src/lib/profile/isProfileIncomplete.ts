import { isProfileMissingError } from "@/lib/profile/isProfileMissingError";

interface ProfileStatusLike {
  isProfileCompleted: boolean;
}

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
