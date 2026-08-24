"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreateResidenceReview } from "@/hooks/residence-review/useCreateResidenceReview";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { RegionId } from "@/lib/constants/region";
import {
  residenceReviewCreateSchema,
  type ResidenceReviewCreateFormValues,
} from "@/lib/schemas/residenceReviewSchema";
import type { CreateResidenceReviewInput } from "@/types/residenceReview";

interface UseResidenceReviewCreateFormParams {
  defaultRegionId: RegionId | null;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const getDefaultValues = (regionId: RegionId | null): ResidenceReviewCreateFormValues => ({
  regionId,
  title: "",
  content: "",
  rating: 0,
});

export const useResidenceReviewCreateForm = ({
  defaultRegionId,
  onClose,
  onSuccess,
  onError,
}: UseResidenceReviewCreateFormParams) => {
  const defaultValues = getDefaultValues(defaultRegionId);
  const createMutation = useCreateResidenceReview();
  const {
    register,
    control,
    getValues,
    setValue,
    setError,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields },
  } = useForm<ResidenceReviewCreateFormValues>({
    resolver: zodResolver(residenceReviewCreateSchema),
    mode: "onTouched",
    defaultValues,
  });

  useEffect(() => {
    if (defaultRegionId === null || getValues("regionId") !== null) {
      return;
    }

    setValue("regionId", defaultRegionId, { shouldValidate: true });
  }, [defaultRegionId, getValues, setValue]);

  const isPending = isSubmitting || createMutation.isPending;
  const submitError = errors.root?.message;
  const isSubmitDisabled = isPending || !isValid;

  const resetForm = () => {
    reset(getDefaultValues(defaultRegionId));
  };

  const handleClose = () => {
    if (isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const submit = handleSubmit(async (formValues) => {
    if (formValues.regionId === null) {
      setError("regionId", { message: "지역을 선택해 주세요." });
      return;
    }

    const body: CreateResidenceReviewInput = {
      regionId: formValues.regionId,
      title: formValues.title,
      content: formValues.content,
      rating: formValues.rating,
    };

    try {
      await createMutation.mutateAsync(body);
      onSuccess?.();
      resetForm();
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error, "거주 후기를 작성하지 못했습니다.");
      setError("root", { message });
      onError?.(message);
    }
  });

  return {
    register,
    control,
    regionError: touchedFields.regionId ? errors.regionId?.message : undefined,
    titleError: touchedFields.title ? errors.title?.message : undefined,
    contentError: touchedFields.content ? errors.content?.message : undefined,
    submitError,
    isPending,
    isSubmitDisabled,
    handleClose,
    handleSubmit: submit,
  };
};
