/** 약관 유형. 백엔드 Prisma `TermsType` enum과 동일합니다. */
export type TermsType =
  | "TERMS_OF_SERVICE"
  | "PRIVACY_POLICY"
  | "MARKETING_POLICY"
  | "LOCATION_POLICY"
  | "MOVER_POLICY"
  | "OTHER";

/** 회원가입·OAuth 가입 시 전달하는 약관 동의 항목 */
export interface TermsAgreementInput {
  termsId: number;
  isAgreed: boolean;
}

export type TermsAudience = "ALL" | "CUSTOMER" | "MOVER";

/** `GET /terms` 응답 항목. 게시(PUBLISHED)된 약관만 내려옵니다. */
export interface PublishedTerms {
  id: number;
  type: TermsType;
  version: string;
  title: string;
  content: string;
  isRequired: boolean;
  audience: TermsAudience;
  effectiveAt: string | null;
  publishedAt: string | null;
}

export const TERMS_TYPE_LABEL: Record<TermsType, string> = {
  TERMS_OF_SERVICE: "이용약관",
  PRIVACY_POLICY: "개인정보 처리방침",
  MARKETING_POLICY: "마케팅 정보 수신",
  LOCATION_POLICY: "위치정보 이용약관",
  MOVER_POLICY: "기사님 이용 정책",
  OTHER: "기타",
};

/** 탭 노출 순서. 게시된 유형만 이 순서로 걸러 보여줍니다. */
export const TERMS_TYPE_ORDER: readonly TermsType[] = [
  "TERMS_OF_SERVICE",
  "PRIVACY_POLICY",
  "MARKETING_POLICY",
  "LOCATION_POLICY",
  "MOVER_POLICY",
  "OTHER",
] as const;
