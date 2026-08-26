"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import { Text } from "@/components/common/Text";
import { useLocale, useTranslations } from "next-intl";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { cn } from "@/lib/utils/cn";
import { formatLocalizedDateOnlyLabel } from "@/lib/utils/estimateFormat";
import type { MoverReviewItem } from "@/types/review";

interface MoverMyPageReviewItemProps {
  review: MoverReviewItem;
  hasDivider: boolean;
}

export default function MoverMyPageReviewItem({ review, hasDivider }: MoverMyPageReviewItemProps) {
  const t = useTranslations("profile");
  const locale = useLocale();
  return (
    <li className={cn("border-border-subtle py-20 md:py-24", hasDivider && "border-b")}>
      <article className="flex flex-col gap-16 md:gap-24">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-12 md:gap-14">
            <Text
              as="p"
              variant={{ base: "md-regular", md: "2lg-regular" }}
              className="text-text-secondary"
            >
              {review.customer.displayName}
            </Text>
            <span className="bg-border-subtle h-12 w-px shrink-0" aria-hidden="true" />
            <Text
              as="time"
              dateTime={review.createdAt}
              variant={{ base: "md-regular", md: "2lg-regular" }}
              className="text-text-muted"
            >
              {formatLocalizedDateOnlyLabel(review.createdAt, locale)}
            </Text>
          </div>
          <ReviewStarRating value={review.rating} size="sm" label={t("reviewRating")} />
        </div>

        <Text
          as="p"
          variant={{ base: "md-regular", md: "2lg-regular" }}
          className="text-text-primary break-words whitespace-pre-wrap"
        >
          <AutoTranslatedText text={review.content} />
        </Text>
      </article>
    </li>
  );
}
