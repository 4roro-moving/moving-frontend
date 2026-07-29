"use client";

import { useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import { MoverDetailReviewsSkeleton } from "@/components/mover/detail/MoverDetailPageSkeleton";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { useMoverReviews } from "@/hooks/useMoverReviews";
import { MOVER_REVIEW_PAGE_LIMIT } from "@/lib/api/movers";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import { formatKoreanDateLong, formatRating } from "@/lib/utils/estimateFormat";
import type { MoverDetail, MoverDetailReview } from "@/types/moverDetail";
import type { MoverReviewItem } from "@/types/review";

interface MoverDetailReviewsProps {
  moverId: string;
  rating: number;
  reviewCount: number;
  ratingDistribution: MoverDetail["ratingDistribution"];
}

function mapMoverReviewItemToDetailReview(item: MoverReviewItem): MoverDetailReview {
  return {
    id: String(item.id),
    authorMasked: item.customer.displayName,
    createdAt: formatKoreanDateLong(item.createdAt),
    rating: item.rating,
    content: item.content,
  };
}

export default function MoverDetailReviews({
  moverId,
  rating,
  reviewCount,
  ratingDistribution,
}: MoverDetailReviewsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error, isFetching, refetch } = useMoverReviews(moverId, {
    page: currentPage,
  });

  const reviews = data?.reviews.map(mapMoverReviewItemToDetailReview) ?? [];
  const pageCount = Math.max(1, data?.pagination.totalPages ?? 0);
  const hasReviews = reviews.length > 0;

  // 초기 조회 시에만 스켈레톤 노출 (페이지 전환 중에는 keepPreviousData로 이전 페이지 데이터가 보임)
  const isInitialLoading = isLoading && data === undefined;
  const shouldShowError = isError && !hasReviews;
  const shouldShowReviews = hasReviews;
  const shouldShowPagination = pageCount > 1 && hasReviews;

  // TODO: 시드 데이터 오류로 인한 임시 조치, 시드 데이터 수정 후 삭제 예정
  const isEmpty =
    reviewCount === 0 ||
    (!isLoading && !isError && data !== undefined && data.pagination.totalCount === 0);
  const hasDistribution = ratingDistribution.some((item) => item.count > 0);

  const maxCount = Math.max(...ratingDistribution.map((item) => item.count), 1);
  // 동점이면 더 높은 점수(5→1 순) 하나만 강조
  const topScore =
    ratingDistribution.find((item) => item.count === maxCount && item.count > 0)?.score ?? null;

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
                {formatRating(rating)}
              </Text>
              <div className="flex flex-col gap-2">
                <ReviewStarRating value={Math.round(rating)} size="sm" />
                <Text as="p" variant="md-regular" className="text-text-muted">
                  {reviewCount}개의 리뷰
                </Text>
              </div>
            </div>

            {hasDistribution ? (
              <ul
                className="flex w-full max-w-[284px] flex-col gap-4 md:shrink-0"
                aria-label="별점 분포"
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

          {!isError && isInitialLoading ? (
            <MoverDetailReviewsSkeleton count={MOVER_REVIEW_PAGE_LIMIT} />
          ) : null}

          {shouldShowError ? (
            <div className="flex w-full flex-col items-center gap-12 py-24 text-center">
              <Text as="p" variant="md-regular" className="text-text-muted">
                {getApiErrorMessage(error, "리뷰를 불러오지 못했습니다.")}
              </Text>
              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                className="text-text-brand focus-visible:ring-border-brand rounded-4 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                <Text as="span" variant="md-semibold" className="text-text-brand">
                  다시 시도
                </Text>
              </button>
            </div>
          ) : null}

          {shouldShowReviews ? (
            <ul className="flex w-full flex-col" aria-busy={isFetching}>
              {reviews.map((review, index) => (
                <li
                  key={review.id}
                  className={cn(
                    "border-border-subtle py-20 md:py-24",
                    index < reviews.length - 1 && "border-b",
                  )}
                >
                  <ReviewItem review={review} />
                </li>
              ))}
            </ul>
          ) : null}

          {shouldShowPagination ? (
            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={setCurrentPage}
              className="self-center"
            />
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
