"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface MoverMetaProps {
  rating: number;
  reviewCount: number;
  careerYears: number;
  confirmedCount: number;
  className?: string;
}

const dividerClassName = cn(
  "after:bg-border-default",
  "after:h-14 after:w-px after:shrink-0 after:self-center",
  "after:ml-4 after:content-['']",
);

/** 아이콘 옆에서는 line-height가 세로 정렬을 밀지 않도록 맞춤 */
const metaTextClassName = "leading-none";

/** 기사님 평점·경력·확정 건수 요약 행 */
export function MoverMeta({
  rating,
  reviewCount,
  careerYears,
  confirmedCount,
  className,
}: MoverMetaProps) {
  const tr = useTranslations("moverSearch");
  return (
    <dl className={cn("flex flex-wrap items-center gap-6", className)}>
      <div className={cn("flex items-center gap-2", dividerClassName)}>
        <dt className="sr-only">{tr("meta.ratingAndReviews")}</dt>
        <dd className="m-0 flex items-center gap-2">
          <StarIcon className="text-rating-fill size-20 shrink-0" aria-hidden="true" />
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-secondary", metaTextClassName)}
          >
            {rating.toFixed(1)}
          </Text>
          <span className="sr-only">{tr("meta.pointsSeparator")}</span>
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-muted", metaTextClassName)}
            aria-hidden="true"
          >
            ({reviewCount})
          </Text>
          <span className="sr-only">{tr("meta.reviewCount", { count: reviewCount })}</span>
        </dd>
      </div>

      <div className={cn("flex items-center gap-4", dividerClassName)}>
        <dt>
          <Text as="span" variant="sm-medium" className={cn("text-text-muted", metaTextClassName)}>
            {tr("meta.career")}
          </Text>
        </dt>
        <dd className="m-0 flex items-center">
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-secondary", metaTextClassName)}
          >
            {tr("meta.careerYears", { count: careerYears })}
          </Text>
        </dd>
      </div>

      <div className="flex items-center gap-4">
        <dt className="order-2 flex items-center">
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-muted", metaTextClassName)}
            aria-hidden="true"
          >
            {tr("meta.confirmed")}
          </Text>
          <span className="sr-only">{tr("meta.confirmedCountAria")}</span>
        </dt>
        <dd className="order-1 m-0 flex items-center">
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-secondary", metaTextClassName)}
          >
            {tr("meta.confirmedCount", { count: confirmedCount })}
          </Text>
        </dd>
      </div>
    </dl>
  );
}
