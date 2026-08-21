"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCreateGiveaway } from "@/hooks/giveaway/useCreateGiveaway";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { uploadGiveawayImages } from "@/lib/api/giveaways";
import {
  GIVEAWAY_IMAGE_MAX_COUNT,
  GIVEAWAY_IMAGE_MAX_SIZE_BYTES,
  GIVEAWAY_IMAGE_MAX_SIZE_MB,
  GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES,
  GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_MB,
} from "@/lib/constants/giveaway";
import {
  giveawayCreateSchema,
  type GiveawayCreateFormValues,
} from "@/lib/schemas/giveawayCreateSchema";
import { isGiveawayImageContentType, type GiveawayDetail } from "@/types/giveaway";

interface UseGiveawayCreateFormParams {
  onClose: () => void;
  onSuccess?: (giveaway: GiveawayDetail) => void;
}

const DEFAULT_VALUES: GiveawayCreateFormValues = {
  regionId: null,
  title: "",
  description: "",
  images: [],
};

export const useGiveawayCreateForm = ({ onClose, onSuccess }: UseGiveawayCreateFormParams) => {
  const createMutation = useCreateGiveaway();
  const {
    register,
    control,
    getValues,
    setValue,
    setError,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<GiveawayCreateFormValues>({
    resolver: zodResolver(giveawayCreateSchema),
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const isPending = isSubmitting || createMutation.isPending;
  const submitError = errors.root?.message;
  const isSubmitDisabled = isPending || !isValid;

  const resetForm = () => {
    reset(DEFAULT_VALUES);
  };

  const handleClose = () => {
    if (isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleAddImages = (fileList: FileList | null) => {
    if (!fileList || isPending) {
      return;
    }

    const currentImages = getValues("images");
    const remainingCount = GIVEAWAY_IMAGE_MAX_COUNT - currentImages.length;
    if (remainingCount <= 0) {
      return;
    }

    const selectedFiles = Array.from(fileList).slice(0, remainingCount);
    const acceptedFiles: File[] = [];
    let rejectionMessage: string | undefined;

    for (const file of selectedFiles) {
      if (!isGiveawayImageContentType(file.type)) {
        rejectionMessage = "jpg, png, webp 형식의 이미지만 등록할 수 있습니다.";
        continue;
      }

      if (file.size > GIVEAWAY_IMAGE_MAX_SIZE_BYTES) {
        rejectionMessage = `이미지는 ${String(GIVEAWAY_IMAGE_MAX_SIZE_MB)}MB 이하여야 합니다.`;
        continue;
      }

      acceptedFiles.push(file);
    }

    if (acceptedFiles.length === 0) {
      if (rejectionMessage) {
        setError("images", { message: rejectionMessage });
      }
      return;
    }

    const nextImages = [...currentImages, ...acceptedFiles];
    const totalSize = nextImages.reduce((total, file) => total + file.size, 0);

    if (totalSize > GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES) {
      setError("images", {
        message: `이미지 총 용량은 ${String(GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_MB)}MB 이하여야 합니다.`,
      });
      return;
    }

    setValue("images", nextImages, { shouldDirty: true, shouldValidate: true });

    if (rejectionMessage) {
      setError("images", { message: rejectionMessage });
    }
  };

  const handleRemoveImage = (index: number) => {
    if (isPending) {
      return;
    }

    setValue(
      "images",
      getValues("images").filter((_, imageIndex) => imageIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const submit = handleSubmit(async (formValues) => {
    if (formValues.regionId === null) {
      setError("regionId", { message: "지역을 선택해 주세요." });
      return;
    }

    try {
      const imageKeys = await uploadGiveawayImages(formValues.images);
      const giveaway = await createMutation.mutateAsync({
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        regionId: formValues.regionId,
        imageKeys,
      });

      onSuccess?.(giveaway);
      resetForm();
      onClose();
    } catch (error) {
      setError("root", {
        message: getApiErrorMessage(error, "나눔 글을 등록하지 못했습니다."),
      });
    }
  });

  return {
    register,
    control,
    regionError: errors.regionId?.message,
    titleError: errors.title?.message,
    descriptionError: errors.description?.message,
    submitError,
    isPending,
    isSubmitDisabled,
    handleClose,
    handleAddImages,
    handleRemoveImage,
    handleSubmit: submit,
  };
};
