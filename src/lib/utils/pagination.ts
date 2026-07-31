import type { Pagination } from "@/types/pagination";

/**
 * 클라이언트 목록 슬라이스용 페이지네이션 메타
 * 백엔드 `buildPagination`과 동일한 형태를 반환합니다.
 * // 2026.07.30 정슬기 - [추가] mock 계층과 분리 (작성 가능 리뷰 FE 페이지네이션)
 */
export function buildClientPagination(totalCount: number, page: number, limit: number): Pagination {
  const totalPages = Math.max(1, Math.ceil(totalCount / limit) || 1);

  return {
    page,
    limit,
    totalCount,
    totalPages,
    hasNext: page < totalPages,
  };
}
