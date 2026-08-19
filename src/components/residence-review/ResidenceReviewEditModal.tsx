"use client";

import { useState } from "react";

import SelectableChip from "@/components/common/Chip/SelectableChip";
import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { useResidenceReviewEditForm } from "@/hooks/useResidenceReviewEditForm";
import {
  RESIDENCE_REVIEW_CONTENT_MAX_LENGTH,
  RESIDENCE_REVIEW_CONTENT_MIN_LENGTH,
  RESIDENCE_REVIEW_TITLE_MAX_LENGTH,
} from "@/lib/constants/residenceReview";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewEditModalProps {
  open: boolean;
  review: PublicResidenceReview | null;
  onClose: () => void;
  onSuccess?: () => void;
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
    title,
    content,
    rating,
    titleError,
    contentError,
    submitError,
    contentLength,
    isSubmitting,
    isSubmitDisabled,
    handleClose,
    handleSubmit,
    handleTitleChange,
    handleTitleBlur,
    handleContentChange,
    handleContentBlur,
    handleRatingChange,
  } = useResidenceReviewEditForm({
    review,
    onClose,
    onSuccess,
  });

  return (
    <Modal
      open={open}
      onClose={isSubmitting ? undefined : handleClose}
      onExitComplete={onExitComplete}
      presentation="responsive"
      size="lg"
      className={RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME}
      dismissible={false}
    >
      <div className="flex w-full items-start justify-between gap-12">
        <Modal.Title>후기 수정</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isSubmitting} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-24 overflow-y-auto xl:gap-32">
        <FormField label="지역을 선택해주세요." variant="compact" labelId="residence-review-region">
          <div role="group" aria-labelledby="residence-review-region">
            <SelectableChip selected size="responsive">
              {review.region.name}
            </SelectableChip>
          </div>
        </FormField>

        <div className="flex w-full flex-col gap-12">
          <Text
            as="p"
            variant={{ base: "lg-semibold", xl: "2lg-semibold" }}
            className="text-text-tertiary"
          >
            평점을 선택해 주세요
          </Text>
          <ReviewStarRating
            value={rating}
            onChange={handleRatingChange}
            size="lg"
            label="평점"
            disabled={isSubmitting}
          />
        </div>

        <FormField label="제목을 입력해 주세요" labelFor="residence-review-title" variant="compact">
          <Input
            id="residence-review-title"
            size="md"
            value={title}
            maxLength={RESIDENCE_REVIEW_TITLE_MAX_LENGTH}
            disabled={isSubmitting}
            placeholder="제목을 입력해주세요"
            error={titleError}
            onChange={(event) => handleTitleChange(event.target.value)}
            onBlur={handleTitleBlur}
          />
        </FormField>

        <FormField
          label="상세 후기를 작성해 주세요"
          labelFor="residence-review-content"
          variant="compact"
        >
          <div className="flex w-full flex-col gap-8">
            <Textarea
              id="residence-review-content"
              value={content}
              maxLength={RESIDENCE_REVIEW_CONTENT_MAX_LENGTH}
              disabled={isSubmitting}
              placeholder={`최소 ${String(RESIDENCE_REVIEW_CONTENT_MIN_LENGTH)}자 이상 입력해주세요`}
              error={contentError}
              className="h-160"
              onChange={(event) => handleContentChange(event.target.value)}
              onBlur={handleContentBlur}
            />
            <Text as="span" variant="xs-regular" className="text-text-muted self-end">
              {contentLength}/{RESIDENCE_REVIEW_CONTENT_MAX_LENGTH}
            </Text>
          </div>
        </FormField>
      </div>

      {submitError ? (
        <Text as="p" variant="sm-medium" className="text-text-error w-full" role="alert">
          {submitError}
        </Text>
      ) : null}

      <Modal.Button fullWidth size="cta" disabled={isSubmitDisabled} onClick={handleSubmit}>
        {isSubmitting ? "수정 중..." : "수정하기"}
      </Modal.Button>
    </Modal>
  );
};

const ResidenceReviewEditModal = ({
  open,
  review,
  onClose,
  onSuccess,
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
      onExitComplete={() => setCachedReview(null)}
      onSuccess={onSuccess}
    />
  );
};

export default ResidenceReviewEditModal;
