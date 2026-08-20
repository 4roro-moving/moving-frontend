"use client";

import Button from "@/components/common/Button/Button";
import { RESIDENCE_REVIEW_WRITE_BUTTON_LABEL } from "@/lib/constants/residenceReview";

interface ResidenceReviewCreateButtonProps {
  onClick: () => void;
}

const ResidenceReviewCreateButton = ({ onClick }: ResidenceReviewCreateButtonProps) => {
  return (
    <div className="flex w-full justify-end">
      <Button type="button" size="cta" className="w-full xl:w-auto" onClick={onClick}>
        {RESIDENCE_REVIEW_WRITE_BUTTON_LABEL}
      </Button>
    </div>
  );
};

export default ResidenceReviewCreateButton;
