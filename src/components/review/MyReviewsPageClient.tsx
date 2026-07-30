"use client";

import { useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import MyReviewCard from "@/components/review/MyReviewCard";
import ReviewEmptyState from "@/components/review/ReviewEmptyState";
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
  const { data, isLoading, isError, error, refetch, isFetching } = useMyReviews({
    page,
    limit: MY_REVIEW_PAGE_LIMIT,
  });

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;
  const totalCount = pagination?.totalCount ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  // 범위 밖 page → 마지막 페이지로 상태 보정 (ME(last, limit) 키로 재조회)
  // React: props/서버 응답 기반 상태 조정은 렌더 중 setState 허용
  if (pagination && pagination.totalCount > 0 && page > totalPages) {
    setPage(totalPages);
  }

  const currentPage = Math.min(Math.max(1, page), totalPages);
  const isEmpty = !isLoading && !isError && Boolean(pagination) && totalCount === 0;
  const hasList = !isLoading && !isError && reviews.length > 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ReviewPageFrame title="내가 작성한 리뷰">
      {isLoading ? <EstimatesQueryStatus message="작성한 리뷰를 불러오는 중입니다." /> : null}

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
          <ul className="flex w-full flex-col gap-16 md:gap-20 lg:gap-24">
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
