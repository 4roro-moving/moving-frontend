"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useGiveawayFilters } from "@/hooks/giveaway/useGiveawayFilters";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import {
  GIVEAWAY_ALL_VALUE,
  GIVEAWAY_KEYWORD_MAX_LENGTH,
  GIVEAWAY_SORT_OPTIONS,
  GIVEAWAY_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/giveaway";
import { REGION_OPTIONS } from "@/lib/constants/region";
import { getGiveawaysInfiniteQueryOptions } from "@/lib/queryOptions/giveaways";
import {
  toGiveawayListQuery,
  type GiveawaySearchParamsState,
} from "@/lib/utils/giveawaySearchParams";
import type { GiveawayListSort } from "@/types/giveaway";

const ALL_OPTION = { value: GIVEAWAY_ALL_VALUE, label: "전체" } as const;

const REGION_FILTER_OPTIONS = [
  ALL_OPTION,
  ...REGION_OPTIONS.map((region) => ({
    value: String(region.value),
    label: region.label,
  })),
];

interface GiveawayFiltersProps {
  filters: GiveawaySearchParamsState;
}

const GiveawayFilters = ({ filters }: GiveawayFiltersProps) => {
  const queryClient = useQueryClient();
  const { authScope } = useAuthQueryScope();
  const {
    clearSearch,
    filterKey,
    keyword,
    replaceFilters,
    resetFilters,
    setKeyword,
    submitSearch,
  } = useGiveawayFilters(filters);

  const prefetchList = useCallback(
    (patch: Partial<GiveawaySearchParamsState>) => {
      const nextFilters = { ...filters, keyword: keyword.trim(), ...patch };
      if (
        nextFilters.keyword === filters.keyword &&
        nextFilters.regionId === filters.regionId &&
        nextFilters.status === filters.status &&
        nextFilters.sort === filters.sort
      ) {
        return;
      }

      void queryClient.prefetchInfiniteQuery(
        getGiveawaysInfiniteQueryOptions(authScope, toGiveawayListQuery(nextFilters)),
      );
    },
    [authScope, filters, keyword, queryClient],
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
            maxLength={GIVEAWAY_KEYWORD_MAX_LENGTH}
            placeholder="텍스트를 입력해 주세요."
            aria-label="나눔 글 검색"
            className="w-full"
          />
        </form>
      </div>

      <div className="flex w-full flex-nowrap items-center justify-between gap-8">
        <div className="flex min-w-0 flex-nowrap items-center gap-12 md:gap-24">
          <div className="flex min-w-0 flex-nowrap items-center gap-12">
            <div className="w-fit shrink-0 xl:w-160">
              <Select
                key={`regionId-${filters.regionId}-${filterKey}`}
                label="지역"
                desc="지역"
                size="lg"
                columns={2}
                className="w-fit xl:w-full"
                defaultValue={filters.regionId}
                placeholderValue={ALL_OPTION.value}
                onChange={(value) => replaceFilters({ regionId: value })}
              >
                {REGION_FILTER_OPTIONS.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    onPrefetch={() => prefetchList({ regionId: option.value })}
                  >
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="w-fit shrink-0 xl:w-160">
              <Select
                key={`status-${filters.status}-${filterKey}`}
                label="상태"
                desc="상태"
                size="lg"
                className="w-fit xl:w-full"
                defaultValue={filters.status}
                placeholderValue={ALL_OPTION.value}
                onChange={(value) => replaceFilters({ status: value })}
              >
                {GIVEAWAY_STATUS_FILTER_OPTIONS.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    onPrefetch={() => prefetchList({ status: option.value })}
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
            onChange={(value) => replaceFilters({ sort: value as GiveawayListSort })}
          >
            {GIVEAWAY_SORT_OPTIONS.map((option) => (
              <Select.Option
                key={option.value}
                value={option.value}
                onPrefetch={() => prefetchList({ sort: option.value })}
              >
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default GiveawayFilters;
