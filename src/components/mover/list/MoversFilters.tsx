"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useMoversFilters } from "@/hooks/useMoversFilters";
import { REGION_DISPLAY_ORDER } from "@/lib/constants/region";
import { getMoversInfiniteQueryOptions } from "@/lib/queryOptions/movers";
import {
  MOVERS_ALL_VALUE,
  toMoversListQuery,
  type MoversSearchParamsState,
} from "@/lib/utils/moversSearchParams";
import type { MoverSort } from "@/types/mover";

interface MoversFiltersProps {
  filters: MoversSearchParamsState;
}

export function MoversFilters({ filters }: MoversFiltersProps) {
  const t = useTranslations("moverSearch");
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

  const allOption = { value: MOVERS_ALL_VALUE, label: t("all") };
  const regionFilterOptions = [
    allOption,
    ...REGION_DISPLAY_ORDER.map((value) => ({
      value: String(value),
      label: t(`regions.${value}`),
    })),
  ];
  const moveTypeFilterOptions = [
    allOption,
    ...(["SMALL", "HOME", "OFFICE"] as const).map((value) => ({
      value,
      label: t(`moveTypes.${value}`),
    })),
  ];
  const sortOptions: { value: MoverSort; label: string }[] = [
    { value: "reviewCount", label: t("sort.reviewCount") },
    { value: "rating", label: t("sort.rating") },
    { value: "career", label: t("sort.career") },
    { value: "confirmedCount", label: t("sort.confirmedCount") },
  ];

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
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchLabel")}
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
                label={t("regionLabel")}
                desc={t("regionLabel")}
                size="lg"
                columns={2}
                className="w-fit xl:w-full"
                defaultValue={filters.serviceArea}
                placeholderValue={allOption.value}
                onChange={(value) => replaceFilters({ serviceArea: value })}
              >
                {regionFilterOptions.map((option) => (
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
                label={t("serviceLabel")}
                desc={t("serviceLabel")}
                size="lg"
                className="w-fit xl:w-full"
                defaultValue={filters.moveType}
                placeholderValue={allOption.value}
                onChange={(value) => replaceFilters({ moveType: value })}
              >
                {moveTypeFilterOptions.map((option) => (
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
              {t("reset")}
            </Text>
          </button>
        </div>

        <div className="w-fit shrink-0">
          <Select
            key={`sort-${filters.sort}-${filterKey}`}
            label={t("sortLabel")}
            desc={t("sortLabel")}
            variant="sort"
            className="w-fit"
            defaultValue={filters.sort}
            onChange={(value) => replaceFilters({ sort: value as MoverSort })}
          >
            {sortOptions.map((option) => (
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
