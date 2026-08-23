"use client";

import { useFilterSearchParams } from "@/hooks/useFilterSearchParams";
import {
  buildGiveawayQueryString,
  GIVEAWAY_SEARCH_DEFAULTS,
  type GiveawaySearchParamsState,
} from "@/lib/utils/giveawaySearchParams";

export const useGiveawayFilters = (filters: GiveawaySearchParamsState) => {
  return useFilterSearchParams({
    filters,
    defaults: GIVEAWAY_SEARCH_DEFAULTS,
    buildQueryString: buildGiveawayQueryString,
    keywordKey: "keyword",
    emptyKeyword: GIVEAWAY_SEARCH_DEFAULTS.keyword,
  });
};
