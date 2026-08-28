/**
 * 백엔드 `Pagination` (`response.type.ts`)과 동일한 페이지네이션 형태입니다.
 * // 2026.07.25 정슬기 - [추가] 공통 페이지네이션 타입
 */
export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

export interface CursorPagination {
  limit: number;
  /** 첫 cursor 응답에만 포함되고, 이후 페이지는 null입니다. */
  totalCount: number | null;
  hasNext: boolean;
  nextCursor: string | null;
}

/** GET 목록 API의 success + data + pagination 응답 */
export interface PaginatedApiSuccessResponse<T, TPagination = Pagination> {
  success: true;
  data: T;
  pagination: TPagination;
}
