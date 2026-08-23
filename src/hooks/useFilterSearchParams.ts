"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface UseFilterSearchParamsParams<TFilters extends object> {
  filters: TFilters;
  defaults: TFilters;
  buildQueryString: (filters: TFilters) => string;
  keywordKey?: keyof TFilters & string;
  emptyKeyword?: string;
}

export const useFilterSearchParams = <TFilters extends object>({
  filters,
  defaults,
  buildQueryString,
  keywordKey,
  emptyKeyword = "",
}: UseFilterSearchParamsParams<TFilters>) => {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(() => {
    if (!keywordKey) {
      return emptyKeyword;
    }
    const currentKeyword = filters[keywordKey];
    return typeof currentKeyword === "string" ? currentKeyword : emptyKeyword;
  });
  const [filterKey, setFilterKey] = useState(0);
  const latestFiltersRef = useRef(filters);
  const isKeywordDirtyRef = useRef(false);
  const pendingQueryRef = useRef<string | undefined>(undefined);

  const applyKeywordToFilters = useCallback(
    (current: TFilters, nextKeyword: string): TFilters => {
      if (!keywordKey) {
        return current;
      }
      return { ...current, [keywordKey]: nextKeyword };
    },
    [keywordKey],
  );

  useEffect(() => {
    const queryString = buildQueryString(filters);
    if (pendingQueryRef.current !== undefined) {
      if (queryString !== pendingQueryRef.current) {
        return;
      }
      pendingQueryRef.current = undefined;
    }

    latestFiltersRef.current = filters;

    if (!keywordKey || isKeywordDirtyRef.current) {
      return;
    }

    const nextKeyword = filters[keywordKey];
    setKeyword(typeof nextKeyword === "string" ? nextKeyword : emptyKeyword);
  }, [buildQueryString, emptyKeyword, filters, keywordKey]);

  const replaceUrl = useCallback(
    (nextFilters: TFilters) => {
      const queryString = buildQueryString(nextFilters);
      if (queryString === buildQueryString(latestFiltersRef.current)) {
        return;
      }

      pendingQueryRef.current = queryString;
      latestFiltersRef.current = nextFilters;
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [buildQueryString, pathname, router],
  );

  const updateKeyword = useCallback((nextKeyword: string) => {
    isKeywordDirtyRef.current = true;
    setKeyword(nextKeyword);
  }, []);

  const commitKeyword = useCallback(
    (nextKeyword: string) => {
      const normalizedKeyword = nextKeyword.trim();
      isKeywordDirtyRef.current = false;
      setKeyword(normalizedKeyword);
      replaceUrl(applyKeywordToFilters(latestFiltersRef.current, normalizedKeyword));
    },
    [applyKeywordToFilters, replaceUrl],
  );

  const submitSearch = useCallback(() => {
    commitKeyword(keyword);
  }, [commitKeyword, keyword]);

  const clearSearch = useCallback(() => {
    commitKeyword(emptyKeyword);
  }, [commitKeyword, emptyKeyword]);

  const replaceFilters = useCallback(
    (patch: Partial<TFilters>) => {
      if (keywordKey) {
        const normalizedKeyword = keyword.trim();
        isKeywordDirtyRef.current = false;
        setKeyword(normalizedKeyword);
        replaceUrl({
          ...applyKeywordToFilters(latestFiltersRef.current, normalizedKeyword),
          ...patch,
        });
        return;
      }

      replaceUrl({
        ...latestFiltersRef.current,
        ...patch,
      });
    },
    [applyKeywordToFilters, keyword, keywordKey, replaceUrl],
  );

  const resetFilters = useCallback(() => {
    if (keywordKey) {
      isKeywordDirtyRef.current = false;
      setKeyword(emptyKeyword);
    }
    setFilterKey((previousKey) => previousKey + 1);
    replaceUrl({ ...defaults });
  }, [defaults, emptyKeyword, keywordKey, replaceUrl]);

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
