"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { MoverDetailReviewsSkeleton } from "@/components/mover/detail/MoverDetailPageSkeleton";
import MoverRatingSummary from "@/components/mover/detail/MoverRatingSummary";
import MoverReviewList from "@/components/mover/detail/MoverReviewList";
import { useMoverReviews } from "@/hooks/useMoverReviews";
import { useListLoadingState } from "@/hooks/queries/useListLoadingState";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getMoverReviews, MOVER_REVIEW_PAGE_LIMIT } from "@/lib/api/movers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MoverDetail } from "@/types/moverDetail";

interface MoverDetailReviewsProps {
  moverId: string;
  rating: number;
  reviewCount: number;
  ratingDistribution: MoverDetail["ratingDistribution"];
  canReport: boolean;
  currentUserId?: string;
}

/** 현재 리뷰 목록이 표시된 뒤 다음 페이지를 미리 요청하기까지의 대기 시간 */
const NEXT_REVIEW_PAGE_PREFETCH_DELAY_MS = 300;

/**
 * 기사님 상세 — 리뷰 요약·분포·목록
 * // 2026.07.30 정슬기 - [수정] MoverReviewItem 직접 사용, EstimatesQueryStatus·빈 상태 정리
 */
export default function MoverDetailReviews({
  moverId,
  rating,
  reviewCount,
  ratingDistribution,
  canReport,
  currentUserId,
}: MoverDetailReviewsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();
  const query = useMoverReviews(moverId, { page: currentPage });
  const { data, isLoading, isError, error, isFetching, refetch } = query;
  const { isPreviousDataLoading } = useListLoadingState(query);

  const reviews = data?.reviews ?? [];
  const pageCount = Math.max(1, data?.pagination.totalPages ?? 0);
  const hasReviews = reviews.length > 0;

  // 초기 조회 시에만 스켈레톤 노출 (페이지 전환 중에는 keepPreviousData로 이전 페이지 데이터가 보임)
  const isInitialLoading = isLoading && data === undefined;

  const shouldShowError = isError && !hasReviews;

  const shouldShowReviews = hasReviews;

  const shouldShowPagination = pageCount > 1 && hasReviews;

  // 목록 응답 기준으로만 empty 판정 (상세 reviewCount와 목록 캐시 시점 불일치 가능)
  // 2026.07.30 정슬기 - [수정] reviewCount OR 조건 제거 → pagination.totalCount만 사용
  const isEmpty = !isLoading && !isError && data !== undefined && data.pagination.totalCount === 0;

  // 헤더 개수도 목록 totalCount와 맞춤 (없을 때만 상세 reviewCount fallback)
  // 2026.07.30 정슬기 - [수정]
  const displayedReviewCount = data?.pagination.totalCount ?? reviewCount;

  const prefetchReviewPage = useCallback(
    (page: number) => {
      void queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.REVIEWS.BY_MOVER(moverId, page, MOVER_REVIEW_PAGE_LIMIT),
        queryFn: () =>
          getMoverReviews(moverId, {
            page,
            limit: MOVER_REVIEW_PAGE_LIMIT,
          }),
      });
    },
    [moverId, queryClient],
  );

  useEffect(() => {
    if (!data?.pagination.hasNext || data.pagination.page !== currentPage) {
      return;
    }

    const timer = window.setTimeout(() => {
      prefetchReviewPage(currentPage + 1);
    }, NEXT_REVIEW_PAGE_PREFETCH_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [currentPage, data?.pagination.hasNext, data?.pagination.page, prefetchReviewPage]);

  return (
    <section className="flex w-full flex-col gap-24 md:gap-32" aria-labelledby="mover-reviews">
      <Text
        as="h2"
        id="mover-reviews"
        variant={{
          base: "lg-semibold",
          md: "xl-semibold",
        }}
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
          <MoverRatingSummary
            rating={rating}
            reviewCount={displayedReviewCount}
            ratingDistribution={ratingDistribution}
          />

          {!isError && isInitialLoading ? (
            <MoverDetailReviewsSkeleton count={MOVER_REVIEW_PAGE_LIMIT} />
          ) : null}

          {shouldShowError ? (
            <EstimatesQueryStatus
              message={getApiErrorMessage(error, "리뷰를 불러오지 못했습니다.")}
              actionLabel="다시 시도"
              onAction={() => {
                void refetch();
              }}
            />
          ) : null}

          {shouldShowReviews ? (
            <MoverReviewList
              reviews={reviews}
              isFetching={isFetching}
              isPreviousDataLoading={isPreviousDataLoading}
              canReport={canReport}
              currentUserId={currentUserId}
            />
          ) : null}

          {shouldShowPagination ? (
            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={setCurrentPage}
              onPagePrefetch={prefetchReviewPage}
              className="self-center"
            />
          ) : null}
        </>
      )}
    </section>
  );
}
