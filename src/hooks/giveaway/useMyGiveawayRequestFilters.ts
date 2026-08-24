"use client";

import { useFilterSearchParams } from "@/hooks/useFilterSearchParams";
import {
  buildGiveawayRequestQueryString,
  GIVEAWAY_REQUEST_FILTER_DEFAULTS,
  type GiveawayRequestFilterState,
} from "@/lib/utils/giveawayRequestSearchParams";

export const useMyGiveawayRequestFilters = (filters: GiveawayRequestFilterState) => {
  return useFilterSearchParams({
    filters,
    defaults: GIVEAWAY_REQUEST_FILTER_DEFAULTS,
    buildQueryString: buildGiveawayRequestQueryString,
    keywordKey: "keyword",
    emptyKeyword: GIVEAWAY_REQUEST_FILTER_DEFAULTS.keyword,
  });
};
