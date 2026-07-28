"use client";

import { useEffect, useRef, useState } from "react";

import Button from "@/components/common/Button/Button";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import MoverCard from "@/components/mover/MoverCard";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import { useMovers } from "@/hooks/useMovers";
import { mapMoverListItemToMover } from "@/lib/utils/mapMover";
import type { MoversSearchParamsState } from "@/lib/utils/moversSearchParams";

interface MoversListProps {
  filters: MoversSearchParamsState;
}

interface MoversListErrorPanelProps {
  title: string;
  description: string;
  actionLabel: string;
  isRetrying: boolean;
  onRetry: () => void;
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

function MoversListErrorPanel({
  title,
  description,
  actionLabel,
  isRetrying,
  onRetry,
}: MoversListErrorPanelProps) {
  return (
    <div className="flex w-full flex-col items-center gap-16 py-40 text-center">
      <div className="flex flex-col gap-8">
        <Text as="p" variant="lg-semibold" className="text-text-secondary">
          {title}
        </Text>
        <Text as="p" variant="md-regular" className="text-text-muted">
          {description}
        </Text>
      </div>
      <Button
        type="button"
        variant="outline"
        size="cta"
        disabled={isRetrying}
        onClick={onRetry}
        className="min-w-[160px]"
      >
        {isRetrying ? "다시 시도 중..." : actionLabel}
      </Button>
    </div>
  );
}

export function MoversList({ filters }: MoversListProps) {
  const query = useMovers(filters);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage, refetch } = query;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const movers = query.data?.pages.flatMap((page) => page.data).map(mapMoverListItemToMover) ?? [];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // 다음 페이지 실패 후에는 자동 재요청하지 않음 — 사용자가 "다시 시도"로 재개
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  if (query.isPending) {
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
      <MoversListErrorPanel
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
        <MoversListErrorPanel
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
