import { MOVE_TYPE_VALUES } from "@/lib/constants/moveType";
import { REGION_OPTIONS } from "@/lib/constants/region";
import type { MoveType } from "@/types/move";
import type { MoverSort, MoversListQuery } from "@/types/mover";

export const MOVERS_ALL_VALUE = "all" as const;

export const MOVERS_PAGE_LIMIT = 10;

export const MOVERS_SEARCH_DEFAULTS = {
  keyword: "",
  serviceArea: MOVERS_ALL_VALUE,
  moveType: MOVERS_ALL_VALUE,
  sort: "reviewCount" as MoverSort,
} as const;

export const MOVER_SORT_VALUES: MoverSort[] = ["rating", "reviewCount", "career", "confirmedCount"];

export { MOVE_TYPE_VALUES };

/** URL·필터에서 허용하는 지역 id 문자열 (REGION_OPTIONS와 동일) */
const MOVER_SERVICE_AREA_VALUES = new Set(REGION_OPTIONS.map((region) => String(region.value)));

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
  if ((MOVE_TYPE_VALUES as readonly MoveType[]).includes(value as MoveType)) {
    return value;
  }
  return MOVERS_ALL_VALUE;
}

function parseServiceArea(value: string | undefined): string {
  if (!value || value === MOVERS_ALL_VALUE) {
    return MOVERS_ALL_VALUE;
  }
  if (MOVER_SERVICE_AREA_VALUES.has(value)) {
    return value;
  }
  return MOVERS_ALL_VALUE;
}

/** URL query params를 기사님 찾기 필터 상태로 변환 */
export function parseMoversSearchParams(searchParams: SearchParamsInput): MoversSearchParamsState {
  return {
    keyword: getParam(searchParams, "keyword")?.trim() ?? MOVERS_SEARCH_DEFAULTS.keyword,
    serviceArea: parseServiceArea(getParam(searchParams, "serviceArea")?.trim()),
    moveType: parseMoveType(getParam(searchParams, "moveType")?.trim()),
    sort: parseSort(getParam(searchParams, "sort")?.trim()),
  };
}

/** 필터 → GET /movers 쿼리(페이지 제외). SSR prefetch와 useMovers가 동일 queryKey를 쓰도록 공유 */
export function toMoversListQuery(filters: MoversSearchParamsState): Omit<MoversListQuery, "page"> {
  return {
    keyword: filters.keyword.trim() || undefined,
    sort: filters.sort,
    serviceArea: filters.serviceArea !== MOVERS_ALL_VALUE ? filters.serviceArea : undefined,
    moveType: filters.moveType !== MOVERS_ALL_VALUE ? (filters.moveType as MoveType) : undefined,
    limit: MOVERS_PAGE_LIMIT,
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
