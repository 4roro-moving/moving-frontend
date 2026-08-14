"use client";

import { useMemo, useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import Toast from "@/components/common/Toast/Toast";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ReviewCardSkeleton from "@/components/review/ReviewCardSkeleton";
import ReviewEmptyState from "@/components/review/ReviewEmptyState";
import ReviewPageFrame from "@/components/review/ReviewPageFrame";
import ReviewWriteModal from "@/components/review/ReviewWriteModal";
import WritableReviewCard from "@/components/review/WritableReviewCard";
import { useReviewPagination } from "@/hooks/useReviewPagination";
import { useReviewableEstimates } from "@/hooks/useReviewableEstimates";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  REVIEW_CREATED_MESSAGE,
  REVIEW_LIST_ERROR_MESSAGE,
  REVIEW_PAGE_LIMIT,
  REVIEW_RETRY_LABEL,
} from "@/lib/constants/reviewConstants";
import { buildClientPagination } from "@/lib/utils/pagination";
import type { ReviewableEstimateItem } from "@/types/review";

export default function WritableReviewsPageClient() {
  const { data, isLoading, isError, error, refetch, isFetching } = useReviewableEstimates();

  const [selectedItem, setSelectedItem] = useState<ReviewableEstimateItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalCount = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / REVIEW_PAGE_LIMIT));

  const { currentPage, handlePageChange } = useReviewPagination({
    totalPages,
    canCorrectPage: data !== undefined && totalCount > 0,
  });

  const pagination = useMemo(
    () => buildClientPagination(totalCount, currentPage, REVIEW_PAGE_LIMIT),
    [totalCount, currentPage],
  );

  const pageItems = useMemo(() => {
    if (!data) {
      return [];
    }

    const start = (currentPage - 1) * REVIEW_PAGE_LIMIT;

    return data.slice(start, start + REVIEW_PAGE_LIMIT);
  }, [data, currentPage]);

  const isEmpty = !isLoading && !isError && data !== undefined && data.length === 0;

  const hasList = !isLoading && !isError && data !== undefined && data.length > 0;

  return (
    <ReviewPageFrame title="작성 가능한 리뷰">
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

      {isEmpty ? <ReviewEmptyState variant="writable" /> : null}

      {hasList ? (
        <div className="flex w-full flex-col gap-16 md:gap-24" aria-busy={isFetching}>
          <ul className="flex w-full flex-col gap-16 md:gap-20 xl:gap-24">
            {pageItems.map((item) => (
              <li key={item.estimateId}>
                <WritableReviewCard item={item} onWriteClick={setSelectedItem} />
              </li>
            ))}
          </ul>

          {pagination.totalPages > 1 ? (
            <div className="pt-8 md:pt-16">
              <Pagination
                currentPage={currentPage}
                pageCount={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <ReviewWriteModal
        open={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSuccess={() => setToastMessage(REVIEW_CREATED_MESSAGE)}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </ReviewPageFrame>
  );
}
