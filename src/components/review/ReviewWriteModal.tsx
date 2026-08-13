"use client";

import { useState } from "react";

import FormField from "@/components/common/FormField/FormField";
import Textarea from "@/components/common/Input/Textarea";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import ReviewEstimateSummary from "@/components/review/ReviewEstimateSummary";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { useReviewWriteForm } from "@/hooks/useReviewWriteForm";
import { MAX_TEXT_CONTENT_LENGTH, MIN_TEXT_CONTENT_LENGTH } from "@/lib/constants/validation";
import type { ReviewableEstimateItem } from "@/types/review";

interface ReviewWriteModalProps {
  open: boolean;
  item: ReviewableEstimateItem | null;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  preview?: boolean;
}

interface ReviewWriteModalContentProps {
  open: boolean;
  item: ReviewableEstimateItem;
  onClose: () => void;
  onExitComplete?: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  preview?: boolean;
}

function ReviewWriteModalContent({
  open,
  item,
  onClose,
  onExitComplete,
  onSuccess,
  onError,
  preview = false,
}: ReviewWriteModalContentProps) {
  const {
    rating,
    content,
    contentLength,
    submitError,
    isSubmitting,
    isSubmitDisabled,
    contentValidationError,
    handleClose,
    handleRatingChange,
    handleContentChange,
    handleContentBlur,
    handleSubmit,
  } = useReviewWriteForm({
    open,
    item,
    onClose,
    onSuccess,
    onError,
    preview,
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
      <div className="flex w-full items-start justify-between gap-12 md:gap-16">
        <Modal.Title>리뷰 작성</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isSubmitting} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-28 overflow-y-auto xl:gap-32">
        <ReviewEstimateSummary item={item} />

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
            label="별점"
            disabled={isSubmitting}
          />
        </div>

        <FormField
          label="상세 후기를 작성해주세요"
          labelFor="review-content"
          variant="compact"
          className="w-full gap-12"
        >
          <div className="flex w-full flex-col gap-8">
            <Textarea
              id="review-content"
              value={content}
              maxLength={MAX_TEXT_CONTENT_LENGTH}
              disabled={isSubmitting}
              placeholder={`최소 ${MIN_TEXT_CONTENT_LENGTH}자 이상 입력해 주세요`}
              error={contentValidationError}
              className="h-160"
              onChange={(event) => handleContentChange(event.target.value)}
              onBlur={handleContentBlur}
            />

            <Text as="span" variant="xs-regular" className="text-text-muted self-end">
              {contentLength}/{MAX_TEXT_CONTENT_LENGTH}
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
        {isSubmitting ? "리뷰 등록 중..." : "리뷰 등록"}
      </Modal.Button>
    </Modal>
  );
}

export default function ReviewWriteModal({
  open,
  item,
  onClose,
  onSuccess,
  onError,
  preview = false,
}: ReviewWriteModalProps) {
  const [cachedItem, setCachedItem] = useState<ReviewableEstimateItem | null>(item);

  if (item != null && item !== cachedItem) {
    setCachedItem(item);
  }

  if (!cachedItem) {
    return null;
  }

  return (
    <ReviewWriteModalContent
      key={cachedItem.estimateId}
      open={open}
      item={cachedItem}
      onClose={onClose}
      onExitComplete={() => setCachedItem(null)}
      onSuccess={onSuccess}
      onError={onError}
      preview={preview}
    />
  );
}
