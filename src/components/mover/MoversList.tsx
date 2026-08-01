"use client";

import { useState } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import Toast from "@/components/common/Toast/Toast";
import MoverCard from "@/components/mover/MoverCard";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import MoversErrorPanel from "@/components/mover/MoversErrorPanel";
import { useMoversInfiniteScroll } from "@/hooks/useMoversInfiniteScroll";
import { useMovers } from "@/hooks/useMovers";
import type { MoversSearchParamsState } from "@/lib/utils/moversSearchParams";
import { useAuthStore } from "@/stores/useAuthStore";

interface MoversListProps {
  filters: MoversSearchParamsState;
}

const MOVERS_EMPTY_DESCRIPTION = (
  <>
    검색 결과가 없어요.
    <br />
    다른 검색어나 필터로 다시 찾아보세요.
  </>
);

/** 초기 로딩 스켈레톤 카드 수 */
const MOVERS_LIST_SKELETON_COUNT = 3;
/** 다음 페이지 fetch 중 하단 스켈레톤 카드 수 */
const MOVERS_NEXT_PAGE_SKELETON_COUNT = 2;

export function MoversList({ filters }: MoversListProps) {
  const { movers, query } = useMovers(filters);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthPending = !hasHydrated || isCheckingAuth;
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refetch } = query;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sentinelRef = useMoversInfiniteScroll({
    enabled: !isAuthPending && !query.isPending && !query.isError && movers.length > 0,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  if (isAuthPending || query.isPending) {
    return (
      <MoverCardSkeletonList
        variant="full"
        count={MOVERS_LIST_SKELETON_COUNT}
        label="기사님 목록을 불러오는 중"
      />
    );
  }

  if (query.isError) {
    return (
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
  }

  if (movers.length === 0) {
    return (
      <EmptyState
        size="sm"
        imageSrc="/images/empty/character.png"
        description={MOVERS_EMPTY_DESCRIPTION}
      />
    );
  }

  return (
    <div className="flex flex-col gap-20">
      <ul className="flex flex-col gap-20">
        {movers.map((mover) => (
          <li key={mover.id}>
            <MoverCard mover={mover} variant="full" onFavoriteError={setToastMessage} />
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

      {isFetchingNextPage ? (
        <MoverCardSkeletonList
          variant="full"
          count={MOVERS_NEXT_PAGE_SKELETON_COUNT}
          label="다음 기사님 목록을 불러오는 중"
        />
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

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
