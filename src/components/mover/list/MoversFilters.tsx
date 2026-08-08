"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { SORT_OPTIONS } from "@/components/mover/list/constants";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useMoversFilters } from "@/hooks/useMoversFilters";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { REGION_OPTIONS } from "@/lib/constants/region";
import { getMoversInfiniteQueryOptions } from "@/lib/queryOptions/movers";
import {
  MOVERS_ALL_VALUE,
  toMoversListQuery,
  type MoversSearchParamsState,
} from "@/lib/utils/moversSearchParams";
import type { MoverSort } from "@/types/mover";

const ALL_OPTION = { value: MOVERS_ALL_VALUE, label: "전체" } as const;

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
  const queryClient = useQueryClient();
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const {
    clearSearch,
    filterKey,
    keyword,
    replaceFilters,
    resetFilters,
    setKeyword,
    submitSearch,
  } = useMoversFilters(filters);

  const prefetchMovers = useCallback(
    (patch: Partial<MoversSearchParamsState>) => {
      if (!isAuthQueryReady) return;

      const nextFilters = { ...filters, ...patch };
      if (
        nextFilters.serviceArea === filters.serviceArea &&
        nextFilters.moveType === filters.moveType &&
        nextFilters.sort === filters.sort
      ) {
        return;
      }

      void queryClient.prefetchInfiniteQuery(
        getMoversInfiniteQueryOptions(authScope, toMoversListQuery(nextFilters)),
      );
    },
    [authScope, filters, isAuthQueryReady, queryClient],
  );

  return (
    <>
      <div className="w-full py-10">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
        >
          <Search
            size="responsive"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onClear={clearSearch}
            placeholder="텍스트를 입력해 주세요."
            aria-label="기사님 검색"
            className="w-full"
          />
        </form>
      </div>

      <div className="flex w-full flex-nowrap items-center justify-between gap-8">
        <div className="flex min-w-0 flex-nowrap items-center gap-24">
          <div className="flex flex-nowrap items-center gap-12">
            <div className="w-fit shrink-0 xl:w-[160px]">
              <Select
                key={`serviceArea-${filters.serviceArea}-${filterKey}`}
                label="지역"
                desc="지역"
                size="lg"
                columns={2}
                className="w-fit xl:w-full"
                defaultValue={filters.serviceArea}
                placeholderValue={ALL_OPTION.value}
                onChange={(value) => replaceFilters({ serviceArea: value })}
              >
                {REGION_FILTER_OPTIONS.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    onPrefetch={() => prefetchMovers({ serviceArea: option.value })}
                  >
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="w-fit shrink-0 xl:w-[160px]">
              <Select
                key={`moveType-${filters.moveType}-${filterKey}`}
                label="서비스"
                desc="서비스"
                size="lg"
                className="w-fit xl:w-full"
                defaultValue={filters.moveType}
                placeholderValue={ALL_OPTION.value}
                onChange={(value) => replaceFilters({ moveType: value })}
              >
                {MOVE_TYPE_FILTER_OPTIONS.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    onPrefetch={() => prefetchMovers({ moveType: option.value })}
                  >
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="text-text-weak hover:text-text-muted shrink-0 transition-colors"
          >
            <Text as="span" variant={{ base: "md-medium", xl: "lg-medium" }}>
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
              <Select.Option
                key={option.value}
                value={option.value}
                onPrefetch={() => prefetchMovers({ sort: option.value })}
              >
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
}
