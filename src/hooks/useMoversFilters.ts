"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  buildMoversQueryString,
  MOVERS_SEARCH_DEFAULTS,
  type MoversSearchParamsState,
} from "@/lib/utils/moversSearchParams";

export function useMoversFilters(filters: MoversSearchParamsState) {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(filters.keyword);
  const [filterKey, setFilterKey] = useState(0);
  const latestFiltersRef = useRef(filters);
  // 사용자가 URL 반영 전 새로 입력한 검색어가 있는지 여부
  const isKeywordDirtyRef = useRef(false);
  // router.replace로 요청한 전체 쿼리. 이전 라우팅 결과가 늦게 도착하면 무시하기 위해 사용
  const pendingQueryRef = useRef<string | undefined>(undefined);

  // URL 필터 변경 시 입력값을 동기화하되, 라우팅 중 새로 입력한 검색어는 덮어쓰지 않음
  useEffect(() => {
    const queryString = buildMoversQueryString(filters);
    if (pendingQueryRef.current !== undefined) {
      if (queryString !== pendingQueryRef.current) {
        return;
      }
      pendingQueryRef.current = undefined;
    }

    latestFiltersRef.current = filters;

    if (isKeywordDirtyRef.current) {
      return;
    }

    setKeyword(filters.keyword);
  }, [filters]);

  const replaceUrl = useCallback(
    (nextFilters: MoversSearchParamsState) => {
      const queryString = buildMoversQueryString(nextFilters);
      if (queryString === buildMoversQueryString(latestFiltersRef.current)) {
        return;
      }

      // 이전 라우팅 결과가 최신 필터 상태를 덮어쓰지 않도록 현재 요청 쿼리 기록
      pendingQueryRef.current = queryString;
      latestFiltersRef.current = nextFilters;
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router],
  );

  const updateKeyword = useCallback((nextKeyword: string) => {
    isKeywordDirtyRef.current = true;
    setKeyword(nextKeyword);
  }, []);

  const applyKeyword = useCallback(
    (nextKeyword: string) => {
      const normalizedKeyword = nextKeyword.trim();
      isKeywordDirtyRef.current = false;
      setKeyword(normalizedKeyword);

      replaceUrl({ ...latestFiltersRef.current, keyword: normalizedKeyword });
    },
    [replaceUrl],
  );

  const submitSearch = useCallback(() => {
    applyKeyword(keyword);
  }, [applyKeyword, keyword]);

  const clearSearch = useCallback(() => {
    applyKeyword(MOVERS_SEARCH_DEFAULTS.keyword);
  }, [applyKeyword]);

  const replaceFilters = useCallback(
    (patch: Partial<MoversSearchParamsState>) => {
      replaceUrl({ ...latestFiltersRef.current, ...patch });
    },
    [replaceUrl],
  );

  const resetFilters = useCallback(() => {
    isKeywordDirtyRef.current = false;
    setKeyword(MOVERS_SEARCH_DEFAULTS.keyword);
    setFilterKey((previousKey) => previousKey + 1);
    replaceUrl({ ...MOVERS_SEARCH_DEFAULTS });
  }, [replaceUrl]);

  return {
    clearSearch,
    filterKey,
    keyword,
    replaceFilters,
    resetFilters,
    setKeyword: updateKeyword,
    submitSearch,
  };
}
