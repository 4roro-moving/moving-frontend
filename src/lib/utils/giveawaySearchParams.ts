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

type SearchParamsInput = Record<string, string | string[] | undefined>;

const REGION_ID_VALUES = new Set(REGION_OPTIONS.map((region) => String(region.value)));
const SORT_VALUES = new Set(GIVEAWAY_SORT_OPTIONS.map((option) => option.value));
const STATUS_VALUES = new Set(
  GIVEAWAY_STATUS_FILTER_OPTIONS.filter((option) => option.value !== GIVEAWAY_ALL_VALUE).map(
    (option) => option.value,
  ),
);

const getParam = (searchParams: SearchParamsInput, key: string): string | undefined => {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const parseSort = (value: string | undefined): GiveawayListSort => {
  if (value && SORT_VALUES.has(value as GiveawayListSort)) {
    return value as GiveawayListSort;
  }
  return GIVEAWAY_SEARCH_DEFAULTS.sort;
};

const parseFilterValue = (value: string | undefined, allowed: Set<string>): string => {
  if (!value || value === GIVEAWAY_ALL_VALUE) {
    return GIVEAWAY_ALL_VALUE;
  }
  if (allowed.has(value)) {
    return value;
  }
  return GIVEAWAY_ALL_VALUE;
};

const parseKeyword = (value: string | undefined): string => {
  const keyword = value?.trim() ?? GIVEAWAY_SEARCH_DEFAULTS.keyword;
  return keyword.slice(0, GIVEAWAY_KEYWORD_MAX_LENGTH);
};

export const parseGiveawaySearchParams = (
  searchParams: SearchParamsInput,
): GiveawaySearchParamsState => {
  return {
    keyword: parseKeyword(getParam(searchParams, "keyword")),
    regionId: parseFilterValue(getParam(searchParams, "regionId")?.trim(), REGION_ID_VALUES),
    status: parseFilterValue(getParam(searchParams, "status")?.trim(), STATUS_VALUES),
    sort: parseSort(getParam(searchParams, "sort")?.trim()),
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
    status: parseFilterValue(getParam(searchParams, "status")?.trim(), STATUS_VALUES),
    sort: parseSort(getParam(searchParams, "sort")?.trim()),
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
