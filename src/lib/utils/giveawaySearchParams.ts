import { REGION_OPTIONS } from "@/lib/constants/region";
import {
  GIVEAWAY_ALL_VALUE,
  GIVEAWAY_KEYWORD_MAX_LENGTH,
  GIVEAWAY_PAGE_LIMIT,
  GIVEAWAY_SORT_OPTIONS,
  GIVEAWAY_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/giveaway";
import { GIVEAWAY_LIST_SORT, GIVEAWAY_STATUS } from "@/types/giveaway";
import type {
  GiveawayListQuery,
  GiveawayListSort,
  GiveawayMyListQuery,
  GiveawayStatus,
} from "@/types/giveaway";
import {
  getSearchParam,
  parseAllowedValue,
  parseFilterValue,
  parseKeywordParam,
  type SearchParamsInput,
} from "@/lib/utils/searchParams";

export const GIVEAWAY_SEARCH_DEFAULTS = {
  keyword: "",
  regionId: GIVEAWAY_ALL_VALUE,
  status: GIVEAWAY_ALL_VALUE,
  sort: GIVEAWAY_LIST_SORT.LATEST,
} as const;

export interface GiveawaySearchParamsState {
  keyword: string;
  regionId: string;
  status: string;
  sort: GiveawayListSort;
}

export interface GiveawayMyFilterState {
  status: string;
  sort: GiveawayListSort;
}

export const GIVEAWAY_MY_FILTER_DEFAULTS = {
  status: GIVEAWAY_SEARCH_DEFAULTS.status,
  sort: GIVEAWAY_SEARCH_DEFAULTS.sort,
} as const satisfies GiveawayMyFilterState;

const REGION_ID_VALUES = new Set(REGION_OPTIONS.map((region) => String(region.value)));
const SORT_VALUES = new Set(GIVEAWAY_SORT_OPTIONS.map((option) => option.value));
const STATUS_VALUES = new Set(
  GIVEAWAY_STATUS_FILTER_OPTIONS.filter((option) => option.value !== GIVEAWAY_ALL_VALUE).map(
    (option) => option.value,
  ),
);

const parseSort = (value: string | undefined): GiveawayListSort => {
  return parseAllowedValue(value, SORT_VALUES, GIVEAWAY_SEARCH_DEFAULTS.sort);
};

const parseGiveawayFilterValue = (value: string | undefined): string => {
  return parseFilterValue(value, STATUS_VALUES, GIVEAWAY_ALL_VALUE);
};

const parseKeyword = (value: string | undefined): string => {
  return parseKeywordParam(value, {
    fallback: GIVEAWAY_SEARCH_DEFAULTS.keyword,
    maxLength: GIVEAWAY_KEYWORD_MAX_LENGTH,
  });
};

export const parseGiveawaySearchParams = (
  searchParams: SearchParamsInput,
): GiveawaySearchParamsState => {
  return {
    keyword: parseKeyword(getSearchParam(searchParams, "keyword")),
    regionId: parseFilterValue(
      getSearchParam(searchParams, "regionId")?.trim(),
      REGION_ID_VALUES,
      GIVEAWAY_ALL_VALUE,
    ),
    status: parseGiveawayFilterValue(getSearchParam(searchParams, "status")?.trim()),
    sort: parseSort(getSearchParam(searchParams, "sort")?.trim()),
  };
};

const isGiveawayStatus = (value: string): value is GiveawayStatus =>
  value === GIVEAWAY_STATUS.AVAILABLE ||
  value === GIVEAWAY_STATUS.IN_PROGRESS ||
  value === GIVEAWAY_STATUS.COMPLETED;

export const toGiveawayListQuery = (
  filters: GiveawaySearchParamsState,
): Omit<GiveawayListQuery, "cursor"> => {
  const regionIdNumber = Number(filters.regionId);

  return {
    keyword: filters.keyword.trim() || undefined,
    regionId:
      filters.regionId !== GIVEAWAY_ALL_VALUE && Number.isInteger(regionIdNumber)
        ? regionIdNumber
        : undefined,
    status: isGiveawayStatus(filters.status) ? filters.status : undefined,
    sort: filters.sort,
    limit: GIVEAWAY_PAGE_LIMIT,
  };
};

export const parseMyGiveawaySearchParams = (
  searchParams: SearchParamsInput,
): GiveawayMyFilterState => {
  return {
    status: parseGiveawayFilterValue(getSearchParam(searchParams, "status")?.trim()),
    sort: parseSort(getSearchParam(searchParams, "sort")?.trim()),
  };
};

export const toMyGiveawayListQuery = (
  filters: GiveawayMyFilterState,
): Omit<GiveawayMyListQuery, "cursor"> => {
  return {
    status: isGiveawayStatus(filters.status) ? filters.status : undefined,
    sort: filters.sort,
    limit: GIVEAWAY_PAGE_LIMIT,
  };
};

export const buildMyGiveawayQueryString = (filters: GiveawayMyFilterState): string => {
  const params = new URLSearchParams();

  if (filters.status !== GIVEAWAY_MY_FILTER_DEFAULTS.status) {
    params.set("status", filters.status);
  }
  if (filters.sort !== GIVEAWAY_MY_FILTER_DEFAULTS.sort) {
    params.set("sort", filters.sort);
  }

  return params.toString();
};

export const buildGiveawayQueryString = (filters: GiveawaySearchParamsState): string => {
  const params = new URLSearchParams();

  if (filters.keyword.trim()) {
    params.set("keyword", filters.keyword.trim());
  }
  if (filters.regionId !== GIVEAWAY_SEARCH_DEFAULTS.regionId) {
    params.set("regionId", filters.regionId);
  }
  if (filters.status !== GIVEAWAY_SEARCH_DEFAULTS.status) {
    params.set("status", filters.status);
  }
  if (filters.sort !== GIVEAWAY_SEARCH_DEFAULTS.sort) {
    params.set("sort", filters.sort);
  }

  return params.toString();
};
