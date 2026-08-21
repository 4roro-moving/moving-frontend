"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  buildMyGiveawayQueryString,
  GIVEAWAY_MY_FILTER_DEFAULTS,
  type GiveawayMyFilterState,
} from "@/lib/utils/giveawaySearchParams";

export const useMyGiveawayFilters = (filters: GiveawayMyFilterState) => {
  const router = useRouter();
  const pathname = usePathname();
  const [filterKey, setFilterKey] = useState(0);
  const latestFiltersRef = useRef(filters);
  const pendingQueryRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const queryString = buildMyGiveawayQueryString(filters);
    if (pendingQueryRef.current !== undefined) {
      if (queryString !== pendingQueryRef.current) {
        return;
      }
      pendingQueryRef.current = undefined;
    }

    latestFiltersRef.current = filters;
  }, [filters]);

  const replaceUrl = useCallback(
    (nextFilters: GiveawayMyFilterState) => {
      const queryString = buildMyGiveawayQueryString(nextFilters);
      if (queryString === buildMyGiveawayQueryString(latestFiltersRef.current)) {
        return;
      }

      pendingQueryRef.current = queryString;
      latestFiltersRef.current = nextFilters;
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router],
  );

  const replaceFilters = useCallback(
    (patch: Partial<GiveawayMyFilterState>) => {
      replaceUrl({
        ...latestFiltersRef.current,
        ...patch,
      });
    },
    [replaceUrl],
  );

  const resetFilters = useCallback(() => {
    setFilterKey((previousKey) => previousKey + 1);
    replaceUrl({ ...GIVEAWAY_MY_FILTER_DEFAULTS });
  }, [replaceUrl]);

  return {
    filterKey,
    replaceFilters,
    resetFilters,
  };
};
