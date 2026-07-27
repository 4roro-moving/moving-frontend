import type { MoveType } from "@/types/move";
import type { MoverSort } from "@/types/mover";

/**
 * 기사님 찾기 페이지의 필터 상태와 URL query params를 서로 변환합니다.
 * 기본값은 query string에서 생략해 URL을 간결하게 유지합니다.
 */
export const MOVERS_ALL_VALUE = "all" as const;

export const MOVERS_SEARCH_DEFAULTS = {
  keyword: "",
  serviceArea: MOVERS_ALL_VALUE,
  moveType: MOVERS_ALL_VALUE,
  sort: "reviewCount" as MoverSort,
} as const;

export const MOVER_SORT_VALUES: MoverSort[] = ["rating", "reviewCount", "career", "confirmedCount"];

export const MOVE_TYPE_VALUES: MoveType[] = ["SMALL", "HOME", "OFFICE"];

export interface MoversSearchParamsState {
  keyword: string;
  serviceArea: string;
  moveType: string;
  sort: MoverSort;
}

type SearchParamsInput = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParamsInput, key: string): string | undefined {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function parseSort(value: string | undefined): MoverSort {
  if (value && MOVER_SORT_VALUES.includes(value as MoverSort)) {
    return value as MoverSort;
  }
  return MOVERS_SEARCH_DEFAULTS.sort;
}

function parseMoveType(value: string | undefined): string {
  if (!value || value === MOVERS_ALL_VALUE) {
    return MOVERS_ALL_VALUE;
  }
  if (MOVE_TYPE_VALUES.includes(value as MoveType)) {
    return value;
  }
  return MOVERS_ALL_VALUE;
}

/** URL query params를 기사님 찾기 필터 상태로 변환 */
export function parseMoversSearchParams(searchParams: SearchParamsInput): MoversSearchParamsState {
  return {
    keyword: getParam(searchParams, "keyword")?.trim() ?? MOVERS_SEARCH_DEFAULTS.keyword,
    serviceArea:
      getParam(searchParams, "serviceArea")?.trim() || MOVERS_SEARCH_DEFAULTS.serviceArea,
    moveType: parseMoveType(getParam(searchParams, "moveType")?.trim()),
    sort: parseSort(getParam(searchParams, "sort")?.trim()),
  };
}

/** 기본값과 다른 필터만 query string으로 직렬화, 기본값과 같으면 생략 */
export function buildMoversQueryString(filters: MoversSearchParamsState): string {
  const params = new URLSearchParams();

  if (filters.keyword.trim()) {
    params.set("keyword", filters.keyword.trim());
  }
  if (filters.serviceArea !== MOVERS_SEARCH_DEFAULTS.serviceArea) {
    params.set("serviceArea", filters.serviceArea);
  }
  if (filters.moveType !== MOVERS_SEARCH_DEFAULTS.moveType) {
    params.set("moveType", filters.moveType);
  }
  if (filters.sort !== MOVERS_SEARCH_DEFAULTS.sort) {
    params.set("sort", filters.sort);
  }

  return params.toString();
}
