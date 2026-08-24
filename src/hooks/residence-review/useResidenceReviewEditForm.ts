"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { useUpdateResidenceReview } from "@/hooks/residence-review/useUpdateResidenceReview";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  residenceReviewEditSchema,
  type ResidenceReviewEditFormValues,
} from "@/lib/schemas/residenceReviewSchema";
import type { PublicResidenceReview, UpdateResidenceReviewInput } from "@/types/residenceReview";

interface UseResidenceReviewEditFormParams {
  review: PublicResidenceReview;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const toDefaultValues = (review: PublicResidenceReview): ResidenceReviewEditFormValues => ({
  title: review.title,
  content: review.content,
  rating: review.rating,
});

const hasResidenceReviewChanges = (
  current: Partial<ResidenceReviewEditFormValues>,
  original: PublicResidenceReview,
): boolean =>
  (current.title ?? original.title).trim() !== original.title.trim() ||
  (current.content ?? original.content).trim() !== original.content.trim() ||
  (current.rating ?? original.rating) !== original.rating;

export const useResidenceReviewEditForm = ({
  review,
  onClose,
  onSuccess,
  onError,
}: UseResidenceReviewEditFormParams) => {
  const defaultValues = toDefaultValues(review);
  const updateMutation = useUpdateResidenceReview();
  const {
    register,
    control,
    setError,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields },
  } = useForm<ResidenceReviewEditFormValues>({
    resolver: zodResolver(residenceReviewEditSchema),
    mode: "onTouched",
    defaultValues,
  });

  const currentValues = useWatch({ control });
  const hasChanges = hasResidenceReviewChanges(currentValues, review);
  const isPending = isSubmitting || updateMutation.isPending;
  const submitError = errors.root?.message;
  const isSubmitDisabled = isPending || !isValid || !hasChanges;

  const resetForm = () => {
    reset(defaultValues);
  };

  const handleClose = () => {
    if (isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const submit = handleSubmit(async (formValues) => {
    if (!hasResidenceReviewChanges(formValues, review)) {
      return;
    }

    const body: UpdateResidenceReviewInput = {
      title: formValues.title,
      content: formValues.content,
      rating: formValues.rating,
    };

    try {
      await updateMutation.mutateAsync({ residenceReviewId: review.id, body });
      onSuccess?.();
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error, "거주 후기를 수정하지 못했습니다.");
      setError("root", { message });
      onError?.(message);
    }
  });

  return {
    register,
    control,
    titleError: touchedFields.title ? errors.title?.message : undefined,
    contentError: touchedFields.content ? errors.content?.message : undefined,
    submitError,
    isPending,
    isSubmitDisabled,
    handleClose,
    handleSubmit: submit,
  };
};
