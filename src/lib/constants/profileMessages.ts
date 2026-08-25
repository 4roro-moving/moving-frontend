export const CUSTOMER_PROFILE_EDIT_SUCCESS_MESSAGE = "프로필이 수정되었습니다.";

export const CUSTOMER_PROFILE_EDIT_ERROR_MESSAGE = "프로필 수정에 실패했습니다.";

export const CUSTOMER_PROFILE_EDIT_PARTIAL_SAVE_ERROR_MESSAGE =
  "기본정보는 저장되었지만 프로필 정보 저장에 실패했습니다. 다시 시도해 주세요.";

export const CUSTOMER_PROFILE_NO_CHANGES_MESSAGE = "변경된 정보가 없습니다.";

/** 서버 에러를 폼 필드 에러로 매핑할 때 사용하는 메시지 식별 문자열 */
export const CUSTOMER_PROFILE_PHONE_ERROR_KEYWORD = "전화번호";
export const CUSTOMER_PROFILE_CURRENT_PASSWORD_ERROR_KEYWORD = "현재 비밀번호";

/** 기사 프로필 서버 에러 필드 매핑용 식별 문자열 */
export const MOVER_PROFILE_PHONE_ERROR_KEYWORD = "전화번호";
export const MOVER_PROFILE_NICKNAME_ERROR_KEYWORDS = ["닉네임", "별명"] as const;
