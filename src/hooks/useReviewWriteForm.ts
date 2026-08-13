"use client";

import { useState } from "react";

import { useCreateReview } from "@/hooks/useCreateReview";
import { MAX_TEXT_CONTENT_LENGTH, MIN_TEXT_CONTENT_LENGTH } from "@/lib/constants/validation";
import type { ReviewableEstimateItem } from "@/types/review";

interface UseReviewWriteFormOptions {
  open: boolean;
  item: ReviewableEstimateItem;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  preview?: boolean;
}

export function useReviewWriteForm({
  open,
  item,
  onClose,
  onSuccess,
  onError,
  preview = false,
}: UseReviewWriteFormOptions) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isContentTouched, setIsContentTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [hasSubmissionStarted, setHasSubmissionStarted] = useState(false);

  const createMutation = useCreateReview({
    moverId: item.mover.id,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onError: (message) => {
      setSubmitError(message);
      onError?.(message);
    },
  });

  const trimmedContent = content.trim();
  const isSubmitting = createMutation.isPending || (hasSubmissionStarted && !open);

  const isContentValid =
    trimmedContent.length >= MIN_TEXT_CONTENT_LENGTH &&
    trimmedContent.length <= MAX_TEXT_CONTENT_LENGTH;

  const contentValidationError =
    isContentTouched && !isContentValid
      ? `리뷰 내용은 ${MIN_TEXT_CONTENT_LENGTH}자 이상 ${MAX_TEXT_CONTENT_LENGTH}자 이하로 입력해 주세요.`
      : undefined;

  const isSubmitDisabled = isSubmitting || rating < 1 || !isContentValid;

  const resetForm = () => {
    setRating(0);
    setContent("");
    setIsContentTouched(false);
    setSubmitError(undefined);
    setHasSubmissionStarted(false);
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleRatingChange = (nextRating: number) => {
    setRating(nextRating);
    setSubmitError(undefined);
  };

  const handleContentChange = (nextContent: string) => {
    setContent(nextContent);
    setSubmitError(undefined);
  };

  const handleContentBlur = () => {
    setIsContentTouched(true);
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }

    setSubmitError(undefined);

    if (preview) {
      return;
    }

    setHasSubmissionStarted(true);

    createMutation.mutate({
      estimateId: item.estimateId,
      rating,
      content: trimmedContent,
    });
  };

  return {
    rating,
    content,
    contentLength: trimmedContent.length,
    submitError,
    isSubmitting,
    isSubmitDisabled,
    contentValidationError,
    handleClose,
    handleRatingChange,
    handleContentChange,
    handleContentBlur,
    handleSubmit,
  };
}
