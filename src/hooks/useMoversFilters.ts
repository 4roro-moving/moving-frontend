"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  buildMoversQueryString,
  MOVERS_SEARCH_DEFAULTS,
  type MoversSearchParamsState,
} from "@/lib/utils/moversSearchParams";

const SEARCH_DEBOUNCE_MS = 300;

export function useMoversFilters(filters: MoversSearchParamsState) {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(filters.keyword);
  const [previousKeyword, setPreviousKeyword] = useState(filters.keyword);
  const [filterKey, setFilterKey] = useState(0);
  const searchDebounceTimerRef = useRef<number | null>(null);

  if (filters.keyword !== previousKeyword) {
    setPreviousKeyword(filters.keyword);
    setKeyword(filters.keyword);
  }

  const clearSearchDebounceTimer = useCallback(() => {
    if (searchDebounceTimerRef.current === null) {
      return;
    }

    window.clearTimeout(searchDebounceTimerRef.current);
    searchDebounceTimerRef.current = null;
  }, []);

  const replaceUrl = useCallback(
    (nextFilters: MoversSearchParamsState) => {
      const queryString = buildMoversQueryString(nextFilters);
      // 필터 URL 동기화로 인한 불필요한 스크롤 이동 방지
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    if (keyword === filters.keyword) {
      return;
    }

    clearSearchDebounceTimer();
    searchDebounceTimerRef.current = window.setTimeout(() => {
      searchDebounceTimerRef.current = null;
      replaceUrl({ ...filters, keyword });
    }, SEARCH_DEBOUNCE_MS);

    return clearSearchDebounceTimer;
  }, [keyword, filters, replaceUrl, clearSearchDebounceTimer]);

  const replaceFilters = useCallback(
    (patch: Partial<MoversSearchParamsState>) => {
      clearSearchDebounceTimer();
      replaceUrl({ ...filters, keyword, ...patch });
    },
    [clearSearchDebounceTimer, filters, keyword, replaceUrl],
  );

  const resetFilters = useCallback(() => {
    clearSearchDebounceTimer();
    setKeyword(MOVERS_SEARCH_DEFAULTS.keyword);
    setFilterKey((previousKey) => previousKey + 1);
    router.replace(pathname, { scroll: false });
  }, [clearSearchDebounceTimer, pathname, router]);

  return {
    filterKey,
    keyword,
    replaceFilters,
    resetFilters,
    setKeyword,
  };
}
