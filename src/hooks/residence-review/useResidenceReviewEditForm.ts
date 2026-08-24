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
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResidenceReviewEditFormValues>({
    resolver: zodResolver(residenceReviewEditSchema),
    mode: "onChange",
    defaultValues,
  });

  const title = useWatch({ control, name: "title" });
  const content = useWatch({ control, name: "content" });
  const rating = useWatch({ control, name: "rating" });
  const hasChanges =
    title.trim() !== review.title.trim() ||
    content.trim() !== review.content.trim() ||
    rating !== review.rating;
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
    const body: UpdateResidenceReviewInput = {};
    if (formValues.title !== review.title.trim()) {
      body.title = formValues.title;
    }
    if (formValues.content !== review.content.trim()) {
      body.content = formValues.content;
    }
    if (formValues.rating !== review.rating) {
      body.rating = formValues.rating;
    }

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
    titleError: errors.title?.message,
    contentError: errors.content?.message,
    submitError,
    isPending,
    isSubmitDisabled,
    handleClose,
    handleSubmit: submit,
  };
};
