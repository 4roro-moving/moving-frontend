"use client";

import { useEffect, useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { EstimateRequestListSkeleton } from "@/components/estimate/requests/EstimateRequestLoadingSkeletons";
import { ESTIMATE_REQUEST_CANCELED_TOAST_KEY } from "@/components/estimate/requests/estimateRequestCancelToast";
import EstimateRequestsList from "@/components/estimate/requests/EstimateRequestsList";
import { useListLoadingState } from "@/hooks/queries/useListLoadingState";
import { useEstimateRequestList } from "@/hooks/useEstimateRequestList";
import { ESTIMATE_REQUEST_LIST_PAGE_LIMIT } from "@/lib/api/estimateRequests";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import type { EstimateRequestListStatusFilter } from "@/types/estimate";

function readCanceledToastMessage(): string | null {
  try {
    if (sessionStorage.getItem(ESTIMATE_REQUEST_CANCELED_TOAST_KEY) === "1") {
      sessionStorage.removeItem(ESTIMATE_REQUEST_CANCELED_TOAST_KEY);
      return "견적 요청이 취소되었습니다.";
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * 보낸 견적 요청 목록 Page Client
 * // 2026.07.29 정슬기 - [추가]
 * // 2026.07.29 정슬기 - [수정] Empty 시 페이지 py 제거 — EstimatesListEmptyState와 중복 방지
 * // 2026.07.29 정슬기 - [수정] status 필터 연결 (전체 / OPEN / COMPLETED)
 * // 2026.07.30 정슬기 - [수정] EstimatesQueryStatus·필터 전환 placeholder 처리
 * // 2026.08.03 정슬기 - [추가] 취소 성공 Toast (상세 → 목록 이동 후)
 * // 2026.08.04 정슬기 - [수정] sessionStorage Toast를 useEffect에서 소비 (hydration 안전)
 */
export default function EstimateRequestsPageClient() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<EstimateRequestListStatusFilter>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // 마운트 후 비동기로 소비 — 렌더 중 sessionStorage 부작용·hydration mismatch 방지
    const timerId = window.setTimeout(() => {
      setToastMessage(readCanceledToastMessage());
    }, 0);
    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const listStatus = statusFilter === "all" ? undefined : statusFilter;

  const query = useEstimateRequestList({
    page,
    limit: ESTIMATE_REQUEST_LIST_PAGE_LIMIT,
    ...(listStatus !== undefined ? { status: listStatus } : {}),
  });
  const { data, isLoading, isError, error, refetch, isFetching, isPlaceholderData } = query;
  const { isPreviousDataLoading } = useListLoadingState(query);

  const estimateRequests = data?.estimateRequests ?? [];
  const pagination = data?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const currentPage = pagination?.page ?? Math.min(Math.max(1, page), totalPages);
  const hasData = !isLoading && !isError && Boolean(pagination);
  // placeholder(이전 필터) 기준으로 Empty py를 바꾸지 않음
  const isEmpty =
    hasData && pagination != null && !isPlaceholderData && pagination.totalCount === 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusFilterChange = (filter: EstimateRequestListStatusFilter) => {
    setStatusFilter(filter);
    setPage(1);
  };

  return (
    <div
      className={cn(
        "bg-background-default md:bg-background-subtle flex w-full flex-col items-center",
        isEmpty ? "flex-1" : "py-38 md:py-32 xl:py-64",
      )}
    >
      {isLoading ? <EstimateRequestListSkeleton showFilter /> : null}

      {isError ? (
        <EstimatesQueryStatus
          message={getApiErrorMessage(error, "보낸 견적 요청을 불러오지 못했습니다.")}
          actionLabel="다시 시도"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {hasData && pagination ? (
        <EstimateRequestsList
          estimateRequests={estimateRequests}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          isFetching={isFetching}
          isPreviousDataLoading={isPreviousDataLoading}
        />
      ) : null}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
