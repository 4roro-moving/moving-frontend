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
  const [previousKeyword, setPreviousKeyword] = useState(filters.keyword);
  const [filterKey, setFilterKey] = useState(0);
  const latestFiltersRef = useRef(filters);

  if (filters.keyword !== previousKeyword) {
    setPreviousKeyword(filters.keyword);
    setKeyword(filters.keyword);
  }

  useEffect(() => {
    latestFiltersRef.current = filters;
  }, [filters]);

  const replaceUrl = useCallback(
    (nextFilters: MoversSearchParamsState) => {
      latestFiltersRef.current = nextFilters;
      const queryString = buildMoversQueryString(nextFilters);
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router],
  );

  const submitSearch = useCallback(() => {
    const normalizedKeyword = keyword.trim();
    setKeyword(normalizedKeyword);
    replaceUrl({ ...latestFiltersRef.current, keyword: normalizedKeyword });
  }, [keyword, replaceUrl]);

  const clearSearch = useCallback(() => {
    setKeyword(MOVERS_SEARCH_DEFAULTS.keyword);
    replaceUrl({ ...latestFiltersRef.current, keyword: MOVERS_SEARCH_DEFAULTS.keyword });
  }, [replaceUrl]);

  const replaceFilters = useCallback(
    (patch: Partial<MoversSearchParamsState>) => {
      replaceUrl({ ...latestFiltersRef.current, ...patch });
    },
    [replaceUrl],
  );

  const resetFilters = useCallback(() => {
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
    setKeyword,
    submitSearch,
  };
}
