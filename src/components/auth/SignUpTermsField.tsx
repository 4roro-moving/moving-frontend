"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import Checkbox from "@/components/common/Checkbox/Checkbox";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text, getTextVariantClass } from "@/components/common/Text";
import TermsDetailModal from "@/components/terms/TermsDetailModal";
import { cn } from "@/lib/utils/cn";
import type { PublishedTerms, TermsType } from "@/types/terms";

interface SignUpTermsFieldProps {
  terms: PublishedTerms[];
  checkedById: Record<string, boolean>;
  onCheckedChange: (termsId: number, checked: boolean) => void;
  isLoading?: boolean;
}

const SIGN_UP_TERMS_SKELETON_ROW_COUNT = 4;

const TERMS_TYPE_KEY = {
  TERMS_OF_SERVICE: "termsType.termsOfService",
  PRIVACY_POLICY: "termsType.privacyPolicy",
  MARKETING_POLICY: "termsType.marketingPolicy",
  LOCATION_POLICY: "termsType.locationPolicy",
  MOVER_POLICY: "termsType.moverPolicy",
  OTHER: "termsType.other",
} as const satisfies Record<TermsType, string>;

const SignUpTermsFieldSkeleton = () => {
  const t = useTranslations("auth");

  return (
    <fieldset
      className="flex w-full flex-col gap-12"
      aria-busy="true"
      aria-label={t("termsLoadingAria")}
    >
      <Text as="legend" variant="md-medium" className="text-text-primary mb-2">
        {t("termsAgreement")}
      </Text>
      {Array.from({ length: SIGN_UP_TERMS_SKELETON_ROW_COUNT }, (_, index) => (
        <div key={index} className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Skeleton className="size-36 shrink-0" />
            <Skeleton className="h-20 w-160 md:w-200" />
          </div>
          <Skeleton className="h-18 w-32" />
        </div>
      ))}
    </fieldset>
  );
};

const SignUpTermsField = ({
  terms,
  checkedById,
  onCheckedChange,
  isLoading = false,
}: SignUpTermsFieldProps) => {
  const t = useTranslations("auth");
  const [selectedTerms, setSelectedTerms] = useState<PublishedTerms | null>(null);

  if (isLoading) {
    return <SignUpTermsFieldSkeleton />;
  }

  if (terms.length === 0) {
    return null;
  }

  return (
    <>
      <fieldset className="flex w-full flex-col gap-12">
        <Text as="legend" variant="md-medium" className="text-text-primary mb-6">
          {t("termsAgreement")}
        </Text>
        {terms.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-8">
            <Checkbox
              id={`terms-${String(item.id)}`}
              checked={checkedById[String(item.id)] === true}
              onCheckedChange={(checked) => onCheckedChange(item.id, checked)}
              label={
                <span className="flex items-center gap-4">
                  <Text
                    as="span"
                    variant="lg-semibold"
                    className={item.isRequired ? "text-text-brand" : "text-text-muted"}
                  >
                    {item.isRequired ? t("required") : t("optional")}
                  </Text>
                  <Text as="span" variant="lg-medium" className="text-text-secondary">
                    {t(TERMS_TYPE_KEY[item.type])}
                  </Text>
                </span>
              }
            />
            <button
              type="button"
              className={cn(getTextVariantClass("link-xs"), "text-text-brand shrink-0")}
              onClick={() => setSelectedTerms(item)}
              aria-label={t("viewTermsAria", { title: item.title })}
            >
              {t("view")}
            </button>
          </div>
        ))}
      </fieldset>
      <TermsDetailModal
        open={selectedTerms !== null}
        terms={selectedTerms}
        onClose={() => setSelectedTerms(null)}
      />
    </>
  );
};

export default SignUpTermsField;
