"use client";

import { useState } from "react";

import SelectableChip from "@/components/common/Chip/SelectableChip";
import FormField from "@/components/common/FormField/FormField";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import ResidenceReviewFormFields from "@/components/residence-review/ResidenceReviewFormFields";
import { useResidenceReviewEditForm } from "@/hooks/residence-review/useResidenceReviewEditForm";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewEditModalProps {
  open: boolean;
  review: PublicResidenceReview | null;
  onClose: () => void;
  onSuccess?: () => void;
  onExitComplete?: () => void;
}

interface ResidenceReviewEditModalContentProps {
  open: boolean;
  review: PublicResidenceReview;
  onClose: () => void;
  onExitComplete?: () => void;
  onSuccess?: () => void;
}

const ResidenceReviewEditModalContent = ({
  open,
  review,
  onClose,
  onExitComplete,
  onSuccess,
}: ResidenceReviewEditModalContentProps) => {
  const {
    register,
    control,
    titleError,
    contentError,
    submitError,
    isPending,
    isSubmitDisabled,
    handleClose,
    handleSubmit,
  } = useResidenceReviewEditForm({
    review,
    onClose,
    onSuccess,
  });

  return (
    <Modal
      open={open}
      onClose={isPending ? undefined : handleClose}
      onExitComplete={onExitComplete}
      presentation="responsive"
      size="lg"
      className={RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME}
      dismissible={false}
    >
      <div className="flex w-full items-start justify-between gap-12">
        <Modal.Title>후기 수정</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isPending} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-24 overflow-y-auto xl:gap-32">
        <FormField label="후기 지역" variant="compact" labelId="residence-review-region">
          <div role="group" aria-labelledby="residence-review-region">
            <SelectableChip selected size="responsive">
              {review.region.name}
            </SelectableChip>
          </div>
        </FormField>

        <ResidenceReviewFormFields
          register={register}
          control={control}
          titleError={titleError}
          contentError={contentError}
          isPending={isPending}
        />
      </div>

      {submitError ? (
        <Text as="p" variant="sm-medium" className="text-text-error w-full" role="alert">
          {submitError}
        </Text>
      ) : null}

      <Modal.Button fullWidth size="cta" disabled={isSubmitDisabled} onClick={handleSubmit}>
        {isPending ? "수정 중..." : "수정하기"}
      </Modal.Button>
    </Modal>
  );
};

const ResidenceReviewEditModal = ({
  open,
  review,
  onClose,
  onSuccess,
  onExitComplete,
}: ResidenceReviewEditModalProps) => {
  const [cachedReview, setCachedReview] = useState<PublicResidenceReview | null>(review);

  if (review != null && review !== cachedReview) {
    setCachedReview(review);
  }

  if (!cachedReview) {
    return null;
  }

  return (
    <ResidenceReviewEditModalContent
      key={cachedReview.id}
      open={open}
      review={cachedReview}
      onClose={onClose}
      onExitComplete={() => {
        setCachedReview(null);
        onExitComplete?.();
      }}
      onSuccess={onSuccess}
    />
  );
};

export default ResidenceReviewEditModal;
