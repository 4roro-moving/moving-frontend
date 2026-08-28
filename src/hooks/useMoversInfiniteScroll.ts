"use client";

import { useEffect, useRef } from "react";

interface UseMoversInfiniteScrollParams {
  enabled: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => Promise<unknown>;
}

const INFINITE_SCROLL_ROOT_MARGIN = "240px 0px";

export const useMoversInfiniteScroll = ({
  enabled,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  fetchNextPage,
}: UseMoversInfiniteScrollParams) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 불러오는 중이거나 실패 직후에는 observe하지 않습니다.
    // fetch가 끝난 뒤에 다시 붙이면, sentinel이 그대로 보여도 첫 콜백에서 다음 페이지를 요청합니다.
    if (!enabled || !hasNextPage || isFetchingNextPage || isFetchNextPageError) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: INFINITE_SCROLL_ROOT_MARGIN },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  return sentinelRef;
};
