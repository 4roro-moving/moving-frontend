"use client";

import Pagination from "@/components/common/Pagination/Pagination";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import MyReviewCard from "@/components/review/MyReviewCard";
import ReviewCardSkeleton from "@/components/review/ReviewCardSkeleton";
import ReviewEmptyState from "@/components/review/ReviewEmptyState";
import ReviewPageFrame from "@/components/review/ReviewPageFrame";
import { useMyReviews } from "@/hooks/useMyReviews";
import { useListLoadingState } from "@/hooks/queries/useListLoadingState";
import { useReviewPagination } from "@/hooks/useReviewPagination";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { cn } from "@/lib/utils/cn";
import {
  REVIEW_LIST_ERROR_MESSAGE,
  REVIEW_PAGE_LIMIT,
  REVIEW_RETRY_LABEL,
} from "@/lib/constants/reviewConstants";

export default function MyReviewsPageClient() {
  const { page, currentPage, setPage, handlePageChange } = useReviewPagination({
    totalPages: Number.MAX_SAFE_INTEGER,
    canCorrectPage: false,
  });

  const query = useMyReviews({
    page,
    limit: REVIEW_PAGE_LIMIT,
  });
  const { data, isLoading, isError, error, refetch, isFetching, isPlaceholderData } = query;
  const { isPreviousDataLoading } = useListLoadingState(query);

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;
  const totalCount = pagination?.totalCount ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  if (!isPlaceholderData && pagination && totalCount > 0 && page > totalPages) {
    setPage(totalPages);
  }

  const renderedCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const isEmpty = !isLoading && !isError && Boolean(pagination) && totalCount === 0;

  const hasList = !isLoading && !isError && reviews.length > 0;

  return (
    <ReviewPageFrame title="내가 작성한 리뷰">
      {isLoading ? <ReviewCardSkeleton /> : null}

      {isError ? (
        <EstimatesQueryStatus
          message={getApiErrorMessage(error, REVIEW_LIST_ERROR_MESSAGE)}
          actionLabel={REVIEW_RETRY_LABEL}
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {isEmpty ? <ReviewEmptyState variant="my" /> : null}

      {hasList && pagination ? (
        <div
          className={cn(
            "flex w-full flex-col gap-16 md:gap-24",
            isPreviousDataLoading && PREVIOUS_DATA_LOADING_CLASS_NAME,
          )}
          aria-busy={isFetching}
        >
          {isPreviousDataLoading ? (
            <span className="sr-only" role="status">
              내가 작성한 리뷰 목록을 불러오는 중이에요
            </span>
          ) : null}
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
                currentPage={renderedCurrentPage}
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
