import {
  GIVEAWAY_ALL_VALUE,
  GIVEAWAY_KEYWORD_MAX_LENGTH,
  GIVEAWAY_PAGE_LIMIT,
  GIVEAWAY_REQUEST_STATUS_FILTER_OPTIONS,
  GIVEAWAY_SORT_OPTIONS,
} from "@/lib/constants/giveaway";
import { GIVEAWAY_LIST_SORT, GIVEAWAY_REQUEST_STATUS } from "@/types/giveaway";
import type {
  GiveawayListSort,
  GiveawayRequestMyListQuery,
  GiveawayRequestStatus,
} from "@/types/giveaway";

export interface GiveawayRequestFilterState {
  keyword: string;
  status: string;
  sort: GiveawayListSort;
}

export const GIVEAWAY_REQUEST_FILTER_DEFAULTS = {
  keyword: "",
  status: GIVEAWAY_ALL_VALUE,
  sort: GIVEAWAY_LIST_SORT.LATEST,
} as const satisfies GiveawayRequestFilterState;

type SearchParamsInput = Record<string, string | string[] | undefined>;

const SORT_VALUES = new Set(GIVEAWAY_SORT_OPTIONS.map((option) => option.value));
const STATUS_VALUES = new Set(
  GIVEAWAY_REQUEST_STATUS_FILTER_OPTIONS.filter(
    (option) => option.value !== GIVEAWAY_ALL_VALUE,
  ).map((option) => option.value),
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
  return GIVEAWAY_REQUEST_FILTER_DEFAULTS.sort;
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
  const keyword = value?.trim() ?? GIVEAWAY_REQUEST_FILTER_DEFAULTS.keyword;
  return keyword.slice(0, GIVEAWAY_KEYWORD_MAX_LENGTH);
};

const isGiveawayRequestStatus = (value: string): value is GiveawayRequestStatus =>
  value === GIVEAWAY_REQUEST_STATUS.PENDING ||
  value === GIVEAWAY_REQUEST_STATUS.SELECTED ||
  value === GIVEAWAY_REQUEST_STATUS.REJECTED ||
  value === GIVEAWAY_REQUEST_STATUS.CANCELLED;

export const parseGiveawayRequestSearchParams = (
  searchParams: SearchParamsInput,
): GiveawayRequestFilterState => {
  return {
    keyword: parseKeyword(getParam(searchParams, "keyword")),
    status: parseFilterValue(getParam(searchParams, "status")?.trim(), STATUS_VALUES),
    sort: parseSort(getParam(searchParams, "sort")?.trim()),
  };
};

export const toGiveawayRequestMyListQuery = (
  filters: GiveawayRequestFilterState,
): Omit<GiveawayRequestMyListQuery, "cursor"> => {
  return {
    keyword: filters.keyword.trim() || undefined,
    status: isGiveawayRequestStatus(filters.status) ? filters.status : undefined,
    sort: filters.sort,
    limit: GIVEAWAY_PAGE_LIMIT,
  };
};

export const buildGiveawayRequestQueryString = (filters: GiveawayRequestFilterState): string => {
  const params = new URLSearchParams();

  if (filters.keyword.trim()) {
    params.set("keyword", filters.keyword.trim());
  }
  if (filters.status !== GIVEAWAY_REQUEST_FILTER_DEFAULTS.status) {
    params.set("status", filters.status);
  }
  if (filters.sort !== GIVEAWAY_REQUEST_FILTER_DEFAULTS.sort) {
    params.set("sort", filters.sort);
  }

  return params.toString();
};
