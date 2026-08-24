"use client";

import { type ReactNode, useState } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import MoverCard from "@/components/mover/MoverCard";
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

const MOVERS_EMPTY_DESCRIPTION = (
  <>
    검색 결과가 없어요.
    <br />
    다른 검색어나 필터로 다시 찾아보세요.
  </>
);

export function MoversList({ filters, initialMovers }: MoversListProps) {
  const { movers, isInitialLoading, isFilterFetching, query } = useMovers(filters);
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refetch } = query;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isShowingInitialMovers = isInitialLoading && initialMovers.length > 0;
  const displayedMovers = isShowingInitialMovers ? initialMovers : movers;

  const sentinelRef = useMoversInfiniteScroll({
    enabled: !isInitialLoading && !isFilterFetching && !query.isError && displayedMovers.length > 0,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  let content: ReactNode;

  if (query.isError && !isShowingInitialMovers) {
    content = (
      <MoversErrorPanel
        title="불러오지 못했어요"
        description="기사님 목록을 가져오는 중 문제가 발생했습니다."
        actionLabel="다시 시도"
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
        description={MOVERS_EMPTY_DESCRIPTION}
      />
    );
  } else {
    content = (
      <div
        className={cn("flex flex-col gap-20", isFilterFetching && PREVIOUS_DATA_LOADING_CLASS_NAME)}
        aria-busy={isFilterFetching}
      >
        {isFilterFetching ? (
          <span className="sr-only" role="status">
            기사님 목록을 불러오는 중이에요
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
              기사님을 더 불러오는 중이에요
            </Text>
          </div>
        ) : null}

        {/* 재시도 중에는 스켈레톤만 보여 패널·스켈레톤이 겹치지 않게 함 */}
        {isFetchNextPageError && !isFetchingNextPage ? (
          <MoversErrorPanel
            title="더 불러오지 못했어요"
            description="다음 기사님 목록을 가져오는 중 문제가 발생했습니다."
            actionLabel="다시 시도"
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
