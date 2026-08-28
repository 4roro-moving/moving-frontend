"use client";

import { Text } from "@/components/common/Text";
import { useTranslations } from "next-intl";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { MoverDetail } from "@/types/moverDetail";

interface MoverRatingSummaryProps {
  rating: number;
  reviewCount: number;
  ratingDistribution: MoverDetail["ratingDistribution"];
}

export default function MoverRatingSummary({
  rating,
  reviewCount,
  ratingDistribution,
}: MoverRatingSummaryProps) {
  const t = useTranslations("profile");
  const maxCount = Math.max(...ratingDistribution.map((item) => item.count), 1);
  const topScore =
    ratingDistribution.find((item) => item.count === maxCount && item.count > 0)?.score ?? null;
  const hasDistribution = ratingDistribution.some((item) => item.count > 0);

  return (
    <div className="flex w-full flex-col gap-24 md:flex-row md:items-start md:justify-between">
      <div className="flex items-center gap-16">
        <Text as="p" variant="rating-score" className="text-text-primary">
          {formatRating(rating)}
        </Text>
        <div className="flex flex-col gap-2">
          <ReviewStarRating value={Math.round(rating)} size="sm" label={t("averageRating")} />
          <Text as="p" variant="md-regular" className="text-text-muted">
            {t("reviewCount", { count: reviewCount })}
          </Text>
        </div>
      </div>

      {hasDistribution ? (
        <ul
          className="flex w-full max-w-[284px] flex-col gap-4 md:shrink-0"
          aria-label={t("ratingDistribution")}
        >
          {ratingDistribution.map((item) => {
            const isTop = item.score === topScore;

            return (
              <li key={item.score} className="flex items-center gap-16">
                <Text
                  as="span"
                  variant={isTop ? "md-bold" : "md-medium"}
                  className="text-text-tertiary w-36 shrink-0"
                >
                  {t("ratingScore", { score: item.score })}
                </Text>
                <div
                  className="bg-rating-track relative h-8 w-full max-w-[180px] overflow-hidden rounded-full"
                  role="img"
                  aria-label={t("ratingDistributionItem", { score: item.score, count: item.count })}
                >
                  <div
                    className="bg-rating-fill absolute inset-y-0 left-0 rounded-full"
                    // 동적 비율(리뷰 분포) — 토큰 고정 width로 표현할 수 없습니다.
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <Text
                  as="span"
                  variant={isTop ? "md-bold" : "md-medium"}
                  className="text-rating-count w-36 shrink-0"
                >
                  {item.count}
                </Text>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
