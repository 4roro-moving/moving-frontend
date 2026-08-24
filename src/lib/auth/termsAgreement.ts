import type { AuthAudience } from "@/lib/auth/redirect";
import type { PublishedTerms, TermsAgreementInput, TermsAudience } from "@/types/terms";

const toTermsIdKey = (termsId: number): string => String(termsId);

const isTermsAgreed = (checkedById: Record<string, boolean>, termsId: number): boolean =>
  checkedById[toTermsIdKey(termsId)] === true;

const toTermsAudienceRole = (audience: AuthAudience): Exclude<TermsAudience, "ALL"> => {
  return audience === "mover" ? "MOVER" : "CUSTOMER";
};

export const filterSignUpTerms = (
  terms: PublishedTerms[],
  audience: AuthAudience,
): PublishedTerms[] => {
  if (!Array.isArray(terms)) {
    return [];
  }

  const role = toTermsAudienceRole(audience);

  return terms.filter((item) => item.audience === "ALL" || item.audience === role);
};

export const toTermsAgreements = (
  terms: PublishedTerms[],
  checkedById: Record<string, boolean>,
): TermsAgreementInput[] =>
  terms
    .filter((item) => Number.isInteger(Number(item.id)) && Number(item.id) > 0)
    .map((item) => ({
      termsId: Number(item.id),
      isAgreed: isTermsAgreed(checkedById, Number(item.id)),
    }));

/** 가입에 필요한 필수 약관이 하나 이상 있는지 확인합니다. 빈 목록은 동의 완료로 보지 않습니다. */
export const hasRequiredSignUpTerms = (terms: PublishedTerms[]): boolean =>
  Array.isArray(terms) && terms.some((item) => item.isRequired === true);

/** 필수(`isRequired === true`) 약관만 모두 동의했는지 확인합니다. 선택은 가입을 막지 않습니다. */
export const hasRequiredTermsAgreed = (
  terms: PublishedTerms[],
  checkedById: Record<string, boolean>,
): boolean =>
  hasRequiredSignUpTerms(terms) &&
  terms
    .filter((item) => item.isRequired === true)
    .every((item) => isTermsAgreed(checkedById, Number(item.id)));
