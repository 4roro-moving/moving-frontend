import { REGION_OPTIONS } from "@/lib/constants/region";
import {
  RESIDENCE_REVIEW_PAGE_LIMIT,
  RESIDENCE_REVIEW_SORT_OPTIONS,
} from "@/lib/constants/residenceReview";
import { RESIDENCE_REVIEW_LIST_SORT, RESIDENCE_REVIEW_RATING } from "@/types/residenceReview";
import type { ResidenceReviewListQuery, ResidenceReviewListSort } from "@/types/residenceReview";

export const RESIDENCE_REVIEW_ALL_VALUE = "all" as const;

export const RESIDENCE_REVIEW_SEARCH_DEFAULTS = {
  keyword: "",
  regionId: RESIDENCE_REVIEW_ALL_VALUE,
  rating: RESIDENCE_REVIEW_ALL_VALUE,
  sort: RESIDENCE_REVIEW_LIST_SORT.CREATED_AT,
} as const;

export interface ResidenceReviewSearchParamsState {
  keyword: string;
  regionId: string;
  rating: string;
  sort: ResidenceReviewListSort;
}

type SearchParamsInput = Record<string, string | string[] | undefined>;

const REGION_ID_VALUES = new Set(REGION_OPTIONS.map((region) => String(region.value)));
const SORT_VALUES = new Set(RESIDENCE_REVIEW_SORT_OPTIONS.map((option) => option.value));
const RATING_VALUES = new Set(
  Array.from(
    { length: RESIDENCE_REVIEW_RATING.MAX - RESIDENCE_REVIEW_RATING.MIN + 1 },
    (_, index) => String(RESIDENCE_REVIEW_RATING.MIN + index),
  ),
);

const getParam = (searchParams: SearchParamsInput, key: string): string | undefined => {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const parseSort = (value: string | undefined): ResidenceReviewListSort => {
  if (value && SORT_VALUES.has(value as ResidenceReviewListSort)) {
    return value as ResidenceReviewListSort;
  }
  return RESIDENCE_REVIEW_SEARCH_DEFAULTS.sort;
};

const parseFilterValue = (value: string | undefined, allowed: Set<string>): string => {
  if (!value || value === RESIDENCE_REVIEW_ALL_VALUE) {
    return RESIDENCE_REVIEW_ALL_VALUE;
  }
  if (allowed.has(value)) {
    return value;
  }
  return RESIDENCE_REVIEW_ALL_VALUE;
};

export const parseResidenceReviewSearchParams = (
  searchParams: SearchParamsInput,
): ResidenceReviewSearchParamsState => {
  return {
    keyword: getParam(searchParams, "keyword")?.trim() ?? RESIDENCE_REVIEW_SEARCH_DEFAULTS.keyword,
    regionId: parseFilterValue(getParam(searchParams, "regionId")?.trim(), REGION_ID_VALUES),
    rating: parseFilterValue(getParam(searchParams, "rating")?.trim(), RATING_VALUES),
    sort: parseSort(getParam(searchParams, "sort")?.trim()),
  };
};

export const toResidenceReviewListQuery = (
  filters: ResidenceReviewSearchParamsState,
): Omit<ResidenceReviewListQuery, "cursor"> => {
  const regionIdNumber = Number(filters.regionId);
  const ratingNumber = Number(filters.rating);

  return {
    keyword: filters.keyword.trim() || undefined,
    regionId:
      filters.regionId !== RESIDENCE_REVIEW_ALL_VALUE && Number.isInteger(regionIdNumber)
        ? regionIdNumber
        : undefined,
    rating:
      filters.rating !== RESIDENCE_REVIEW_ALL_VALUE && Number.isInteger(ratingNumber)
        ? (ratingNumber as ResidenceReviewListQuery["rating"])
        : undefined,
    sort: filters.sort,
    limit: RESIDENCE_REVIEW_PAGE_LIMIT,
  };
};

export const buildResidenceReviewQueryString = (
  filters: ResidenceReviewSearchParamsState,
): string => {
  const params = new URLSearchParams();

  if (filters.keyword.trim()) {
    params.set("keyword", filters.keyword.trim());
  }
  if (filters.regionId !== RESIDENCE_REVIEW_SEARCH_DEFAULTS.regionId) {
    params.set("regionId", filters.regionId);
  }
  if (filters.rating !== RESIDENCE_REVIEW_SEARCH_DEFAULTS.rating) {
    params.set("rating", filters.rating);
  }
  if (filters.sort !== RESIDENCE_REVIEW_SEARCH_DEFAULTS.sort) {
    params.set("sort", filters.sort);
  }

  return params.toString();
};
