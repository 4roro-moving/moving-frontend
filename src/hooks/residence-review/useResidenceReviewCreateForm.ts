"use client";

import { useState } from "react";

import { useCreateResidenceReview } from "@/hooks/residence-review/useCreateResidenceReview";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { isRegionId, type RegionId } from "@/lib/constants/region";
import {
  getResidenceReviewContentError,
  getResidenceReviewTitleError,
} from "@/lib/utils/residenceReviewValidation";
import { RESIDENCE_REVIEW_RATING } from "@/types/residenceReview";
import type { CreateResidenceReviewInput } from "@/types/residenceReview";

interface UseResidenceReviewCreateFormParams {
  defaultRegionId: RegionId | null;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useResidenceReviewCreateForm = ({
  defaultRegionId,
  onClose,
  onSuccess,
  onError,
}: UseResidenceReviewCreateFormParams) => {
  const [regionId, setRegionId] = useState<RegionId | null>(defaultRegionId);
  const [appliedDefaultRegionId, setAppliedDefaultRegionId] = useState(defaultRegionId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [isTitleTouched, setIsTitleTouched] = useState(false);
  const [isContentTouched, setIsContentTouched] = useState(false);
  const [isRegionTouched, setIsRegionTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const createMutation = useCreateResidenceReview();

  if (defaultRegionId !== appliedDefaultRegionId) {
    setAppliedDefaultRegionId(defaultRegionId);
    if (regionId === appliedDefaultRegionId) {
      setRegionId(defaultRegionId);
    }
  }

  const resetForm = () => {
    setRegionId(defaultRegionId);
    setAppliedDefaultRegionId(defaultRegionId);
    setTitle("");
    setContent("");
    setRating(0);
    setIsTitleTouched(false);
    setIsContentTouched(false);
    setIsRegionTouched(false);
    setSubmitError(undefined);
  };

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const titleError = isTitleTouched ? getResidenceReviewTitleError(title) : undefined;
  const contentError = isContentTouched ? getResidenceReviewContentError(content) : undefined;
  const regionError = isRegionTouched && regionId === null ? "지역을 선택해 주세요." : undefined;
  const isRatingValid =
    rating >= RESIDENCE_REVIEW_RATING.MIN && rating <= RESIDENCE_REVIEW_RATING.MAX;
  const isValid =
    regionId !== null &&
    !getResidenceReviewTitleError(title) &&
    !getResidenceReviewContentError(content) &&
    isRatingValid;
  const isSubmitting = createMutation.isPending;
  const isSubmitDisabled = isSubmitting || !isValid;

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (isSubmitDisabled || regionId === null) {
      return;
    }

    const body: CreateResidenceReviewInput = {
      regionId,
      title: trimmedTitle,
      content: trimmedContent,
      rating,
    };

    createMutation.mutate(body, {
      onSuccess: () => {
        onSuccess?.();
        resetForm();
        onClose();
      },
      onError: (error) => {
        const message = getApiErrorMessage(error, "거주 후기를 작성하지 못했습니다.");
        setSubmitError(message);
        onError?.(message);
      },
    });
  };

  return {
    regionId,
    title,
    content,
    rating,
    titleError,
    contentError,
    regionError,
    submitError,
    contentLength: trimmedContent.length,
    isSubmitting,
    isSubmitDisabled,
    handleClose,
    handleSubmit,
    handleRegionChange: (nextRegionValue: string) => {
      const parsed = Number(nextRegionValue);
      setRegionId(isRegionId(parsed) ? parsed : null);
      setIsRegionTouched(true);
      setSubmitError(undefined);
    },
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
