"use client";

import { useTranslations } from "next-intl";

import { type ReactNode } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ResidenceReviewCard from "@/components/residence-review/ResidenceReviewCard";
import ResidenceReviewCardSkeletonList from "@/components/residence-review/ResidenceReviewCardSkeletonList";
import { useMoversInfiniteScroll } from "@/hooks/useMoversInfiniteScroll";
import { useResidenceReviews } from "@/hooks/residence-review/useResidenceReviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { cn } from "@/lib/utils/cn";
import type { ResidenceReviewSearchParamsState } from "@/lib/utils/residenceReviewSearchParams";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewListProps {
  filters: ResidenceReviewSearchParamsState;
  onSelect?: (review: PublicResidenceReview) => void;
  onPrefetch?: (review: PublicResidenceReview) => void;
}

const ResidenceReviewList = ({ filters, onSelect, onPrefetch }: ResidenceReviewListProps) => {
  const t = useTranslations("residenceReview");
  const tCommon = useTranslations("common");
  const emptyDescription = (
    <>
      {tCommon("emptyState.noResultsTitle")}
      <br />
      {tCommon("emptyState.noResultsDescription")}
    </>
  );
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
        message={getApiErrorMessage(query.error, t("listLoadFailed"))}
        actionLabel={t("retry")}
        onAction={() => {
          void refetch();
        }}
        actionBusy={query.isFetching}
      />
    );
  } else if (reviews.length === 0) {
    content = (
      <EmptyState size="sm" imageSrc="/images/empty/character.png" description={emptyDescription} />
    );
  } else {
    content = (
      <div
        className={cn("flex flex-col gap-20", isFilterFetching && PREVIOUS_DATA_LOADING_CLASS_NAME)}
        aria-busy={isFilterFetching}
      >
        {isFilterFetching ? (
          <span className="sr-only" role="status">
            {t("listLoading")}
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
              {t("loadMoreLoading")}
            </Text>
          </div>
        ) : null}

        {isFetchNextPageError && !isFetchingNextPage ? (
          <EstimatesQueryStatus
            className="py-24 md:py-32"
            message={t("loadMoreFailed")}
            actionLabel={t("retry")}
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
