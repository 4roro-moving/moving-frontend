"use client";

import { useState } from "react";

import Checkbox from "@/components/common/Checkbox/Checkbox";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text, getTextVariantClass } from "@/components/common/Text";
import TermsDetailModal from "@/components/terms/TermsDetailModal";
import { cn } from "@/lib/utils/cn";
import { TERMS_TYPE_LABEL, type PublishedTerms } from "@/types/terms";

interface SignUpTermsFieldProps {
  terms: PublishedTerms[];
  checkedById: Record<string, boolean>;
  onCheckedChange: (termsId: number, checked: boolean) => void;
  isLoading?: boolean;
}

const SIGN_UP_TERMS_SKELETON_ROW_COUNT = 4;

const SignUpTermsFieldSkeleton = () => (
  <fieldset
    className="flex w-full flex-col gap-12"
    aria-busy="true"
    aria-label="약관 목록 불러오는 중"
  >
    <Text as="legend" variant="md-medium" className="text-text-primary">
      약관 동의
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

const SignUpTermsField = ({
  terms,
  checkedById,
  onCheckedChange,
  isLoading = false,
}: SignUpTermsFieldProps) => {
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
        <Text as="legend" variant="md-medium" className="text-text-primary">
          약관 동의
        </Text>
        {terms.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-8">
            <Checkbox
              id={`terms-${String(item.id)}`}
              checked={checkedById[String(item.id)] === true}
              onCheckedChange={(checked) => onCheckedChange(item.id, checked)}
              label={`${item.isRequired ? "[필수]" : "[선택]"} ${TERMS_TYPE_LABEL[item.type]}`}
              labelClassName="text-text-secondary"
            />
            <button
              type="button"
              className={cn(getTextVariantClass("link-xs"), "text-text-brand shrink-0")}
              onClick={() => setSelectedTerms(item)}
              aria-label={`${item.title} 확인하기`}
            >
              보기
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
