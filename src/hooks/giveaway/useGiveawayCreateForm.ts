"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useCreateGiveaway } from "@/hooks/giveaway/useCreateGiveaway";
import { useUpdateGiveaway } from "@/hooks/giveaway/useUpdateGiveaway";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { uploadGiveawayImages } from "@/lib/api/giveaways";
import {
  GIVEAWAY_IMAGE_MAX_COUNT,
  GIVEAWAY_IMAGE_MAX_SIZE_BYTES,
  GIVEAWAY_IMAGE_MAX_SIZE_MB,
  GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES,
  GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_MB,
  isReusableGiveawayImageKey,
  toGiveawayExistingFormImage,
} from "@/lib/constants/giveaway";
import { isRegionId } from "@/lib/constants/region";
import {
  giveawayCreateSchema,
  type GiveawayCreateFormValues,
} from "@/lib/schemas/giveawayCreateSchema";
import {
  isGiveawayImageContentType,
  type GiveawayDetail,
  type GiveawayFormImage,
} from "@/types/giveaway";

interface UseGiveawayCreateFormParams {
  giveaway?: GiveawayDetail;
  onClose: () => void;
  onSuccess?: (giveaway: GiveawayDetail) => void;
}

const EMPTY_VALUES: GiveawayCreateFormValues = {
  regionId: null,
  title: "",
  description: "",
  images: [],
};

const toEditDefaultValues = (giveaway: GiveawayDetail): GiveawayCreateFormValues => {
  const regionId = giveaway.region?.id;

  return {
    regionId: regionId !== undefined && isRegionId(regionId) ? regionId : null,
    title: giveaway.title,
    description: giveaway.description,
    images: giveaway.images.map(toGiveawayExistingFormImage),
  };
};

const areImagesUnchanged = (giveaway: GiveawayDetail, images: GiveawayFormImage[]) => {
  if (images.length !== giveaway.images.length) {
    return false;
  }

  return images.every((image, index) => {
    const original = giveaway.images[index];
    return (
      image.kind === "existing" && original !== undefined && image.imageKey === original.imageKey
    );
  });
};

const toOrderedImageKeys = async (images: GiveawayFormImage[]) => {
  const imageKeys: string[] = [];

  for (const image of images) {
    if (image.kind === "existing") {
      if (isReusableGiveawayImageKey(image.imageKey)) {
        imageKeys.push(image.imageKey);
      }
      continue;
    }

    const uploadedKeys = await uploadGiveawayImages([image.file]);
    const uploadedKey = uploadedKeys[0];
    if (uploadedKey) {
      imageKeys.push(uploadedKey);
    }
  }

  return imageKeys;
};

export const useGiveawayCreateForm = ({
  giveaway,
  onClose,
  onSuccess,
}: UseGiveawayCreateFormParams) => {
  const isEdit = giveaway !== undefined;
  const defaultValues = giveaway ? toEditDefaultValues(giveaway) : EMPTY_VALUES;
  const createMutation = useCreateGiveaway();
  const updateMutation = useUpdateGiveaway();
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
    defaultValues,
  });

  const [imageWarning, setImageWarning] = useState<string | undefined>();
  const isPending = isSubmitting || createMutation.isPending || updateMutation.isPending;
  const submitError = errors.root?.message;
  const isSubmitDisabled = isPending || !isValid;

  const resetForm = () => {
    setImageWarning(undefined);
    reset(defaultValues);
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
      setImageWarning(rejectionMessage);
      return;
    }

    const nextImages: GiveawayFormImage[] = [
      ...currentImages,
      ...acceptedFiles.map((file) => ({ kind: "new" as const, file })),
    ];
    const totalSize = nextImages.reduce((total, image) => {
      return image.kind === "new" ? total + image.file.size : total;
    }, 0);

    if (totalSize > GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_BYTES) {
      setImageWarning(
        `이미지 총 용량은 ${String(GIVEAWAY_IMAGE_MAX_TOTAL_SIZE_MB)}MB 이하여야 합니다.`,
      );
      return;
    }

    setImageWarning(rejectionMessage);
    setValue("images", nextImages, { shouldDirty: true, shouldValidate: true });
  };

  const handleRemoveImage = (index: number) => {
    if (isPending) {
      return;
    }

    setImageWarning(undefined);
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
      if (isEdit && giveaway) {
        const imagesUnchanged = areImagesUnchanged(giveaway, formValues.images);
        const imageKeys = imagesUnchanged ? undefined : await toOrderedImageKeys(formValues.images);

        if (imageKeys !== undefined && imageKeys.length === 0) {
          setError("images", { message: "이미지를 1장 이상 등록해 주세요." });
          return;
        }

        const updated = await updateMutation.mutateAsync({
          giveawayId: giveaway.id,
          body: {
            title: formValues.title.trim(),
            description: formValues.description.trim(),
            regionId: formValues.regionId,
            ...(imageKeys === undefined ? {} : { imageKeys }),
          },
        });

        onSuccess?.(updated);
        resetForm();
        onClose();
        return;
      }

      const newFiles = formValues.images.flatMap((image) =>
        image.kind === "new" ? [image.file] : [],
      );
      const imageKeys = await uploadGiveawayImages(newFiles);
      const created = await createMutation.mutateAsync({
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        regionId: formValues.regionId,
        imageKeys,
      });

      onSuccess?.(created);
      resetForm();
      onClose();
    } catch (error) {
      setError("root", {
        message: getApiErrorMessage(
          error,
          isEdit ? "나눔 글을 수정하지 못했습니다." : "나눔 글을 등록하지 못했습니다.",
        ),
      });
    }
  });

  return {
    isEdit,
    register,
    control,
    regionError: errors.regionId?.message,
    titleError: errors.title?.message,
    descriptionError: errors.description?.message,
    imageWarning,
    submitError,
    isPending,
    isSubmitDisabled,
    handleClose,
    handleAddImages,
    handleRemoveImage,
    handleSubmit: submit,
  };
};
