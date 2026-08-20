"use client";

import { useState } from "react";

import { usePublishedTerms } from "@/hooks/terms/usePublishedTerms";
import type { AuthAudience } from "@/lib/auth/redirect";
import {
  filterSignUpTerms,
  hasRequiredTermsAgreed,
  toTermsAgreements,
} from "@/lib/auth/termsAgreement";

export const useSignUpTerms = (audience: AuthAudience) => {
  const [agreementsById, setAgreementsById] = useState<Record<string, boolean>>({});
  const {
    data: publishedTerms,
    isPending: isTermsLoading,
    isError: isTermsError,
  } = usePublishedTerms();

  const signUpTerms = filterSignUpTerms(publishedTerms ?? [], audience);
  const canAgree =
    !isTermsLoading && !isTermsError && hasRequiredTermsAgreed(signUpTerms, agreementsById);

  const handleTermsCheckedChange = (termsId: number, checked: boolean) => {
    setAgreementsById((previous) => ({ ...previous, [String(termsId)]: checked }));
  };

  return {
    signUpTerms,
    agreementsById,
    agreements: toTermsAgreements(signUpTerms, agreementsById),
    canAgree,
    isTermsLoading,
    isTermsError,
    handleTermsCheckedChange,
  };
};
