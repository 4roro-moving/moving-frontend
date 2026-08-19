"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useResidenceReviewFilters } from "@/hooks/useResidenceReviewFilters";
import { REGION_OPTIONS } from "@/lib/constants/region";
import {
  RESIDENCE_REVIEW_RATING_OPTIONS,
  RESIDENCE_REVIEW_SORT_OPTIONS,
} from "@/lib/constants/residenceReview";
import { getResidenceReviewsInfiniteQueryOptions } from "@/lib/queryOptions/residenceReviews";
import {
  RESIDENCE_REVIEW_ALL_VALUE,
  toResidenceReviewListQuery,
  type ResidenceReviewSearchParamsState,
} from "@/lib/utils/residenceReviewSearchParams";
import type { ResidenceReviewListSort } from "@/types/residenceReview";

const ALL_OPTION = { value: RESIDENCE_REVIEW_ALL_VALUE, label: "전체" } as const;

const REGION_FILTER_OPTIONS = [
  ALL_OPTION,
  ...REGION_OPTIONS.map((region) => ({
    value: String(region.value),
    label: region.label,
  })),
];

interface ResidenceReviewFiltersProps {
  filters: ResidenceReviewSearchParamsState;
}

const ResidenceReviewFilters = ({ filters }: ResidenceReviewFiltersProps) => {
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
  } = useResidenceReviewFilters(filters);

  const prefetchList = useCallback(
    (patch: Partial<ResidenceReviewSearchParamsState>) => {
      if (!isAuthQueryReady) return;

      const nextFilters = { ...filters, ...patch };
      if (
        nextFilters.regionId === filters.regionId &&
        nextFilters.rating === filters.rating &&
        nextFilters.sort === filters.sort
      ) {
        return;
      }

      void queryClient.prefetchInfiniteQuery(
        getResidenceReviewsInfiniteQueryOptions(authScope, toResidenceReviewListQuery(nextFilters)),
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
            aria-label="거주 후기 검색"
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
                key={`rating-${filters.rating}-${filterKey}`}
                label="별점"
                desc="별점"
                size="lg"
                className="w-fit xl:w-full"
                defaultValue={filters.rating}
                placeholderValue={ALL_OPTION.value}
                onChange={(value) => replaceFilters({ rating: value })}
              >
                {RESIDENCE_REVIEW_RATING_OPTIONS.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    onPrefetch={() => prefetchList({ rating: option.value })}
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
            onChange={(value) => replaceFilters({ sort: value as ResidenceReviewListSort })}
          >
            {RESIDENCE_REVIEW_SORT_OPTIONS.map((option) => (
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

export default ResidenceReviewFilters;
