"use client";

import { useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { useMoverReviews } from "@/hooks/useMoverReviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { MoverDetail } from "@/types/moverDetail";

import MoverMyPageRatingDistribution from "./MoverMyPageRatingDistribution";
import MoverMyPageReviewItem from "./MoverMyPageReviewItem";

interface MoverMyPageReviewsProps {
  moverId: string;
  rating: number;
  reviewCount: number;
  ratingDistribution: MoverDetail["ratingDistribution"];
}

function ReviewListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className={cn("border-border-subtle py-20 md:py-24", index < 2 && "border-b")}
        >
          <div className="bg-background-subtle rounded-100 mb-10 h-18 w-40 animate-pulse" />
          <div className="bg-background-subtle rounded-16 h-44 w-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function MoverMyPageReviewsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-24 md:gap-32 xl:gap-40">
      <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
        <div className="bg-background-subtle rounded-16 h-48 w-44 animate-pulse" />
        <div className="max-w-mypage-rating-width flex w-full flex-col gap-4">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="bg-background-subtle rounded-100 h-24 w-full animate-pulse"
            />
          ))}
        </div>
      </div>
      <ReviewListSkeleton />
    </div>
  );
}

export default function MoverMyPageReviews({
  moverId,
  rating,
  reviewCount,
  ratingDistribution,
}: MoverMyPageReviewsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error, isFetching, refetch } = useMoverReviews(moverId, {
    page: currentPage,
  });

  const reviews = data?.reviews ?? [];
  const pageCount = Math.max(1, data?.pagination.totalPages ?? 0);
  const totalCount = data?.pagination.totalCount ?? reviewCount;
  const isEmpty = !isLoading && !isError && data !== undefined && totalCount === 0;
  const shouldShowError = isError && reviews.length === 0;

  return (
    <section
      className="flex w-full flex-col gap-24 md:gap-32 xl:gap-40"
      aria-labelledby="mover-reviews"
    >
      <div className="flex w-full flex-col gap-8 md:gap-16">
        <Text
          as="h2"
          id="mover-reviews"
          variant={{ base: "lg-semibold", md: "xl-semibold" }}
          className="text-text-secondary"
        >
          리뷰
        </Text>

        {!isEmpty ? (
          <div className="xl:w-mypage-review-summary-width flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-18">
              <Text as="p" variant="rating-score" className="text-text-secondary">
                {formatRating(rating)}
              </Text>
              <div className="flex flex-col">
                <ReviewStarRating value={Math.round(rating)} size="sm" label="평균 별점" />
                <Text as="p" variant="md-regular" className="text-text-muted">
                  {totalCount}개의 리뷰
                </Text>
              </div>
            </div>

            <MoverMyPageRatingDistribution ratingDistribution={ratingDistribution} />
          </div>
        ) : null}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Text as="p" variant="lg-semibold" className="text-text-primary">
            아직 등록된 리뷰가 없어요!
          </Text>
          <Text as="p" variant="md-regular" className="text-text-subtle">
            가장 먼저 리뷰를 등록해보세요
          </Text>
        </div>
      ) : null}

      {isLoading && !data ? <ReviewListSkeleton /> : null}

      {shouldShowError ? (
        <EstimatesQueryStatus
          message={getApiErrorMessage(error, "리뷰를 불러오지 못했습니다.")}
          actionLabel="다시 시도"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {reviews.length > 0 ? (
        <ul className="flex flex-col" aria-busy={isFetching}>
          {reviews.map((review, index) => (
            <MoverMyPageReviewItem
              key={review.id}
              review={review}
              hasDivider={index < reviews.length - 1}
            />
          ))}
        </ul>
      ) : null}

      {pageCount > 1 && reviews.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={setCurrentPage}
          className="self-center"
        />
      ) : null}
    </section>
  );
}
