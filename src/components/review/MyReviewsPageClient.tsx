"use client";

import { useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import ReceivedEstimatesStatus from "@/components/estimate/received/ReceivedEstimatesStatus";
import MyReviewCard from "@/components/review/MyReviewCard";
import ReviewEmptyState from "@/components/review/ReviewEmptyState";
import ReviewPageFrame from "@/components/review/ReviewPageFrame";
import { useMyReviews } from "@/hooks/useMyReviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { MY_REVIEW_PAGE_LIMIT } from "@/lib/api/reviews";

// 2026.07.27 정슬기 - [추가] 내가 작성한 리뷰 목록 Page Client
// 2026.07.27 정슬기 - [수정] 페이지 범위 보정은 service/mock에서 처리, UI는 파생값만 사용
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
  // 응답 pagination.page를 우선해 표시 (service가 보정한 페이지)
  const currentPage = pagination?.page ?? Math.min(Math.max(1, page), totalPages);
  const isEmpty = !isLoading && !isError && Boolean(pagination) && totalCount === 0;
  const hasList = !isLoading && !isError && reviews.length > 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ReviewPageFrame title="내가 작성한 리뷰">
      {isLoading ? <ReceivedEstimatesStatus message="작성한 리뷰를 불러오는 중입니다." /> : null}

      {isError ? (
        <ReceivedEstimatesStatus
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
