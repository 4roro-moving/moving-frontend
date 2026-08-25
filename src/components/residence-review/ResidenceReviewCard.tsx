"use client";

import { useFormatter, useTranslations } from "next-intl";

import Image from "next/image";
import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import ResidenceReviewRatingText from "@/components/residence-review/ResidenceReviewRatingText";
import { ProfileDefaultIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import {
  formatResidenceReviewRating,
  getResidenceReviewAuthorImageSrc,
} from "@/lib/utils/residenceReviewFormat";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewCardProps {
  review: PublicResidenceReview;
  onSelect?: (review: PublicResidenceReview) => void;
  onPrefetch?: (review: PublicResidenceReview) => void;
}

const ResidenceReviewCard = ({ review, onSelect, onPrefetch }: ResidenceReviewCardProps) => {
  const t = useTranslations("residenceReview");
  const format = useFormatter();
  const authorImageSrc = getResidenceReviewAuthorImageSrc(review.author.imageUrl);
  const authorName = review.author.name.trim() || t("customer");
  const regionName = t(`regions.${String(review.region.id)}`);
  const regionLabel =
    review.region.averageRating && review.region.averageRating > 0
      ? t("regionWithAverage", {
          region: regionName,
          rating: formatResidenceReviewRating(review.region.averageRating),
        })
      : t("regionResident", { region: regionName });
  const writtenDate = Number.isNaN(new Date(review.createdAt).getTime())
    ? ""
    : format.dateTime(new Date(review.createdAt), {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
  const titleId = `residence-review-${String(review.id)}-title`;
  const descriptionId = `residence-review-${String(review.id)}-description`;

  const content: ReactNode = (
    <>
      <span id={descriptionId} className="sr-only">
        {t("cardAria", {
          author: authorName,
          rating: formatResidenceReviewRating(review.rating),
          region: regionLabel,
        })}
      </span>
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
                <ResidenceReviewRatingText rating={review.rating} />
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
          {t("writtenDateValue", { date: writtenDate })}
        </Text>
      ) : null}
    </>
  );

  const className = cn(
    "bg-background-default border-border-subtle shadow-estimate-card rounded-16 md:rounded-20 flex w-full flex-col border-[0.5px] text-left",
    "gap-16 px-16 py-16 md:gap-20 md:p-24 xl:p-40",
    onSelect
      ? "hover:bg-background-hover focus-visible:ring-border-brand cursor-pointer transition-colors focus-visible:ring-2 focus-visible:outline-none"
      : "cursor-default",
  );

  if (!onSelect) {
    return (
      <article aria-labelledby={titleId} aria-describedby={descriptionId} className={className}>
        {content}
      </article>
    );
  }

  return (
    <button
      type="button"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={className}
      onClick={() => onSelect(review)}
      onMouseEnter={() => onPrefetch?.(review)}
      onFocus={() => onPrefetch?.(review)}
    >
      {content}
    </button>
  );
};

export default ResidenceReviewCard;
