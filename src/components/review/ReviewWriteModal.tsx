"use client";

import { useState } from "react";

import FormField from "@/components/common/FormField/FormField";
import Textarea from "@/components/common/Input/Textarea";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import ReviewEstimateSummary from "@/components/review/ReviewEstimateSummary";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { useCreateReview } from "@/hooks/useCreateReview";
import type { ReviewableEstimateItem } from "@/types/review";

const MIN_CONTENT_LENGTH = 10;

interface ReviewWriteModalProps {
  open: boolean;
  item: ReviewableEstimateItem | null;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  /** 개발용 미리보기에서 실제 리뷰 생성 요청을 차단합니다. */
  preview?: boolean;
}

interface ReviewWriteModalContentProps {
  item: ReviewableEstimateItem;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  preview?: boolean;
}

function ReviewWriteModalContent({
  item,
  onClose,
  onSuccess,
  onError,
  preview = false,
}: ReviewWriteModalContentProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState<string | undefined>();
  const [ratingError, setRatingError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const createMutation = useCreateReview({
    moverId: item.mover.id,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onError: (message) => {
      // Modal과 Toast가 동일 z-index라 실패 시 Toast가 가려질 수 있어 모달 내 인라인 표시
      setSubmitError(message);
      onError?.(message);
    },
  });

  const trimmedContent = content.trim();
  const isPending = createMutation.isPending;
  const isSubmitDisabled = isPending || rating < 1 || trimmedContent.length < MIN_CONTENT_LENGTH;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSubmit = () => {
    let hasError = false;

    if (rating < 1) {
      setRatingError("별점을 선택해주세요.");
      hasError = true;
    } else {
      setRatingError(undefined);
    }

    if (trimmedContent.length < MIN_CONTENT_LENGTH) {
      setContentError(`리뷰 내용은 ${MIN_CONTENT_LENGTH}자 이상 입력해주세요.`);
      hasError = true;
    } else {
      setContentError(undefined);
    }

    if (hasError) return;

    setSubmitError(undefined);
    if (preview) return;

    createMutation.mutate({
      estimateId: item.estimateId,
      rating,
      content: trimmedContent,
    });
  };

  return (
    <Modal
      onClose={handleClose}
      presentation="responsive"
      size="lg"
      className={RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME}
      aria-label="리뷰 작성"
    >
      <div className="flex w-full items-start justify-between gap-12 md:gap-16">
        <Modal.Title>리뷰 작성</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isPending} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-28 overflow-y-auto lg:gap-32">
        <ReviewEstimateSummary item={item} />

        <div className="flex w-full flex-col gap-12">
          <Text
            as="p"
            variant={{ base: "lg-semibold", lg: "2lg-semibold" }}
            className="text-text-tertiary"
          >
            평점을 선택해 주세요
          </Text>
          <ReviewStarRating
            value={rating}
            onChange={(next) => {
              setRating(next);
              setRatingError(undefined);
              setSubmitError(undefined);
            }}
            size="lg"
            label="별점"
            disabled={isPending}
          />
          {ratingError ? (
            <Text as="p" variant="xs-regular" className="text-text-error" role="alert">
              {ratingError}
            </Text>
          ) : null}
        </div>

        <FormField
          label="상세 후기를 작성해주세요"
          labelFor="review-content"
          variant="compact"
          className="w-full gap-12"
        >
          <Textarea
            id="review-content"
            value={content}
            disabled={isPending}
            placeholder={`최소 ${MIN_CONTENT_LENGTH}자 이상 입력해 주세요`}
            error={contentError}
            className="h-[160px]"
            onChange={(event) => {
              setContent(event.target.value);
              setSubmitError(undefined);
              if (event.target.value.trim().length >= MIN_CONTENT_LENGTH) {
                setContentError(undefined);
              }
            }}
          />
        </FormField>
      </div>

      {submitError ? (
        <Text as="p" variant="sm-medium" className="text-text-error w-full" role="alert">
          {submitError}
        </Text>
      ) : null}

      <Modal.Button fullWidth size="cta" disabled={isSubmitDisabled} onClick={handleSubmit}>
        {isPending ? "리뷰 등록 중..." : "리뷰 등록"}
      </Modal.Button>
    </Modal>
  );
}

// 2026.07.27 정슬기 - [추가] 리뷰 작성 모달 (별점·내용·POST /reviews)
// 2026.07.27 정슬기 - [수정] Mobile bottom-sheet형 / Tablet·Desktop 중앙 모달
export default function ReviewWriteModal({
  open,
  item,
  onClose,
  onSuccess,
  onError,
  preview = false,
}: ReviewWriteModalProps) {
  if (!open || !item) return null;

  return (
    <ReviewWriteModalContent
      key={item.estimateId}
      item={item}
      onClose={onClose}
      onSuccess={onSuccess}
      onError={onError}
      preview={preview}
    />
  );
}
