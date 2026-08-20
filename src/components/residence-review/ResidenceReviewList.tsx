"use client";

import { type ReactNode } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ResidenceReviewCard from "@/components/residence-review/ResidenceReviewCard";
import ResidenceReviewCardSkeletonList from "@/components/residence-review/ResidenceReviewCardSkeletonList";
import { useMoversInfiniteScroll } from "@/hooks/useMoversInfiniteScroll";
import { useResidenceReviews } from "@/hooks/residence-review/useResidenceReviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import type { ResidenceReviewSearchParamsState } from "@/lib/utils/residenceReviewSearchParams";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewListProps {
  filters: ResidenceReviewSearchParamsState;
  onSelect?: (review: PublicResidenceReview) => void;
  onPrefetch?: (review: PublicResidenceReview) => void;
}

const EMPTY_DESCRIPTION = (
  <>
    검색 결과가 없어요.
    <br />
    다른 검색어나 필터로 다시 찾아보세요.
  </>
);

const ResidenceReviewList = ({ filters, onSelect, onPrefetch }: ResidenceReviewListProps) => {
  const { reviews, isInitialLoading, isFilterFetching, query } = useResidenceReviews(filters);
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refetch } = query;

  const sentinelRef = useMoversInfiniteScroll({
    enabled: !isInitialLoading && !isFilterFetching && !query.isError && reviews.length > 0,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  let content: ReactNode;

  if (isInitialLoading) {
    content = <ResidenceReviewCardSkeletonList />;
  } else if (query.isError && reviews.length === 0) {
    content = (
      <EstimatesQueryStatus
        message={getApiErrorMessage(
          query.error,
          "거주 후기 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        )}
        actionLabel="다시 시도"
        onAction={() => {
          void refetch();
        }}
        actionBusy={query.isFetching}
      />
    );
  } else if (reviews.length === 0) {
    content = (
      <EmptyState
        size="sm"
        imageSrc="/images/empty/character.png"
        description={EMPTY_DESCRIPTION}
      />
    );
  } else {
    content = (
      <div
        className={cn("flex flex-col gap-20", isFilterFetching && "opacity-60")}
        aria-busy={isFilterFetching}
      >
        {isFilterFetching ? (
          <span className="sr-only" role="status">
            후기 목록을 불러오는 중이에요
          </span>
        ) : null}
        <ul className="flex flex-col gap-20">
          {reviews.map((review) => (
            <li key={review.id}>
              <ResidenceReviewCard review={review} onSelect={onSelect} onPrefetch={onPrefetch} />
            </li>
          ))}
        </ul>

        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

        {isFetchingNextPage ? (
          <div
            className="flex items-center justify-center gap-8 py-12"
            role="status"
            aria-live="polite"
          >
            <span
              className="border-border-brand size-20 animate-spin rounded-full border-2 border-t-transparent"
              aria-hidden="true"
            />
            <Text as="p" variant="sm-medium" className="text-text-muted">
              후기를 더 불러오는 중이에요
            </Text>
          </div>
        ) : null}

        {isFetchNextPageError && !isFetchingNextPage ? (
          <EstimatesQueryStatus
            className="py-24 md:py-32"
            message="다음 후기를 불러오지 못했습니다."
            actionLabel="다시 시도"
            onAction={() => {
              void fetchNextPage();
            }}
          />
        ) : null}
      </div>
    );
  }

  return <div className="scroll-mt-24">{content}</div>;
};

export default ResidenceReviewList;
