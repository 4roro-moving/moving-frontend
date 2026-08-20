"use client";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import ResidenceReviewInfoItem from "@/components/residence-review/ResidenceReviewInfoItem";
import ResidenceReviewRatingText from "@/components/residence-review/ResidenceReviewRatingText";
import { formatKoreanDateTime } from "@/lib/utils/date";
import { formatResidenceReviewRating } from "@/lib/utils/residenceReviewFormat";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface MyResidenceReviewCardProps {
  review: PublicResidenceReview;
  onEdit: (review: PublicResidenceReview) => void;
  onDelete: (review: PublicResidenceReview) => void;
}

const InfoDivider = () => {
  return (
    <span className="bg-border-subtle hidden h-50 w-px shrink-0 md:block" aria-hidden="true" />
  );
};

const MyResidenceReviewCard = ({ review, onEdit, onDelete }: MyResidenceReviewCardProps) => {
  const titleId = `my-residence-review-${String(review.id)}-title`;
  let writtenDate = "";

  try {
    writtenDate = formatKoreanDateTime(review.createdAt);
  } catch {
    writtenDate = "";
  }

  return (
    <article
      aria-labelledby={titleId}
      className="bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex w-full flex-col gap-20 border-[0.5px] px-20 py-24 md:gap-40 md:p-32 xl:flex-row xl:items-center xl:justify-between xl:gap-12 xl:px-40"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-12 md:gap-24">
        <div className="flex flex-col gap-12 md:gap-10">
          <ResidenceReviewRatingText rating={review.rating} />
          <div className="flex flex-col gap-2">
            <Text
              as="h2"
              id={titleId}
              variant={{ base: "lg-semibold", md: "2lg-bold" }}
              className="text-text-primary line-clamp-1"
            >
              {review.title}
            </Text>
            <Text as="p" variant="md-regular" className="text-text-muted line-clamp-1">
              {review.content}
            </Text>
          </div>
        </div>

        <dl className="flex w-full flex-col gap-16 md:flex-row md:items-center md:gap-20">
          <div className="flex items-start gap-16 md:items-center md:gap-20">
            <ResidenceReviewInfoItem label="후기 지역" value={review.region.name} />
            <InfoDivider />
            <ResidenceReviewInfoItem
              label="지역 평균"
              value={formatResidenceReviewRating(review.region.averageRating)}
            />
            <InfoDivider />
            <ResidenceReviewInfoItem
              label="작성일"
              value={writtenDate}
              className="hidden md:flex"
            />
          </div>
          <ResidenceReviewInfoItem label="작성일" value={writtenDate} className="md:hidden" />
        </dl>
      </div>

      <div className="flex w-full flex-col gap-8 md:flex-row md:gap-12 xl:w-160 xl:shrink-0 xl:flex-col xl:gap-8">
        <Button type="button" variant="solid" size="cta" fullWidth onClick={() => onEdit(review)}>
          수정하기
        </Button>
        <Button
          type="button"
          variant="outline"
          size="cta"
          fullWidth
          onClick={() => onDelete(review)}
        >
          삭제하기
        </Button>
      </div>
    </article>
  );
};

export default MyResidenceReviewCard;
