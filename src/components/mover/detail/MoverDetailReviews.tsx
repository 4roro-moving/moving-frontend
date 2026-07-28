"use client";

import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { cn } from "@/lib/utils/cn";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { MoverDetail, MoverDetailReview } from "@/types/moverDetail";

interface MoverDetailReviewsProps {
  detail: MoverDetail;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function MoverDetailReviews({
  detail,
  currentPage,
  onPageChange,
}: MoverDetailReviewsProps) {
  const isEmpty = detail.reviewCount === 0;
  const hasReviews = detail.reviews.length > 0;
  const hasDistribution = detail.ratingDistribution.some((item) => item.count > 0);
  const maxCount = Math.max(...detail.ratingDistribution.map((item) => item.count), 1);

  return (
    <section className="flex w-full flex-col gap-24 md:gap-32" aria-labelledby="mover-reviews">
      <Text
        as="h2"
        id="mover-reviews"
        variant={{ base: "lg-semibold", md: "xl-semibold" }}
        className="text-text-primary"
      >
        리뷰
      </Text>

      {isEmpty ? (
        <div className="flex w-full flex-col items-center py-24 text-center">
          <Text as="p" variant="lg-semibold" className="text-text-primary">
            아직 등록된 리뷰가 없어요!
          </Text>
          <Text as="p" variant="md-regular" className="text-text-subtle">
            가장 먼저 리뷰를 등록해보세요
          </Text>
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col gap-24 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-16">
              <Text as="p" variant="rating-score" className="text-text-primary">
                {formatRating(detail.rating)}
              </Text>
              <div className="flex flex-col gap-2">
                <ReviewStarRating value={Math.round(detail.rating)} size="sm" />
                <Text as="p" variant="md-regular" className="text-text-muted">
                  {detail.reviewCount}개의 리뷰
                </Text>
              </div>
            </div>

            {hasDistribution ? (
              <ul
                className="flex w-full max-w-[284px] flex-col gap-4 md:shrink-0"
                aria-label="별점 분포"
              >
                {detail.ratingDistribution.map((item) => (
                  <li key={item.score} className="flex items-center gap-16">
                    <Text
                      as="span"
                      variant={item.count > 0 ? "md-bold" : "md-medium"}
                      className="text-text-tertiary w-36 shrink-0"
                    >
                      {item.score}점
                    </Text>
                    <div
                      className="bg-rating-track relative h-8 w-full max-w-[180px] overflow-hidden rounded-full"
                      role="img"
                      aria-label={`${item.score}점 ${item.count}개`}
                    >
                      <div
                        className="bg-rating-fill absolute inset-y-0 left-0 rounded-full"
                        // 동적 비율(리뷰 분포) — 토큰 고정 width로 표현 불가
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <Text
                      as="span"
                      variant={item.count > 0 ? "md-bold" : "md-medium"}
                      className="text-rating-count w-36 shrink-0"
                    >
                      {item.count}
                    </Text>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {hasReviews ? (
            <>
              <ul className="flex w-full flex-col">
                {detail.reviews.map((review, index) => (
                  <li
                    key={review.id}
                    className={cn(
                      "border-border-subtle py-20 md:py-24",
                      index < detail.reviews.length - 1 && "border-b",
                    )}
                  >
                    <ReviewItem review={review} />
                  </li>
                ))}
              </ul>

              {detail.reviewPageCount > 1 ? (
                <Pagination
                  currentPage={currentPage}
                  pageCount={detail.reviewPageCount}
                  onPageChange={onPageChange}
                  className="self-center"
                />
              ) : null}
            </>
          ) : null}
        </>
      )}
    </section>
  );
}

function ReviewItem({ review }: { review: MoverDetailReview }) {
  return (
    <article className="flex w-full flex-col gap-16 md:gap-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-12">
          <Text
            as="p"
            variant={{ base: "md-regular", md: "2lg-regular" }}
            className="text-text-secondary"
          >
            {review.authorMasked}
          </Text>
          <span className="bg-border-subtle h-12 w-px" aria-hidden="true" />
          <Text
            as="p"
            variant={{ base: "md-regular", md: "2lg-regular" }}
            className="text-text-muted"
          >
            {review.createdAt}
          </Text>
        </div>
        <ReviewStarRating value={review.rating} size="sm" />
      </div>
      <Text
        as="p"
        variant={{ base: "md-regular", md: "2lg-regular" }}
        className="text-text-primary whitespace-pre-line"
      >
        {review.content}
      </Text>
    </article>
  );
}
