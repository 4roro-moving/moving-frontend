"use client";

import { useTranslations } from "next-intl";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useResidenceReviewFilters } from "@/hooks/residence-review/useResidenceReviewFilters";
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

const ALL_OPTION_VALUE = RESIDENCE_REVIEW_ALL_VALUE;

const REGION_FILTER_OPTIONS = [
  { value: RESIDENCE_REVIEW_ALL_VALUE },
  ...REGION_OPTIONS.map((region) => ({
    value: String(region.value),
  })),
];

interface ResidenceReviewFiltersProps {
  filters: ResidenceReviewSearchParamsState;
}

const ResidenceReviewFilters = ({ filters }: ResidenceReviewFiltersProps) => {
  const t = useTranslations("residenceReview");
  const queryClient = useQueryClient();
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
      const nextFilters = { ...filters, keyword: keyword.trim(), ...patch };
      if (
        nextFilters.keyword === filters.keyword &&
        nextFilters.regionId === filters.regionId &&
        nextFilters.rating === filters.rating &&
        nextFilters.sort === filters.sort
      ) {
        return;
      }

      void queryClient.prefetchInfiniteQuery(
        getResidenceReviewsInfiniteQueryOptions(toResidenceReviewListQuery(nextFilters)),
      );
    },
    [filters, keyword, queryClient],
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
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
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
                label={t("region")}
                desc={t("region")}
                size="lg"
                columns={2}
                className="w-fit xl:w-full"
                defaultValue={filters.regionId}
                placeholderValue={ALL_OPTION_VALUE}
                onChange={(value) => replaceFilters({ regionId: value })}
              >
                {REGION_FILTER_OPTIONS.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    onPrefetch={() => prefetchList({ regionId: option.value })}
                  >
                    {option.value === RESIDENCE_REVIEW_ALL_VALUE
                      ? t("all")
                      : t(`regions.${option.value}`)}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="w-fit shrink-0 xl:w-160">
              <Select
                key={`rating-${filters.rating}-${filterKey}`}
                label={t("rating")}
                desc={t("rating")}
                size="lg"
                className="w-fit xl:w-full"
                defaultValue={filters.rating}
                placeholderValue={ALL_OPTION_VALUE}
                onChange={(value) => replaceFilters({ rating: value })}
              >
                {RESIDENCE_REVIEW_RATING_OPTIONS.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    onPrefetch={() => prefetchList({ rating: option.value })}
                  >
                    {option.value === RESIDENCE_REVIEW_ALL_VALUE
                      ? t("all")
                      : t("ratingPoints", { rating: option.value })}
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
              {t("reset")}
            </Text>
          </button>
        </div>

        <div className="w-fit shrink-0">
          <Select
            key={`sort-${filters.sort}-${filterKey}`}
            label={t("sort")}
            desc={t("sort")}
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
                {option.value === "createdAt" ? t("sortNewest") : t("sortOldest")}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default ResidenceReviewFilters;
