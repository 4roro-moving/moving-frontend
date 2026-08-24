"use client";

import { useId } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type FieldPath,
  type UseFormRegister,
} from "react-hook-form";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import { Text } from "@/components/common/Text";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import {
  RESIDENCE_REVIEW_CONTENT_MAX_LENGTH,
  RESIDENCE_REVIEW_CONTENT_MIN_LENGTH,
  RESIDENCE_REVIEW_TITLE_MAX_LENGTH,
} from "@/lib/constants/residenceReview";
import type { ResidenceReviewFormFieldValues } from "@/lib/schemas/residenceReviewSchema";

interface ResidenceReviewFormFieldsProps<T extends ResidenceReviewFormFieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  titleError?: string;
  contentError?: string;
  isPending: boolean;
}

const ResidenceReviewFormFields = <T extends ResidenceReviewFormFieldValues>({
  register,
  control,
  titleError,
  contentError,
  isPending,
}: ResidenceReviewFormFieldsProps<T>) => {
  const titleId = useId();
  const contentId = useId();
  const ratingLabelId = useId();
  const content = useWatch({ control, name: "content" as FieldPath<T> });
  const contentLength = (typeof content === "string" ? content : "").trim().length;

  return (
    <>
      <div className="flex w-full flex-col gap-12">
        <Text
          as="p"
          id={ratingLabelId}
          variant={{ base: "lg-semibold", xl: "2lg-semibold" }}
          className="text-text-tertiary"
        >
          평점을 선택해 주세요
        </Text>
        <Controller
          name={"rating" as FieldPath<T>}
          control={control}
          render={({ field, fieldState }) => (
            <ReviewStarRating
              value={typeof field.value === "number" ? field.value : 0}
              onChange={field.onChange}
              onBlur={field.onBlur}
              size="lg"
              label="평점"
              labelledBy={ratingLabelId}
              error={fieldState.error?.message}
              disabled={isPending}
            />
          )}
        />
      </div>

      <FormField label="제목을 입력해 주세요" labelFor={titleId} variant="compact">
        <Input
          id={titleId}
          size="md"
          maxLength={RESIDENCE_REVIEW_TITLE_MAX_LENGTH}
          disabled={isPending}
          placeholder="제목을 입력해주세요"
          error={titleError}
          {...register("title" as FieldPath<T>)}
        />
      </FormField>

      <FormField label="상세 후기를 작성해 주세요" labelFor={contentId} variant="compact">
        <div className="flex w-full flex-col gap-8">
          <Textarea
            id={contentId}
            maxLength={RESIDENCE_REVIEW_CONTENT_MAX_LENGTH}
            disabled={isPending}
            placeholder={`최소 ${String(RESIDENCE_REVIEW_CONTENT_MIN_LENGTH)}자 이상 입력해주세요`}
            error={contentError}
            className="h-160"
            {...register("content" as FieldPath<T>)}
          />
          <Text as="span" variant="xs-regular" className="text-text-muted self-end">
            {contentLength}/{RESIDENCE_REVIEW_CONTENT_MAX_LENGTH}
          </Text>
        </div>
      </FormField>
    </>
  );
};

export default ResidenceReviewFormFields;
