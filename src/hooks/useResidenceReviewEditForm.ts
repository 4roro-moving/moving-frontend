"use client";

import { useState } from "react";

import { useUpdateResidenceReview } from "@/hooks/useUpdateResidenceReview";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  getResidenceReviewContentError,
  getResidenceReviewTitleError,
} from "@/lib/utils/residenceReviewValidation";
import { RESIDENCE_REVIEW_RATING } from "@/types/residenceReview";
import type { PublicResidenceReview, UpdateResidenceReviewInput } from "@/types/residenceReview";

interface UseResidenceReviewEditFormParams {
  review: PublicResidenceReview;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useResidenceReviewEditForm = ({
  review,
  onClose,
  onSuccess,
  onError,
}: UseResidenceReviewEditFormParams) => {
  const [title, setTitle] = useState(review.title);
  const [content, setContent] = useState(review.content);
  const [rating, setRating] = useState(review.rating);
  const [isTitleTouched, setIsTitleTouched] = useState(false);
  const [isContentTouched, setIsContentTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const updateMutation = useUpdateResidenceReview();

  const resetForm = () => {
    setTitle(review.title);
    setContent(review.content);
    setRating(review.rating);
    setIsTitleTouched(false);
    setIsContentTouched(false);
    setSubmitError(undefined);
  };

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const titleError = isTitleTouched ? getResidenceReviewTitleError(title) : undefined;
  const contentError = isContentTouched ? getResidenceReviewContentError(content) : undefined;
  const isRatingValid =
    rating >= RESIDENCE_REVIEW_RATING.MIN && rating <= RESIDENCE_REVIEW_RATING.MAX;
  const isValid =
    !getResidenceReviewTitleError(title) &&
    !getResidenceReviewContentError(content) &&
    isRatingValid;
  const hasChanges =
    trimmedTitle !== review.title.trim() ||
    trimmedContent !== review.content.trim() ||
    rating !== review.rating;
  const isSubmitting = updateMutation.isPending;
  const isSubmitDisabled = isSubmitting || !isValid || !hasChanges;

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }

    const body: UpdateResidenceReviewInput = {};
    if (trimmedTitle !== review.title.trim()) {
      body.title = trimmedTitle;
    }
    if (trimmedContent !== review.content.trim()) {
      body.content = trimmedContent;
    }
    if (rating !== review.rating) {
      body.rating = rating;
    }

    updateMutation.mutate(
      { residenceReviewId: review.id, body },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
        onError: (error) => {
          const message = getApiErrorMessage(error, "거주 후기를 수정하지 못했습니다.");
          setSubmitError(message);
          onError?.(message);
        },
      },
    );
  };

  return {
    title,
    content,
    rating,
    titleError,
    contentError,
    submitError,
    contentLength: trimmedContent.length,
    isSubmitting,
    isSubmitDisabled,
    handleClose,
    handleSubmit,
    handleTitleChange: (nextTitle: string) => {
      setTitle(nextTitle);
      setSubmitError(undefined);
    },
    handleTitleBlur: () => setIsTitleTouched(true),
    handleContentChange: (nextContent: string) => {
      setContent(nextContent);
      setSubmitError(undefined);
    },
    handleContentBlur: () => setIsContentTouched(true),
    handleRatingChange: (nextRating: number) => {
      setRating(nextRating);
      setSubmitError(undefined);
    },
  };
};
