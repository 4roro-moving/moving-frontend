import type { Pagination } from "@/types/pagination";

/**
 * mock 목록용 페이지네이션 계산
 * 백엔드 `buildPagination`과 동일한 형태를 반환합니다.
 * // 2026.07.25 정슬기 - [추가] mock 공통 페이지네이션 유틸
 */
export function buildMockPagination(totalCount: number, page: number, limit: number): Pagination {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return {
    page,
    limit,
    totalCount,
    totalPages,
    hasNext: page < totalPages,
  };
}
