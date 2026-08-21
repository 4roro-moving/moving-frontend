"use client";

import { useFilterSearchParams } from "@/hooks/useFilterSearchParams";
import {
  buildMyGiveawayQueryString,
  GIVEAWAY_MY_FILTER_DEFAULTS,
  type GiveawayMyFilterState,
} from "@/lib/utils/giveawaySearchParams";

export const useMyGiveawayFilters = (filters: GiveawayMyFilterState) => {
  const { filterKey, replaceFilters, resetFilters } = useFilterSearchParams({
    filters,
    defaults: GIVEAWAY_MY_FILTER_DEFAULTS,
    buildQueryString: buildMyGiveawayQueryString,
  });

  return {
    filterKey,
    replaceFilters,
    resetFilters,
  };
};
