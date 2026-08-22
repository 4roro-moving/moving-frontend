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
import {
  getSearchParam,
  parseAllowedValue,
  parseFilterValue,
  parseKeywordParam,
  type SearchParamsInput,
} from "@/lib/utils/searchParams";

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

const SORT_VALUES = new Set(GIVEAWAY_SORT_OPTIONS.map((option) => option.value));
const STATUS_VALUES = new Set(
  GIVEAWAY_REQUEST_STATUS_FILTER_OPTIONS.filter(
    (option) => option.value !== GIVEAWAY_ALL_VALUE,
  ).map((option) => option.value),
);

const parseSort = (value: string | undefined): GiveawayListSort => {
  return parseAllowedValue(value, SORT_VALUES, GIVEAWAY_REQUEST_FILTER_DEFAULTS.sort);
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
    keyword: parseKeywordParam(getSearchParam(searchParams, "keyword"), {
      fallback: GIVEAWAY_REQUEST_FILTER_DEFAULTS.keyword,
      maxLength: GIVEAWAY_KEYWORD_MAX_LENGTH,
    }),
    status: parseFilterValue(
      getSearchParam(searchParams, "status")?.trim(),
      STATUS_VALUES,
      GIVEAWAY_ALL_VALUE,
    ),
    sort: parseSort(getSearchParam(searchParams, "sort")?.trim()),
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

export const hasActiveGiveawayRequestFilters = (filters: GiveawayRequestFilterState): boolean => {
  return (
    filters.keyword.trim() !== GIVEAWAY_REQUEST_FILTER_DEFAULTS.keyword ||
    filters.status !== GIVEAWAY_REQUEST_FILTER_DEFAULTS.status
  );
};

export const buildGiveawayRequestQueryString = (filters: GiveawayRequestFilterState): string => {
  const params = new URLSearchParams();

  const keyword = filters.keyword.trim().slice(0, GIVEAWAY_KEYWORD_MAX_LENGTH);
  if (keyword) {
    params.set("keyword", keyword);
  }
  if (filters.status !== GIVEAWAY_REQUEST_FILTER_DEFAULTS.status) {
    params.set("status", filters.status);
  }
  if (filters.sort !== GIVEAWAY_REQUEST_FILTER_DEFAULTS.sort) {
    params.set("sort", filters.sort);
  }

  return params.toString();
};
