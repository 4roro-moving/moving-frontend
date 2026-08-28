"use client";

import { useTranslations } from "next-intl";

import Button from "@/components/common/Button/Button";

interface ResidenceReviewCreateButtonProps {
  onClick: () => void;
}

const ResidenceReviewCreateButton = ({ onClick }: ResidenceReviewCreateButtonProps) => {
  const t = useTranslations("residenceReview");
  return (
    <div className="flex w-full justify-end">
      <Button type="button" size="cta" className="w-full xl:w-auto" onClick={onClick}>
        {t("write")}
      </Button>
    </div>
  );
};

export default ResidenceReviewCreateButton;
