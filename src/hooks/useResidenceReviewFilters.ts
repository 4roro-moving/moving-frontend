"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  buildResidenceReviewQueryString,
  RESIDENCE_REVIEW_SEARCH_DEFAULTS,
  type ResidenceReviewSearchParamsState,
} from "@/lib/utils/residenceReviewSearchParams";

export const useResidenceReviewFilters = (filters: ResidenceReviewSearchParamsState) => {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(filters.keyword);
  const [filterKey, setFilterKey] = useState(0);
  const latestFiltersRef = useRef(filters);
  const isKeywordDirtyRef = useRef(false);
  const pendingQueryRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const queryString = buildResidenceReviewQueryString(filters);
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
    (nextFilters: ResidenceReviewSearchParamsState) => {
      const queryString = buildResidenceReviewQueryString(nextFilters);
      if (queryString === buildResidenceReviewQueryString(latestFiltersRef.current)) {
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
    applyKeyword(RESIDENCE_REVIEW_SEARCH_DEFAULTS.keyword);
  }, [applyKeyword]);

  const replaceFilters = useCallback(
    (patch: Partial<ResidenceReviewSearchParamsState>) => {
      replaceUrl({ ...latestFiltersRef.current, ...patch });
    },
    [replaceUrl],
  );

  const resetFilters = useCallback(() => {
    isKeywordDirtyRef.current = false;
    setKeyword(RESIDENCE_REVIEW_SEARCH_DEFAULTS.keyword);
    setFilterKey((previousKey) => previousKey + 1);
    replaceUrl({ ...RESIDENCE_REVIEW_SEARCH_DEFAULTS });
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
