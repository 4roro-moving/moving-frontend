"use client";

import { Text } from "@/components/common/Text";
import type { MoverDetail } from "@/types/moverDetail";

interface MoverMyPageRatingDistributionProps {
  ratingDistribution: MoverDetail["ratingDistribution"];
}

export default function MoverMyPageRatingDistribution({
  ratingDistribution,
}: MoverMyPageRatingDistributionProps) {
  const maxCount = Math.max(...ratingDistribution.map((item) => item.count), 1);
  const topScore =
    ratingDistribution.find((item) => item.count === maxCount && item.count > 0)?.score ?? null;

  return (
    <ul className="max-w-mypage-rating-width flex w-full flex-col gap-4" aria-label="별점 분포">
      {ratingDistribution.map((item) => {
        const isTop = item.score === topScore;

        return (
          <li key={item.score} className="flex items-center gap-16">
            <Text
              as="span"
              variant={isTop ? "md-bold" : "md-medium"}
              className="text-text-tertiary w-36 shrink-0"
            >
              {item.score}점
            </Text>

            <progress
              value={item.count}
              max={maxCount}
              aria-label={`${item.score}점 리뷰 ${item.count}개`}
              className="w-mypage-rating-track rounded-100 bg-rating-track [&::-webkit-progress-bar]:rounded-100 [&::-webkit-progress-bar]:bg-rating-track [&::-webkit-progress-value]:rounded-100 [&::-webkit-progress-value]:bg-rating-fill [&::-moz-progress-bar]:rounded-100 [&::-moz-progress-bar]:bg-rating-fill h-8 appearance-none overflow-hidden"
            />

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
  );
}
