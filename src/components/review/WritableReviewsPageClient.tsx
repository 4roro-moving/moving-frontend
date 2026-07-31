"use client";

import { useMemo, useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import Toast from "@/components/common/Toast/Toast";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ReviewEmptyState from "@/components/review/ReviewEmptyState";
import ReviewPageFrame from "@/components/review/ReviewPageFrame";
import ReviewWriteModal from "@/components/review/ReviewWriteModal";
import WritableReviewCard from "@/components/review/WritableReviewCard";
import { useReviewableEstimates } from "@/hooks/useReviewableEstimates";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { REVIEWABLE_PAGE_LIMIT } from "@/lib/api/reviews";
import { buildClientPagination } from "@/lib/utils/pagination";
import type { ReviewableEstimateItem } from "@/types/review";

/**
 * 작성 가능 리뷰 목록
 * // 2026.07.27 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] FE 페이지네이션을 client util로 분리
 * // 2026.07.31 정슬기 - [수정] 내 리뷰와 동일하게 page state를 totalPages로 보정
 */
export default function WritableReviewsPageClient() {
  const { data, isLoading, isError, error, refetch, isFetching } = useReviewableEstimates();
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ReviewableEstimateItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalCount = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / REVIEWABLE_PAGE_LIMIT) || 1);

  // 데이터 준비 후 범위 밖 page만 보정 (빈 목록이면 page 변경하지 않음 — 최소 1 유지)
  // React: 응답 기반 상태 조정은 렌더 중 setState 허용 (내 리뷰와 동일)
  if (data !== undefined && totalCount > 0 && page > totalPages) {
    setPage(totalPages);
  }

  // page: 실제 페이지 상태 / currentPage: 렌더용 안전 clamp
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pagination = useMemo(
    () => buildClientPagination(totalCount, currentPage, REVIEWABLE_PAGE_LIMIT),
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
      {isLoading ? <EstimatesQueryStatus message="작성 가능한 리뷰를 불러오는 중입니다." /> : null}

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
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </ReviewPageFrame>
  );
}
