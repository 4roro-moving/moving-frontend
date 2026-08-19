"use client";

import Image from "next/image";

import { Text } from "@/components/common/Text";
import { ProfileDefaultIcon, StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import {
  formatResidenceReviewAuthorName,
  formatResidenceReviewRating,
  formatResidenceReviewRegionLabel,
  formatResidenceReviewWrittenDate,
  getResidenceReviewAuthorImageSrc,
} from "@/lib/utils/residenceReviewFormat";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewCardProps {
  review: PublicResidenceReview;
  onSelect: (review: PublicResidenceReview) => void;
  onPrefetch?: (review: PublicResidenceReview) => void;
}

const ResidenceReviewCard = ({ review, onSelect, onPrefetch }: ResidenceReviewCardProps) => {
  const authorImageSrc = getResidenceReviewAuthorImageSrc(review.author.imageUrl);
  const authorName = formatResidenceReviewAuthorName(review.author.name);
  const regionLabel = formatResidenceReviewRegionLabel(review.region);
  const ratingLabel = formatResidenceReviewRating(review.rating);
  const writtenDate = formatResidenceReviewWrittenDate(review.createdAt);
  const titleId = `residence-review-${String(review.id)}-title`;

  return (
    <button
      type="button"
      aria-labelledby={titleId}
      className={cn(
        "bg-background-default border-border-subtle shadow-estimate-card rounded-16 md:rounded-20 flex w-full flex-col border-[0.5px] text-left",
        "gap-16 px-16 py-16 md:gap-20 md:p-24 xl:p-40",
        "hover:bg-background-hover focus-visible:ring-border-brand transition-colors focus-visible:ring-2 focus-visible:outline-none",
      )}
      onClick={() => onSelect(review)}
      onMouseEnter={() => onPrefetch?.(review)}
      onFocus={() => onPrefetch?.(review)}
    >
      <div className="flex w-full items-center gap-16 md:gap-20">
        <div className="bg-background-avatar rounded-12 relative hidden size-64 shrink-0 overflow-hidden md:block md:size-80">
          {authorImageSrc ? (
            <Image src={authorImageSrc} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <ProfileDefaultIcon className="size-full" aria-hidden="true" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="flex items-start justify-between gap-12 md:contents">
            <div className="flex min-w-0 flex-col gap-8">
              <div className="flex items-center gap-20 md:order-2">
                <div className="flex items-center gap-2">
                  <StarIcon className="text-rating-fill size-20 shrink-0" aria-hidden="true" />
                  <Text as="span" variant="sm-medium" className="text-text-secondary">
                    {ratingLabel}
                  </Text>
                </div>
                <span className="bg-border-subtle hidden h-30 w-px md:block" aria-hidden="true" />
                <Text as="span" variant="md-medium" className="text-text-secondary truncate">
                  {regionLabel}
                </Text>
              </div>
              <Text
                as="span"
                variant={{ base: "md-bold", xl: "2lg-bold" }}
                className="text-text-secondary md:order-1"
              >
                {authorName}
              </Text>
            </div>

            <div className="bg-background-avatar rounded-12 relative size-56 shrink-0 overflow-hidden md:hidden">
              {authorImageSrc ? (
                <Image src={authorImageSrc} alt="" fill sizes="56px" className="object-cover" />
              ) : (
                <ProfileDefaultIcon className="size-full" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-border-subtle h-px w-full md:hidden" aria-hidden="true" />

      <div className="flex w-full flex-col gap-12">
        <Text
          as="span"
          id={titleId}
          variant={{ base: "lg-semibold", xl: "xl-semibold" }}
          className="text-text-primary line-clamp-1"
        >
          {review.title}
        </Text>
        <Text
          as="span"
          variant={{ base: "md-medium", xl: "2lg-medium" }}
          className="text-text-muted line-clamp-2"
        >
          {review.content}
        </Text>
      </div>

      {writtenDate ? (
        <Text as="span" variant="xs-medium" className="text-text-muted self-end md:hidden">
          작성일 {writtenDate}
        </Text>
      ) : null}
    </button>
  );
};

export default ResidenceReviewCard;
