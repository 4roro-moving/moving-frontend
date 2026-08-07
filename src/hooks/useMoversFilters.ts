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
  // router.replace로 요청한 검색어. 이전 라우팅 결과가 늦게 도착하면 무시하기 위해 사용
  const pendingKeywordRef = useRef<string | undefined>(undefined);

  // URL 필터 변경 시 입력값을 동기화하되, 라우팅 중 새로 입력한 검색어는 덮어쓰지 읺음
  useEffect(() => {
    if (pendingKeywordRef.current !== undefined) {
      if (filters.keyword !== pendingKeywordRef.current) {
        return;
      }
      pendingKeywordRef.current = undefined;
    }

    latestFiltersRef.current = filters;

    if (isKeywordDirtyRef.current) {
      return;
    }

    setKeyword(filters.keyword);
  }, [filters]);

  const replaceUrl = useCallback(
    (nextFilters: MoversSearchParamsState) => {
      latestFiltersRef.current = nextFilters;
      const queryString = buildMoversQueryString(nextFilters);
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

      if (normalizedKeyword === latestFiltersRef.current.keyword) {
        return;
      }

      pendingKeywordRef.current = normalizedKeyword;
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
    const isAlreadyDefault =
      buildMoversQueryString(latestFiltersRef.current) ===
      buildMoversQueryString(MOVERS_SEARCH_DEFAULTS);
    pendingKeywordRef.current = isAlreadyDefault ? undefined : MOVERS_SEARCH_DEFAULTS.keyword;
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
