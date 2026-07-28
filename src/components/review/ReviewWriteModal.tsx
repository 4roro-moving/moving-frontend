"use client";

import Image from "next/image";
import { useState } from "react";

import Button from "@/components/common/Button/Button";
import Textarea from "@/components/common/Input/Textarea";
import Modal from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { useCreateReview } from "@/hooks/useCreateReview";
import { ProfileDefaultIcon } from "@/icons";
import type { ReviewableEstimateItem } from "@/types/review";

const MIN_CONTENT_LENGTH = 10;

interface ReviewWriteModalProps {
  open: boolean;
  item: ReviewableEstimateItem | null;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

interface ReviewWriteModalContentProps {
  item: ReviewableEstimateItem;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

function ReviewWriteModalContent({
  item,
  onClose,
  onSuccess,
  onError,
}: ReviewWriteModalContentProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState<string | undefined>();
  const [ratingError, setRatingError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const createMutation = useCreateReview({
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

  const displayName = item.mover.nickname?.trim() || "기사님";
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
    createMutation.mutate({
      estimateId: item.estimateId,
      rating,
      content: trimmedContent,
    });
  };

  return (
    <Modal
      onClose={handleClose}
      overlayClassName="items-end px-0 md:items-center md:px-margin-tablet lg:px-24"
      className="rounded-t-24 md:rounded-24 max-h-[90dvh] w-full max-w-[35rem] gap-24 overflow-y-auto p-20 pb-32 md:gap-32 md:p-32 lg:gap-40 lg:p-40"
      aria-label="리뷰 작성"
    >
      <div className="flex w-full items-start justify-between gap-12 md:gap-16">
        <Modal.Title>리뷰 작성</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isPending} />
      </div>

      <div className="flex w-full flex-col gap-20 md:gap-28 lg:gap-32">
        <div className="border-border-muted flex w-full items-center gap-10 border-b pb-16 md:gap-16 md:pb-20">
          <div className="bg-background-avatar rounded-12 relative size-50 shrink-0 overflow-hidden">
            {item.mover.imageUrl ? (
              <Image
                src={item.mover.imageUrl}
                alt={`${displayName} 기사님 프로필`}
                fill
                sizes="50px"
                className="object-cover"
              />
            ) : (
              <ProfileDefaultIcon className="size-full" />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <Text
              as="p"
              variant={{ base: "md-semibold", md: "lg-semibold" }}
              className="text-text-primary break-words"
            >
              {displayName} 기사님
            </Text>
            <Text
              as="p"
              variant={{ base: "sm-medium", md: "md-medium" }}
              className="text-text-muted break-words"
            >
              {item.estimateRequest.fromAddress}
              <span aria-hidden="true"> → </span>
              {item.estimateRequest.toAddress}
            </Text>
          </div>
        </div>

        <div className="flex w-full flex-col gap-10 md:gap-12">
          <Text
            as="p"
            variant={{ base: "md-semibold", md: "lg-semibold" }}
            className="text-text-primary"
          >
            별점을 선택해주세요
          </Text>
          <ReviewStarRating
            value={rating}
            onChange={(next) => {
              setRating(next);
              setRatingError(undefined);
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

        <div className="flex w-full flex-col gap-10 md:gap-12">
          <label htmlFor="review-content">
            <Text
              as="span"
              variant={{ base: "md-semibold", md: "lg-semibold" }}
              className="text-text-primary"
            >
              상세 후기를 작성해주세요
            </Text>
          </label>
          <Textarea
            id="review-content"
            value={content}
            disabled={isPending}
            placeholder={`최소 ${MIN_CONTENT_LENGTH}자 이상 작성해주세요.`}
            error={contentError}
            className="h-[140px] md:h-[180px]"
            onChange={(event) => {
              setContent(event.target.value);
              if (event.target.value.trim().length >= MIN_CONTENT_LENGTH) {
                setContentError(undefined);
              }
            }}
          />
        </div>
      </div>

      {submitError ? (
        <Text as="p" variant="sm-medium" className="text-text-error w-full" role="alert">
          {submitError}
        </Text>
      ) : null}

      <div className="flex w-full flex-col-reverse gap-10 md:flex-row md:gap-12">
        <Button
          type="button"
          variant="outline"
          size="cta"
          fullWidth
          disabled={isPending}
          onClick={handleClose}
          className="md:flex-1"
        >
          취소
        </Button>
        <Button
          type="button"
          variant="solid"
          size="cta"
          fullWidth
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          className="md:flex-1"
        >
          {isPending ? "등록 중..." : "등록하기"}
        </Button>
      </div>
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
}: ReviewWriteModalProps) {
  if (!open || !item) return null;

  return (
    <ReviewWriteModalContent
      key={item.estimateId}
      item={item}
      onClose={onClose}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}
