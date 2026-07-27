"use client";

import { useEffect, useRef, useState } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import MoverCard from "@/components/mover/MoverCard";
import { useMovers } from "@/hooks/useMovers";
import { mapMoverListItemToMover } from "@/lib/utils/mapMover";
import type { MoversSearchParamsState } from "@/lib/utils/moversSearchParams";

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

export function MoversList({ filters }: MoversListProps) {
  const query = useMovers(filters);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
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
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (query.isPending) {
    return (
      <Text as="p" variant="lg-medium" className="text-text-muted py-40 text-center">
        기사님 목록을 불러오는 중...
      </Text>
    );
  }

  if (query.isError) {
    return (
      <Text as="p" variant="lg-medium" className="text-text-error py-40 text-center">
        기사님 목록을 불러오지 못했습니다.
      </Text>
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

      {query.isFetchingNextPage ? (
        <Text as="p" variant="md-medium" className="text-text-muted text-center">
          더 불러오는 중...
        </Text>
      ) : null}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
