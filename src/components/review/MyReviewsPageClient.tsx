"use client";

import { useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import MyReviewCard from "@/components/review/MyReviewCard";
import ReviewEmptyState from "@/components/review/ReviewEmptyState";
import ReviewCardSkeleton from "@/components/review/ReviewCardSkeleton";
import ReviewPageFrame from "@/components/review/ReviewPageFrame";
import { useMyReviews } from "@/hooks/useMyReviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { MY_REVIEW_PAGE_LIMIT } from "@/lib/api/reviews";

/**
 * 내가 작성한 리뷰 목록 Page Client
 * // 2026.07.27 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] 범위 밖 page는 상태를 totalPages로 보정 후 해당 쿼리 키로 재조회
 */
export default function MyReviewsPageClient() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch, isFetching, isPlaceholderData } = useMyReviews({
    page,
    limit: MY_REVIEW_PAGE_LIMIT,
  });

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;
  const totalCount = pagination?.totalCount ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  // 범위 밖 page → 마지막 페이지로 상태 보정 (ME(last, limit) 키로 재조회)
  // keepPreviousData placeholder의 totalPages로 보정하면 페이지 이동 중 루프가 생길 수 있어
  // 현재 쿼리 응답이 확정된 뒤에만 setPage 합니다.
  // // 2026.07.31 정슬기 - [수정] isPlaceholderData 가드
  if (!isPlaceholderData && pagination && pagination.totalCount > 0 && page > totalPages) {
    setPage(totalPages);
  }

  // 렌더용 안전 clamp (쿼리 키와 별개)
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const isEmpty = !isLoading && !isError && Boolean(pagination) && totalCount === 0;
  const hasList = !isLoading && !isError && reviews.length > 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ReviewPageFrame title="내가 작성한 리뷰">
      {isLoading ? <ReviewCardSkeleton /> : null}

      {isError ? (
        <EstimatesQueryStatus
          message={getApiErrorMessage(
            error,
            "리뷰 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
          )}
          actionLabel="다시 시도"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {isEmpty ? <ReviewEmptyState variant="my" /> : null}

      {hasList && pagination ? (
        <div className="flex w-full flex-col gap-16 md:gap-24" aria-busy={isFetching}>
          <ul className="flex w-full flex-col gap-16 md:gap-20 xl:gap-24">
            {reviews.map((review) => (
              <li key={review.id}>
                <MyReviewCard review={review} />
              </li>
            ))}
          </ul>

          {totalPages > 1 ? (
            <div className="pt-8 md:pt-16">
              <Pagination
                currentPage={currentPage}
                pageCount={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </ReviewPageFrame>
  );
}
