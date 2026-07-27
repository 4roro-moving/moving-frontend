"use client";

import { useMemo, useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import Toast from "@/components/common/Toast/Toast";
import ReceivedEstimatesStatus from "@/components/estimate/received/ReceivedEstimatesStatus";
import ReviewEmptyState from "@/components/review/ReviewEmptyState";
import ReviewPageFrame from "@/components/review/ReviewPageFrame";
import ReviewWriteModal from "@/components/review/ReviewWriteModal";
import WritableReviewCard from "@/components/review/WritableReviewCard";
import { useReviewableEstimates } from "@/hooks/useReviewableEstimates";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { REVIEWABLE_PAGE_LIMIT } from "@/lib/api/reviews";
import { buildMockPagination } from "@/lib/mocks/pagination";
import type { ReviewableEstimateItem } from "@/types/review";

// 2026.07.27 정슬기 - [추가] 작성 가능 리뷰 목록 Page Client
// 2026.07.27 정슬기 - [수정] 페이지 보정을 파생값으로 처리 (render-phase setState 제거)
export default function WritableReviewsPageClient() {
  const { data, isLoading, isError, error, refetch, isFetching } = useReviewableEstimates();
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ReviewableEstimateItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalCount = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / REVIEWABLE_PAGE_LIMIT) || 1);
  const currentPage = totalCount === 0 ? 1 : Math.min(Math.max(1, page), totalPages);

  const pagination = useMemo(
    () => buildMockPagination(totalCount, currentPage, REVIEWABLE_PAGE_LIMIT),
    [totalCount, currentPage],
  );

  const pageItems = useMemo(() => {
    if (!data) return [];
    const start = (currentPage - 1) * REVIEWABLE_PAGE_LIMIT;
    return data.slice(start, start + REVIEWABLE_PAGE_LIMIT);
  }, [data, currentPage]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ReviewPageFrame title="작성 가능한 리뷰">
      {isLoading ? (
        <ReceivedEstimatesStatus message="작성 가능한 리뷰를 불러오는 중입니다." />
      ) : null}

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

      {!isLoading && !isError && data && data.length === 0 ? (
        <ReviewEmptyState variant="writable" />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <div className="flex w-full flex-col gap-16 md:gap-24" aria-busy={isFetching}>
          <ul className="flex w-full flex-col gap-16 md:gap-20 lg:gap-24">
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
        onSuccess={() => setToastMessage("리뷰가 등록되었습니다.")}
        onError={setToastMessage}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </ReviewPageFrame>
  );
}
