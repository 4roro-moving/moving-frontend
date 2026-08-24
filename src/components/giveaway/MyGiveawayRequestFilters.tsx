"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useMyGiveawayRequestFilters } from "@/hooks/giveaway/useMyGiveawayRequestFilters";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import {
  GIVEAWAY_ALL_VALUE,
  GIVEAWAY_KEYWORD_MAX_LENGTH,
  GIVEAWAY_REQUEST_STATUS_FILTER_OPTIONS,
  GIVEAWAY_SORT_OPTIONS,
} from "@/lib/constants/giveaway";
import { getMyGiveawayRequestsInfiniteQueryOptions } from "@/lib/queryOptions/giveawayRequests";
import {
  toGiveawayRequestMyListQuery,
  type GiveawayRequestFilterState,
} from "@/lib/utils/giveawayRequestSearchParams";
import type { GiveawayListSort } from "@/types/giveaway";

const ALL_OPTION = { value: GIVEAWAY_ALL_VALUE, label: "전체" } as const;

interface MyGiveawayRequestFiltersProps {
  filters: GiveawayRequestFilterState;
}

const MyGiveawayRequestFilters = ({ filters }: MyGiveawayRequestFiltersProps) => {
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
  } = useMyGiveawayRequestFilters(filters);

  const prefetchList = useCallback(
    (patch: Partial<GiveawayRequestFilterState>) => {
      const nextFilters = { ...filters, keyword: keyword.trim(), ...patch };
      if (
        nextFilters.keyword === filters.keyword &&
        nextFilters.status === filters.status &&
        nextFilters.sort === filters.sort
      ) {
        return;
      }

      void queryClient.prefetchInfiniteQuery(
        getMyGiveawayRequestsInfiniteQueryOptions(
          authScope,
          toGiveawayRequestMyListQuery(nextFilters),
        ),
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
            placeholder="제목 또는 내용으로 신청 내역을 검색해 보세요."
            aria-label="나눔 신청 내역 검색"
            className="w-full"
          />
        </form>
      </div>

      <div className="flex w-full flex-nowrap items-center justify-between gap-8">
        <div className="flex min-w-0 flex-nowrap items-center gap-12 md:gap-24">
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
              {GIVEAWAY_REQUEST_STATUS_FILTER_OPTIONS.map((option) => (
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

export default MyGiveawayRequestFilters;
