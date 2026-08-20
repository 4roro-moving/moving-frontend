"use client";

import { useState } from "react";

import Checkbox from "@/components/common/Checkbox/Checkbox";
import { Text, getTextVariantClass } from "@/components/common/Text";
import TermsDetailModal from "@/components/terms/TermsDetailModal";
import { cn } from "@/lib/utils/cn";
import { TERMS_TYPE_LABEL, type PublishedTerms } from "@/types/terms";

interface SignUpTermsFieldProps {
  terms: PublishedTerms[];
  checkedById: Record<string, boolean>;
  onCheckedChange: (termsId: number, checked: boolean) => void;
}

const SignUpTermsField = ({ terms, checkedById, onCheckedChange }: SignUpTermsFieldProps) => {
  const [selectedTerms, setSelectedTerms] = useState<PublishedTerms | null>(null);

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
