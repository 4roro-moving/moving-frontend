import type { AuthAudience } from "@/lib/auth/redirect";
import type { PublishedTerms, TermsAgreementInput } from "@/types/terms";

const toTermsIdKey = (termsId: number): string => String(termsId);

const isTermsAgreed = (checkedById: Record<string, boolean>, termsId: number): boolean =>
  checkedById[toTermsIdKey(termsId)] === true;

export const filterSignUpTerms = (
  terms: PublishedTerms[],
  audience: AuthAudience,
): PublishedTerms[] => {
  if (!Array.isArray(terms)) {
    return [];
  }

  return terms.filter((item) => {
    if (item.audience === "MOVER" || item.type === "MOVER_POLICY") {
      return audience === "mover";
    }

    if (item.audience === "CUSTOMER") {
      return audience === "customer";
    }

    return true;
  });
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

/** 필수(`isRequired === true`) 약관만 모두 동의했는지 확인합니다. 선택은 가입을 막지 않습니다. */
export const hasRequiredTermsAgreed = (
  terms: PublishedTerms[],
  checkedById: Record<string, boolean>,
): boolean =>
  terms
    .filter((item) => item.isRequired === true)
    .every((item) => isTermsAgreed(checkedById, Number(item.id)));
