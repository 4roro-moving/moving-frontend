"use client";

import { useId } from "react";

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

interface ResidenceReviewFormFieldsProps {
  title: string;
  content: string;
  rating: number;
  titleError?: string;
  contentError?: string;
  contentLength: number;
  isSubmitting: boolean;
  onTitleChange: (title: string) => void;
  onTitleBlur: () => void;
  onContentChange: (content: string) => void;
  onContentBlur: () => void;
  onRatingChange: (rating: number) => void;
}

const ResidenceReviewFormFields = ({
  title,
  content,
  rating,
  titleError,
  contentError,
  contentLength,
  isSubmitting,
  onTitleChange,
  onTitleBlur,
  onContentChange,
  onContentBlur,
  onRatingChange,
}: ResidenceReviewFormFieldsProps) => {
  const titleId = useId();
  const contentId = useId();

  return (
    <>
      <div className="flex w-full flex-col gap-12">
        <Text
          as="p"
          variant={{ base: "lg-semibold", xl: "2lg-semibold" }}
          className="text-text-tertiary"
        >
          평점을 선택해 주세요
        </Text>
        <ReviewStarRating
          value={rating}
          onChange={onRatingChange}
          size="lg"
          label="평점"
          disabled={isSubmitting}
        />
      </div>

      <FormField label="제목을 입력해 주세요" labelFor={titleId} variant="compact">
        <Input
          id={titleId}
          size="md"
          value={title}
          maxLength={RESIDENCE_REVIEW_TITLE_MAX_LENGTH}
          disabled={isSubmitting}
          placeholder="제목을 입력해주세요"
          error={titleError}
          onChange={(event) => onTitleChange(event.target.value)}
          onBlur={onTitleBlur}
        />
      </FormField>

      <FormField label="상세 후기를 작성해 주세요" labelFor={contentId} variant="compact">
        <div className="flex w-full flex-col gap-8">
          <Textarea
            id={contentId}
            value={content}
            maxLength={RESIDENCE_REVIEW_CONTENT_MAX_LENGTH}
            disabled={isSubmitting}
            placeholder={`최소 ${String(RESIDENCE_REVIEW_CONTENT_MIN_LENGTH)}자 이상 입력해주세요`}
            error={contentError}
            className="h-160"
            onChange={(event) => onContentChange(event.target.value)}
            onBlur={onContentBlur}
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
