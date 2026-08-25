"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useGiveawayFilters } from "@/hooks/giveaway/useGiveawayFilters";
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

interface GiveawayFiltersProps {
  filters: GiveawaySearchParamsState;
}

const GiveawayFilters = ({ filters }: GiveawayFiltersProps) => {
  const t = useTranslations("giveaway");
  const allOption = { value: GIVEAWAY_ALL_VALUE, label: t("all") };
  const regionFilterOptions = [
    allOption,
    ...REGION_OPTIONS.map((region) => ({ value: String(region.value), label: region.label })),
  ];
  const queryClient = useQueryClient();
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
        getGiveawaysInfiniteQueryOptions(toGiveawayListQuery(nextFilters)),
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
            maxLength={GIVEAWAY_KEYWORD_MAX_LENGTH}
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
                placeholderValue={allOption.value}
                onChange={(value) => replaceFilters({ regionId: value })}
              >
                {regionFilterOptions.map((option) => (
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
                label={t("status")}
                desc={t("status")}
                size="lg"
                className="w-fit xl:w-full"
                defaultValue={filters.status}
                placeholderValue={allOption.value}
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
