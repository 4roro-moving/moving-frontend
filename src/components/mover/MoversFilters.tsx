"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { SORT_OPTIONS } from "@/components/mover/constants";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { REGION_OPTIONS } from "@/lib/constants/region";
import {
  buildMoversQueryString,
  MOVERS_ALL_VALUE,
  MOVERS_SEARCH_DEFAULTS,
  type MoversSearchParamsState,
} from "@/lib/utils/moversSearchParams";
import type { MoverSort } from "@/types/mover";

const ALL_OPTION = { value: MOVERS_ALL_VALUE, label: "전체" } as const;
const SEARCH_DEBOUNCE_MS = 300;

const REGION_FILTER_OPTIONS = [
  ALL_OPTION,
  ...REGION_OPTIONS.map((region) => ({
    value: String(region.value),
    label: region.label,
  })),
];

const MOVE_TYPE_FILTER_OPTIONS = [ALL_OPTION, ...MOVE_TYPE_OPTIONS];

interface MoversFiltersProps {
  filters: MoversSearchParamsState;
}

export function MoversFilters({ filters }: MoversFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(filters.keyword);
  const [prevKeyword, setPrevKeyword] = useState(filters.keyword);
  const [filterKey, setFilterKey] = useState(0);
  const searchDebounceTimerRef = useRef<number | null>(null);

  if (filters.keyword !== prevKeyword) {
    setPrevKeyword(filters.keyword);
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
    (next: MoversSearchParamsState) => {
      const query = buildMoversQueryString(next);
      router.replace(query ? `${pathname}?${query}` : pathname);
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

    return () => clearSearchDebounceTimer();
  }, [keyword, filters, replaceUrl, clearSearchDebounceTimer]);

  /** 지역·서비스·정렬은 즉시 반영. 대기 중인 검색 디바운스는 취소하고 현재 keyword와 합친다. */
  function replaceFilters(patch: Partial<MoversSearchParamsState>) {
    clearSearchDebounceTimer();
    replaceUrl({ ...filters, keyword, ...patch });
  }

  function handleReset() {
    clearSearchDebounceTimer();
    setKeyword(MOVERS_SEARCH_DEFAULTS.keyword);
    setFilterKey((prev) => prev + 1);
    router.replace(pathname);
  }

  return (
    <>
      <div className="w-full py-10">
        <Search
          size="md"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="텍스트를 입력해 주세요."
          aria-label="기사님 검색"
          className="h-[52px] w-full gap-8 px-16 min-[744px]:h-64 min-[744px]:px-24"
        />
      </div>

      <div className="flex w-full flex-nowrap items-center justify-between gap-8">
        <div className="flex min-w-0 flex-nowrap items-center gap-24">
          <div className="flex flex-nowrap items-center gap-12">
            <div className="w-fit shrink-0 lg:w-[160px]">
              <Select
                key={`serviceArea-${filters.serviceArea}-${filterKey}`}
                label="지역"
                desc="지역"
                size="lg"
                columns={2}
                className="w-fit lg:w-full"
                defaultValue={filters.serviceArea}
                placeholderValue={ALL_OPTION.value}
                onChange={(value) => replaceFilters({ serviceArea: value })}
              >
                {REGION_FILTER_OPTIONS.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="w-fit shrink-0 lg:w-[160px]">
              <Select
                key={`moveType-${filters.moveType}-${filterKey}`}
                label="서비스"
                desc="서비스"
                size="lg"
                className="w-fit lg:w-full"
                defaultValue={filters.moveType}
                placeholderValue={ALL_OPTION.value}
                onChange={(value) => replaceFilters({ moveType: value })}
              >
                {MOVE_TYPE_FILTER_OPTIONS.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-text-weak hover:text-text-muted shrink-0 transition-colors"
          >
            <Text as="span" variant={{ base: "md-medium", lg: "lg-medium" }}>
              초기화
            </Text>
          </button>
        </div>

        <div className="w-fit shrink-0">
          <Select
            key={`sort-${filters.sort}-${filterKey}`}
            label="정렬"
            desc="정렬"
            variant="sort"
            className="w-fit"
            defaultValue={filters.sort}
            onChange={(value) => replaceFilters({ sort: value as MoverSort })}
          >
            {SORT_OPTIONS.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
}
