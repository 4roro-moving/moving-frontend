"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import MoverCard from "@/components/mover/MoverCard";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import MoversErrorPanel from "@/components/mover/MoversErrorPanel";
import { useMoversInfiniteScroll } from "@/hooks/useMoversInfiniteScroll";
import { useMovers } from "@/hooks/useMovers";
import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { cn } from "@/lib/utils/cn";
import { type MoversSearchParamsState } from "@/lib/utils/moversSearchParams";
import type { Mover } from "@/types/mover";

interface MoversListProps {
  filters: MoversSearchParamsState;
  /** 인증 상태·사용자별 찜 여부 확인 전 표시할 서버 prefetch 목록 */
  initialMovers: Mover[];
}

/** 초기 로딩 스켈레톤 카드 수 */
const MOVERS_LIST_SKELETON_COUNT = 5;

function areFiltersEqual(first: MoversSearchParamsState, second: MoversSearchParamsState) {
  return (
    first.keyword === second.keyword &&
    first.serviceArea === second.serviceArea &&
    first.moveType === second.moveType &&
    first.sort === second.sort
  );
}

export function MoversList({ filters, initialMovers }: MoversListProps) {
  const t = useTranslations("moverSearch");
  const { movers, isInitialLoading, isFilterFetching, query } = useMovers(filters);
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refetch } = query;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // 첫 진입 전환은 제외하고, 필터 변경 중에만 이전 목록 로딩 상태를 표시한다.
  const [initialFilters] = useState(filters);
  const isShowingInitialMovers = isInitialLoading && initialMovers.length > 0;
  const displayedMovers = isShowingInitialMovers ? initialMovers : movers;
  const isPreviousMoversLoading = isFilterFetching && !areFiltersEqual(filters, initialFilters);

  const sentinelRef = useMoversInfiniteScroll({
    enabled:
      !isInitialLoading && !isPreviousMoversLoading && !query.isError && displayedMovers.length > 0,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  let content: ReactNode;

  if (isInitialLoading && !isShowingInitialMovers) {
    content = (
      <MoverCardSkeletonList
        variant="full"
        count={MOVERS_LIST_SKELETON_COUNT}
        label={t("loading")}
      />
    );
  } else if (query.isError && !isShowingInitialMovers) {
    content = (
      <MoversErrorPanel
        title={t("listErrorTitle")}
        description={t("listErrorDescription")}
        actionLabel={t("retry")}
        isRetrying={query.isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  } else if (displayedMovers.length === 0) {
    content = (
      <EmptyState
        size="sm"
        imageSrc="/images/empty/character.png"
        description={
          <>
            {t("emptyTitle")}
            <br />
            {t("emptyDescription")}
          </>
        }
      />
    );
  } else {
    content = (
      <div
        className={cn(
          "flex flex-col gap-20",
          isPreviousMoversLoading && PREVIOUS_DATA_LOADING_CLASS_NAME,
        )}
        aria-busy={isPreviousMoversLoading}
      >
        {isPreviousMoversLoading ? (
          <span className="sr-only" role="status">
            {t("loading")}
          </span>
        ) : null}
        <ul className="flex flex-col gap-20">
          {displayedMovers.map((mover, index) => (
            <li key={mover.id}>
              <MoverCard
                mover={mover}
                variant="full"
                priorityProfileImage={index === 0}
                onFavoriteError={setToastMessage}
              />
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
              {t("nextLoading")}
            </Text>
          </div>
        ) : null}

        {/* 재시도 중에는 스켈레톤만 보여 패널·스켈레톤이 겹치지 않게 함 */}
        {isFetchNextPageError && !isFetchingNextPage ? (
          <MoversErrorPanel
            title={t("nextErrorTitle")}
            description={t("nextErrorDescription")}
            actionLabel={t("retry")}
            isRetrying={false}
            onRetry={() => {
              void fetchNextPage();
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="scroll-mt-24">
      {content}
      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
