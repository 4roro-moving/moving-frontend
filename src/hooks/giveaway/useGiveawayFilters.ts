"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  buildGiveawayQueryString,
  GIVEAWAY_SEARCH_DEFAULTS,
  type GiveawaySearchParamsState,
} from "@/lib/utils/giveawaySearchParams";

export const useGiveawayFilters = (filters: GiveawaySearchParamsState) => {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(filters.keyword);
  const [filterKey, setFilterKey] = useState(0);
  const latestFiltersRef = useRef(filters);
  const isKeywordDirtyRef = useRef(false);
  const pendingQueryRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const queryString = buildGiveawayQueryString(filters);
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
    (nextFilters: GiveawaySearchParamsState) => {
      const queryString = buildGiveawayQueryString(nextFilters);
      if (queryString === buildGiveawayQueryString(latestFiltersRef.current)) {
        return;
      }

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
    applyKeyword(GIVEAWAY_SEARCH_DEFAULTS.keyword);
  }, [applyKeyword]);

  const replaceFilters = useCallback(
    (patch: Partial<GiveawaySearchParamsState>) => {
      const normalizedKeyword = keyword.trim();
      isKeywordDirtyRef.current = false;
      setKeyword(normalizedKeyword);
      replaceUrl({
        ...latestFiltersRef.current,
        keyword: normalizedKeyword,
        ...patch,
      });
    },
    [keyword, replaceUrl],
  );

  const resetFilters = useCallback(() => {
    isKeywordDirtyRef.current = false;
    setKeyword(GIVEAWAY_SEARCH_DEFAULTS.keyword);
    setFilterKey((previousKey) => previousKey + 1);
    replaceUrl({ ...GIVEAWAY_SEARCH_DEFAULTS });
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
};
