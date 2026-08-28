"use client";

import { useTranslations } from "next-intl";
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useMoversInfiniteScroll } from "@/hooks/useMoversInfiniteScroll";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { cn } from "@/lib/utils/cn";
import type { ApiError } from "@/types/api";

interface GiveawayInfiniteListChromeProps<TPage> {
  itemCount: number;
  isInitialLoading: boolean;
  isFilterFetching: boolean;
  query: UseInfiniteQueryResult<InfiniteData<TPage>, ApiError>;
  loadingFallback: ReactNode;
  emptyFallback: ReactNode;
  initialErrorFallback: string;
  fetchingStatusLabel: string;
  nextPageLoadingLabel: string;
  nextPageErrorMessage: string;
  children: ReactNode;
}

const GiveawayInfiniteListChrome = <TPage,>({
  itemCount,
  isInitialLoading,
  isFilterFetching,
  query,
  loadingFallback,
  emptyFallback,
  initialErrorFallback,
  fetchingStatusLabel,
  nextPageLoadingLabel,
  nextPageErrorMessage,
  children,
}: GiveawayInfiniteListChromeProps<TPage>) => {
  const t = useTranslations("giveaway");
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refetch } = query;

  const sentinelRef = useMoversInfiniteScroll({
    enabled: !isInitialLoading && !isFilterFetching && !query.isError && itemCount > 0,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  let content: ReactNode;

  if (isInitialLoading) {
    content = loadingFallback;
  } else if (query.isError && itemCount === 0) {
    content = (
      <EstimatesQueryStatus
        message={getApiErrorMessage(query.error, initialErrorFallback)}
        actionLabel={t("retry")}
        onAction={() => {
          void refetch();
        }}
        actionBusy={query.isFetching}
      />
    );
  } else if (itemCount === 0) {
    content = emptyFallback;
  } else {
    content = (
      <div
        className={cn("flex flex-col gap-20", isFilterFetching && PREVIOUS_DATA_LOADING_CLASS_NAME)}
        aria-busy={isFilterFetching}
      >
        {isFilterFetching ? (
          <span className="sr-only" role="status">
            {fetchingStatusLabel}
          </span>
        ) : null}
        {children}

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
              {nextPageLoadingLabel}
            </Text>
          </div>
        ) : null}

        {isFetchNextPageError && !isFetchingNextPage ? (
          <EstimatesQueryStatus
            className="py-24 md:py-32"
            message={nextPageErrorMessage}
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

export default GiveawayInfiniteListChrome;
