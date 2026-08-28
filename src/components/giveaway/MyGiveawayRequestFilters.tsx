"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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

interface MyGiveawayRequestFiltersProps {
  filters: GiveawayRequestFilterState;
}

const MyGiveawayRequestFilters = ({ filters }: MyGiveawayRequestFiltersProps) => {
  const t = useTranslations("giveaway");
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
            placeholder={t("myRequestSearchPlaceholder")}
            aria-label={t("myRequestSearchAria")}
            className="w-full"
          />
        </form>
      </div>

      <div className="flex w-full flex-nowrap items-center justify-between gap-8">
        <div className="flex min-w-0 flex-nowrap items-center gap-12 md:gap-24">
          <div className="w-fit shrink-0 xl:w-160">
            <Select
              key={`status-${filters.status}-${filterKey}`}
              label={t("status")}
              desc={t("status")}
              size="lg"
              className="w-fit xl:w-full"
              defaultValue={filters.status}
              placeholderValue={GIVEAWAY_ALL_VALUE}
              onChange={(value) => replaceFilters({ status: value })}
            >
              {GIVEAWAY_REQUEST_STATUS_FILTER_OPTIONS.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  onPrefetch={() => prefetchList({ status: option.value })}
                >
                  {option.value === GIVEAWAY_ALL_VALUE
                    ? t("all")
                    : t(`requestStatusValues.${option.value}`)}
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
                {t(`sortValues.${option.value}`)}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </>
  );
};

export default MyGiveawayRequestFilters;
